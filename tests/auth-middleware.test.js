import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
	buildAuthHeader,
	validJwt,
	validJwtPayload,
	missingAuthHeader,
	malformedJwt,
	jwtWithoutSub,
	invalidBase64Jwt,
	adminUserId,
	regularUserId,
	adminUserRecord,
	regularUserRecord,
} from '@mocks/auth.js';

const findUniqueMock = vi.fn();

vi.mock('@prisma/client', () => {
	const PrismaClient = vi.fn(() => ({
		user: {
			findUnique: findUniqueMock,
		},
	}));
	return {
		default: { PrismaClient },
		PrismaClient,
	};
});

const { requireAuth, requireAdmin } = await import(
	'../apps/api/middlewares/auth.js'
);

const createRequest = (overrides = {}) => ({
	headers: overrides.headers || {},
	user: overrides.user,
});

const createResponse = () => {
	const res = {
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	};
	return res;
};

describe('auth middleware', () => {
	const consoleErrorSpy = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	beforeEach(() => {
		findUniqueMock.mockReset();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	describe('requireAuth', () => {
		it('populates req.user and calls next for a valid token', async () => {
			const req = createRequest({ headers: buildAuthHeader(validJwt) });
			const res = createResponse();
			const next = vi.fn();

			await requireAuth(req, res, next);

			expect(next).toHaveBeenCalledTimes(1);
			expect(res.status).not.toHaveBeenCalled();
			expect(req.user).toEqual({
				clerkUserId: validJwtPayload.sub,
				email: validJwtPayload.email,
				firstName: validJwtPayload.first_name,
				lastName: validJwtPayload.last_name,
				imageUrl: validJwtPayload.image_url,
			});
		});

		it('returns 401 when authorization header is missing', async () => {
			const req = createRequest({ headers: missingAuthHeader });
			const res = createResponse();
			const next = vi.fn();

			await requireAuth(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				error: 'No authorization token provided',
			});
			expect(next).not.toHaveBeenCalled();
		});

		it('returns 401 for malformed JWT structures', async () => {
			const req = createRequest({ headers: buildAuthHeader(malformedJwt) });
			const res = createResponse();
			const next = vi.fn();

			await requireAuth(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token format' });
			expect(next).not.toHaveBeenCalled();
		});

		it('returns 401 when JWT payload lacks user id', async () => {
			const req = createRequest({ headers: buildAuthHeader(jwtWithoutSub) });
			const res = createResponse();
			const next = vi.fn();

			await requireAuth(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Invalid token - no user ID',
			});
			expect(next).not.toHaveBeenCalled();
		});

		it('returns 401 when payload decoding fails', async () => {
			const req = createRequest({ headers: buildAuthHeader(invalidBase64Jwt) });
			const res = createResponse();
			const next = vi.fn();

			await requireAuth(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Token verification failed',
			});
			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('requireAdmin', () => {
		it('returns 401 when user identifier is missing', async () => {
			const req = createRequest({ headers: {} });
			const res = createResponse();
			const next = vi.fn();

			await requireAdmin(req, res, next);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith({ error: 'Не авторизован' });
			expect(next).not.toHaveBeenCalled();
		});

		it('returns 403 when user is not an admin', async () => {
			const req = createRequest({ headers: { 'user-id': regularUserId } });
			const res = createResponse();
			const next = vi.fn();

			findUniqueMock.mockResolvedValueOnce(regularUserRecord);

			await requireAdmin(req, res, next);

			expect(findUniqueMock).toHaveBeenCalledWith({
				where: { id: regularUserId },
				select: { isAdmin: true },
			});
			expect(res.status).toHaveBeenCalledWith(403);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Доступ запрещен. Требуются права администратора.',
			});
			expect(next).not.toHaveBeenCalled();
		});

		it('calls next when user has admin rights', async () => {
			const req = createRequest({ headers: { 'user-id': adminUserId } });
			const res = createResponse();
			const next = vi.fn();

			findUniqueMock.mockResolvedValueOnce(adminUserRecord);

			await requireAdmin(req, res, next);

			expect(res.status).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledTimes(1);
		});

		it('returns 500 when Prisma lookup throws', async () => {
			const req = createRequest({ headers: { 'user-id': adminUserId } });
			const res = createResponse();
			const next = vi.fn();

			findUniqueMock.mockRejectedValueOnce(new Error('database offline'));

			await requireAdmin(req, res, next);

			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Ошибка проверки прав доступа',
			});
			expect(next).not.toHaveBeenCalled();
		});
	});
});
