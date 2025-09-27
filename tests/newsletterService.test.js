import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';

import {
	baseSubscriber,
	mockSubscriberWithPreferences,
	mockSubscriberWithoutMatches,
	mockSubscriberIds,
	mockCandidates,
	filteredCandidates,
	createCandidate,
} from '@mocks/newsletterService.js';

const seekerFindManyMock = vi.fn();
const newsletterSubscriberFindManyMock = vi.fn();
const resendSendMock = vi.fn();
const sendEmailMock = vi.fn();

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => ({
		seeker: { findMany: seekerFindManyMock },
		newsletterSubscriber: { findMany: newsletterSubscriberFindManyMock },
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

let sendCandidatesToNewSubscriber;
let sendCandidatesToSubscribers;
let sendFilteredCandidatesToSubscribers;
let checkAndSendFilteredNewsletter;

let consoleLogSpy;
let consoleErrorSpy;

beforeAll(async () => {
	consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
	consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

	const service = await import('../apps/api/services/newsletterService.js');

	({
		sendCandidatesToNewSubscriber,
		sendCandidatesToSubscribers,
		sendFilteredCandidatesToSubscribers,
		checkAndSendFilteredNewsletter,
	} = service);
});

beforeEach(() => {
	[
		seekerFindManyMock,
		newsletterSubscriberFindManyMock,
		resendSendMock,
		sendEmailMock,
	].forEach((mockFn) => mockFn.mockReset());
});

afterEach(() => {
	vi.unstubAllEnvs();
});

afterAll(() => {
	consoleLogSpy.mockRestore();
	consoleErrorSpy.mockRestore();
});

describe('sendCandidatesToNewSubscriber', () => {
	it('returns early when no candidates are available', async () => {
		seekerFindManyMock.mockResolvedValue([]);

		await sendCandidatesToNewSubscriber(baseSubscriber);

		expect(resendSendMock).not.toHaveBeenCalled();
		expect(sendEmailMock).not.toHaveBeenCalled();
	});

	it('uses Resend when candidates are found and API key is provided', async () => {
		vi.stubEnv('RESEND_API_KEY', 'resend-key');
		seekerFindManyMock.mockResolvedValue(mockCandidates);
		resendSendMock.mockResolvedValue({ id: 'resend-email-id' });

		await sendCandidatesToNewSubscriber(baseSubscriber);

		expect(resendSendMock).toHaveBeenCalledTimes(1);
		expect(resendSendMock).toHaveBeenCalledWith(
			expect.objectContaining({
				to: baseSubscriber.email,
				subject: 'Новые соискатели с сайта WorkNow',
				html: expect.stringContaining(mockCandidates[0].name),
			}),
		);
		expect(sendEmailMock).not.toHaveBeenCalled();
	});

	it('falls back to Gmail when Resend fails', async () => {
		vi.stubEnv('RESEND_API_KEY', 'resend-key');
		seekerFindManyMock.mockResolvedValue(mockCandidates);
		resendSendMock.mockRejectedValueOnce(new Error('Resend failure'));
		sendEmailMock.mockResolvedValueOnce(undefined);

		await sendCandidatesToNewSubscriber(baseSubscriber);

		expect(sendEmailMock).toHaveBeenCalledWith(
			baseSubscriber.email,
			'Новые соискатели с сайта WorkNow',
			expect.stringContaining(mockCandidates[0].name),
		);
	});

	it('propagates an error when both Resend and Gmail fail', async () => {
		vi.stubEnv('RESEND_API_KEY', 'resend-key');
		seekerFindManyMock.mockResolvedValue(mockCandidates);
		resendSendMock.mockRejectedValueOnce(new Error('Resend failure'));
		sendEmailMock.mockRejectedValueOnce(new Error('SMTP failure'));

		await expect(
			sendCandidatesToNewSubscriber(baseSubscriber),
		).rejects.toThrow(/Resend failure/);
	});
});

describe('sendCandidatesToSubscribers', () => {
	beforeEach(() => {
		vi.stubEnv('RESEND_API_KEY', 'resend-key');
	});

	it('requests active subscribers when no filter is provided', async () => {
		newsletterSubscriberFindManyMock.mockResolvedValue([
			baseSubscriber,
			mockSubscriberWithoutMatches,
		]);
		seekerFindManyMock.mockResolvedValue(mockCandidates);
		resendSendMock.mockResolvedValue({});

		await sendCandidatesToSubscribers();

		expect(newsletterSubscriberFindManyMock).toHaveBeenCalledWith({
			where: { isActive: true },
		});
		expect(resendSendMock).toHaveBeenCalledTimes(2);
	});

	it('applies the provided subscriber filter', async () => {
		newsletterSubscriberFindManyMock.mockResolvedValue([baseSubscriber]);
		seekerFindManyMock.mockResolvedValue(mockCandidates);
		resendSendMock.mockResolvedValue({});

		await sendCandidatesToSubscribers(mockSubscriberIds);

		expect(newsletterSubscriberFindManyMock).toHaveBeenCalledWith({
			where: { id: { in: mockSubscriberIds }, isActive: true },
		});
	});

	it('falls back to Gmail when Resend fails for a subscriber', async () => {
		newsletterSubscriberFindManyMock.mockResolvedValue([
			baseSubscriber,
			{ ...baseSubscriber, id: 3, email: 'second@example.com' },
		]);
		seekerFindManyMock.mockResolvedValue(mockCandidates);
		resendSendMock
			.mockRejectedValueOnce(new Error('Resend down'))
			.mockResolvedValueOnce({});
		sendEmailMock.mockResolvedValueOnce(undefined);

		await sendCandidatesToSubscribers();

		expect(sendEmailMock).toHaveBeenCalledWith(
			baseSubscriber.email,
			'Новые соискатели с сайта WorkNow',
			expect.stringContaining(mockCandidates[0].name),
		);
	});
});

describe('sendFilteredCandidatesToSubscribers', () => {
	beforeEach(() => {
		vi.stubEnv('RESEND_API_KEY', 'resend-key');
	});

	it('sends only candidates that match subscriber preferences', async () => {
		newsletterSubscriberFindManyMock.mockResolvedValue([
			mockSubscriberWithPreferences,
			mockSubscriberWithoutMatches,
		]);

		const candidates = [
			filteredCandidates[0],
			createCandidate({
				id: 405,
				name: 'Non Matching',
				city: 'Beer Sheva',
				isDemanded: false,
				languages: ['Russian'],
			}),
		];

		seekerFindManyMock.mockResolvedValue(candidates);
		resendSendMock.mockResolvedValue({});

		await sendFilteredCandidatesToSubscribers();

		expect(resendSendMock).toHaveBeenCalledTimes(1);
		expect(resendSendMock).toHaveBeenCalledWith(
			expect.objectContaining({
				to: mockSubscriberWithPreferences.email,
				html: expect.stringContaining(filteredCandidates[0].name),
			}),
		);
	});

	it('falls back to Gmail when Resend fails for filtered subscribers', async () => {
		newsletterSubscriberFindManyMock.mockResolvedValue([
			mockSubscriberWithPreferences,
		]);
		seekerFindManyMock.mockResolvedValue(filteredCandidates);
		resendSendMock.mockRejectedValueOnce(new Error('Resend offline'));
		sendEmailMock.mockResolvedValueOnce(undefined);

		await sendFilteredCandidatesToSubscribers();

		expect(sendEmailMock).toHaveBeenCalledWith(
			mockSubscriberWithPreferences.email,
			'Новые соискатели с сайта WorkNow',
			expect.stringContaining(filteredCandidates[0].name),
		);
	});

	it('returns immediately when there are no active subscribers', async () => {
		newsletterSubscriberFindManyMock.mockResolvedValue([]);

		await sendFilteredCandidatesToSubscribers();

		expect(seekerFindManyMock).not.toHaveBeenCalled();
		expect(resendSendMock).not.toHaveBeenCalled();
	});
});

describe('checkAndSendFilteredNewsletter', () => {
	it('does not throw errors when invoked', async () => {
		await expect(checkAndSendFilteredNewsletter()).resolves.toBeUndefined();
	});
});
