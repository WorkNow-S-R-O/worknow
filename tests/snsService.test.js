import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';

import {
	mockEmail,
	mockVerificationCode,
	verificationRecord,
	expiredVerificationRecord,
	attemptLimitVerificationRecord,
	mismatchedVerificationRecord,
} from '@mocks/snsService.js';

const upsertMock = vi.fn();
const findUniqueMock = vi.fn();
const deleteMock = vi.fn();
const updateMock = vi.fn();
const deleteManyMock = vi.fn();
const resendSendMock = vi.fn();
const sendEmailMock = vi.fn();
const awsConfigUpdateMock = vi.fn();

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => ({
		newsletterVerification: {
			upsert: upsertMock,
			findUnique: findUniqueMock,
			delete: deleteMock,
			update: updateMock,
			deleteMany: deleteManyMock,
		},
	})),
}));

vi.mock('resend', () => ({
	Resend: vi.fn(() => ({
		emails: { send: resendSendMock },
	})),
}));

vi.mock('../apps/api/utils/mailer.js', () => ({
	sendEmail: sendEmailMock,
}));

vi.mock('aws-sdk', () => ({
	__esModule: true,
	default: {
		SNS: vi.fn(() => ({
			createTopic: vi.fn(() => ({ promise: () => Promise.resolve({ TopicArn: 'arn:topic' }) })),
			listTopics: vi.fn(() => ({ promise: () => Promise.resolve({ Topics: [] }) })),
			subscribe: vi.fn(() => ({ promise: () => Promise.resolve({}) })),
			publish: vi.fn(() => ({ promise: () => Promise.resolve({ MessageId: 'sns-message' }) })),
		})),
		config: { update: awsConfigUpdateMock },
	},
}));

let generateVerificationCode;
let sendVerificationCode;
let storeVerificationCode;
let verifyCode;
let cleanupExpiredVerifications;

let consoleLogSpy;
let consoleErrorSpy;

beforeAll(async () => {
	consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
	consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

	const service = await import('../apps/api/services/snsService.js');

	({
		generateVerificationCode,
		sendVerificationCode,
		storeVerificationCode,
		verifyCode,
		cleanupExpiredVerifications,
	} = service);
});

beforeEach(() => {
	[
		upsertMock,
		findUniqueMock,
		deleteMock,
		updateMock,
		deleteManyMock,
		resendSendMock,
		sendEmailMock,
	].forEach((mockFn) => mockFn.mockReset());
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.useRealTimers();
});

afterAll(() => {
	consoleLogSpy.mockRestore();
	consoleErrorSpy.mockRestore();
});

describe('generateVerificationCode', () => {
	it('returns a six-digit numeric string', () => {
		const code = generateVerificationCode();

		expect(code).toHaveLength(6);
		expect(code).toMatch(/^\d{6}$/);
	});
});

describe('sendVerificationCode', () => {
	it('sends the verification code via Resend when API key is set', async () => {
		vi.stubEnv('RESEND_API_KEY', 'resend-key');
		resendSendMock.mockResolvedValueOnce({ id: 'resend-id' });

		const result = await sendVerificationCode(mockEmail, mockVerificationCode);

		expect(resendSendMock).toHaveBeenCalledWith(
			expect.objectContaining({
				to: mockEmail,
				subject: 'WorkNow - Код подтверждения',
				html: expect.stringContaining(mockVerificationCode),
			}),
		);
		expect(result).toEqual({ success: true, messageId: 'resend-id' });
		expect(sendEmailMock).not.toHaveBeenCalled();
	});

	it('falls back to Gmail when Resend fails', async () => {
		vi.stubEnv('RESEND_API_KEY', 'resend-key');
		resendSendMock.mockRejectedValueOnce(new Error('Resend offline'));
		sendEmailMock.mockResolvedValueOnce(undefined);

		const result = await sendVerificationCode(mockEmail, mockVerificationCode);

		expect(sendEmailMock).toHaveBeenCalledWith(
			mockEmail,
			'WorkNow - Код подтверждения',
			expect.stringContaining(mockVerificationCode),
		);
		expect(result.success).toBe(true);
		expect(result.messageId).toMatch(/^gmail-fallback-/);
	});

	it('uses Gmail directly when Resend API key is not provided', async () => {
		sendEmailMock.mockResolvedValueOnce(undefined);

		const result = await sendVerificationCode(mockEmail, mockVerificationCode);

		expect(resendSendMock).not.toHaveBeenCalled();
		expect(sendEmailMock).toHaveBeenCalled();
		expect(result.success).toBe(true);
	});

	it('simulates delivery when both Resend and Gmail fail', async () => {
		vi.stubEnv('RESEND_API_KEY', 'resend-key');
		resendSendMock.mockRejectedValueOnce(new Error('Resend offline'));
		sendEmailMock.mockRejectedValueOnce(new Error('SMTP offline'));
		vi.useFakeTimers();

		const resultPromise = sendVerificationCode(mockEmail, mockVerificationCode);
		await vi.runOnlyPendingTimersAsync();
		const result = await resultPromise;

		expect(resendSendMock).toHaveBeenCalled();
		expect(sendEmailMock).toHaveBeenCalled();
		expect(result.success).toBe(true);
		expect(result.messageId).toMatch(/^dev-simulation-/);
	});
});

describe('storeVerificationCode', () => {
	it('upserts verification records with 10 minute expiration', async () => {
		upsertMock.mockResolvedValueOnce(undefined);
		const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_000_000);

		const didStore = await storeVerificationCode(mockEmail, mockVerificationCode);

		expect(didStore).toBe(true);

		const payload = upsertMock.mock.calls[0][0];
		const expectedExpiry = new Date(1_000_000 + 10 * 60 * 1000);
		expect(payload.where).toEqual({ email: mockEmail });
		expect(payload.update).toMatchObject({
			code: mockVerificationCode,
			attempts: 0,
		});
		expect(payload.update.expiresAt).toEqual(expectedExpiry);

		nowSpy.mockRestore();
	});

	it('propagates errors from prisma', async () => {
		upsertMock.mockRejectedValueOnce(new Error('db down'));

		await expect(
			storeVerificationCode(mockEmail, mockVerificationCode),
		).rejects.toThrow('db down');
	});
});

describe('verifyCode', () => {
	it('returns a descriptive message when a verification record is missing', async () => {
		findUniqueMock.mockResolvedValueOnce(null);

		const result = await verifyCode(mockEmail, mockVerificationCode);

		expect(result).toEqual({
			valid: false,
			message: 'Verification code not found',
		});
	});

	it('invalidates expired verification codes', async () => {
		findUniqueMock.mockResolvedValueOnce(expiredVerificationRecord);
		deleteMock.mockResolvedValueOnce(undefined);

		const result = await verifyCode(mockEmail, mockVerificationCode);

		expect(deleteMock).toHaveBeenCalledWith({ where: { email: mockEmail } });
		expect(result).toEqual({
			valid: false,
			message: 'Verification code has expired',
		});
	});

	it('prevents further attempts after the limit is reached', async () => {
		findUniqueMock.mockResolvedValueOnce(attemptLimitVerificationRecord);
		deleteMock.mockResolvedValueOnce(undefined);

		const result = await verifyCode(mockEmail, mockVerificationCode);

		expect(deleteMock).toHaveBeenCalledWith({ where: { email: mockEmail } });
		expect(result).toEqual({
			valid: false,
			message: 'Too many attempts. Please request a new code.',
		});
	});

	it('returns success when the provided code matches', async () => {
		findUniqueMock.mockResolvedValueOnce(verificationRecord);
		updateMock.mockResolvedValueOnce(undefined);
		deleteMock.mockResolvedValueOnce(undefined);

		const result = await verifyCode(mockEmail, mockVerificationCode);

		expect(updateMock).toHaveBeenCalledWith({
			where: { email: mockEmail },
			data: { attempts: verificationRecord.attempts + 1 },
		});
		expect(deleteMock).toHaveBeenCalledWith({ where: { email: mockEmail } });
		expect(result).toEqual({ valid: true, message: 'Verification successful' });
	});

	it('reports invalid codes without deleting the verification entry', async () => {
		findUniqueMock.mockResolvedValueOnce(mismatchedVerificationRecord);
		updateMock.mockResolvedValueOnce(undefined);

		const result = await verifyCode(mockEmail, mockVerificationCode);

		expect(updateMock).toHaveBeenCalled();
		expect(deleteMock).not.toHaveBeenCalled();
		expect(result).toEqual({ valid: false, message: 'Invalid verification code' });
	});

	it('propagates unexpected prisma errors', async () => {
		findUniqueMock.mockRejectedValueOnce(new Error('db failure'));

		await expect(verifyCode(mockEmail, mockVerificationCode)).rejects.toThrow(
			'db failure',
		);
	});
});

describe('cleanupExpiredVerifications', () => {
	it('returns the number of deleted verification entries', async () => {
		deleteManyMock.mockResolvedValueOnce({ count: 3 });

		const removed = await cleanupExpiredVerifications();

		expect(deleteManyMock).toHaveBeenCalledWith({
			where: { expiresAt: { lt: expect.any(Date) } },
		});
		expect(removed).toBe(3);
	});

	it('propagates prisma errors', async () => {
		deleteManyMock.mockRejectedValueOnce(new Error('db failure'));

		await expect(cleanupExpiredVerifications()).rejects.toThrow('db failure');
	});
});
