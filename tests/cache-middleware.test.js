import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

import {
	cacheKeyPrefix,
	defaultTtl,
	cachedPayload,
	freshPayload,
	rateLimitAllowed,
	rateLimitExceeded,
	sessionIdHeader,
	sessionData,
	activityUserId,
	buildResponse,
	buildNext,
	buildReq,
} from '@mocks/cache.js';

vi.mock('../apps/api/services/redisService.js', () => ({
	default: {
		get: vi.fn(),
		set: vi.fn(),
		checkRateLimit: vi.fn(),
		getSession: vi.fn(),
		trackUserActivity: vi.fn(),
	},
}));

const redisService = (await import('../apps/api/services/redisService.js'))
	.default;
const {
	cacheMiddleware,
	rateLimitMiddleware,
	sessionMiddleware,
	activityTrackingMiddleware,
} = await import('../apps/api/middlewares/cache.js');

const resetMocks = () => {
	Object.values(redisService).forEach((mockFn) => {
		if (typeof mockFn?.mockReset === 'function') {
			mockFn.mockReset();
		}
	});
};

describe('cache middleware suite', () => {
	const consoleErrorSpy = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	beforeEach(() => {
		resetMocks();
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	describe('cacheMiddleware', () => {
		it('returns cached response when available', async () => {
			const req = buildReq();
			const res = buildResponse();
			const next = buildNext();

			redisService.get.mockResolvedValueOnce(cachedPayload);

			const middleware = cacheMiddleware();
			await middleware(req, res, next);

			expect(redisService.get).toHaveBeenCalledWith(
				`${cacheKeyPrefix}${req.originalUrl}`,
			);
			expect(res.json).toHaveBeenCalledWith(cachedPayload);
			expect(next).not.toHaveBeenCalled();
		});

		it('stores fresh response when cache misses', async () => {
			const req = buildReq();
			const res = buildResponse();
			const next = buildNext();

			const middleware = cacheMiddleware();

			redisService.get.mockResolvedValueOnce(null);
			await middleware(req, res, next);

			expect(redisService.get).toHaveBeenCalled();
			expect(next).toHaveBeenCalledTimes(1);

			await res.json(freshPayload);

			expect(redisService.set).toHaveBeenCalledWith(
				`${cacheKeyPrefix}${req.originalUrl}`,
				freshPayload,
				defaultTtl,
			);
		});

		it('bypasses caching for non-GET requests', async () => {
			const req = buildReq({ method: 'POST' });
			const res = buildResponse();
			const next = buildNext();

			const middleware = cacheMiddleware();
			await middleware(req, res, next);

			expect(redisService.get).not.toHaveBeenCalled();
			expect(redisService.set).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledTimes(1);
		});

		it('continues without cache on redis errors', async () => {
			const req = buildReq();
			const res = buildResponse();
			const next = buildNext();

			redisService.get.mockRejectedValueOnce(new Error('redis offline'));

			const middleware = cacheMiddleware();
			await middleware(req, res, next);

			expect(next).toHaveBeenCalledTimes(1);
		});
	});

	describe('rateLimitMiddleware', () => {
		it('sets rate limit headers and calls next when allowed', async () => {
			const req = buildReq();
			const res = buildResponse();
			const next = buildNext();

			redisService.checkRateLimit.mockResolvedValueOnce(rateLimitAllowed);

			const middleware = rateLimitMiddleware();
			await middleware(req, res, next);

			expect(res.set).toHaveBeenCalledWith({
				'X-RateLimit-Limit': rateLimitAllowed.limit,
				'X-RateLimit-Remaining': rateLimitAllowed.remaining,
				'X-RateLimit-Reset': rateLimitAllowed.resetTime,
			});
			expect(next).toHaveBeenCalledTimes(1);
		});

		it('returns 429 when the rate limit is exceeded', async () => {
			const req = buildReq();
			const res = buildResponse();
			const next = buildNext();

			redisService.checkRateLimit.mockResolvedValueOnce(rateLimitExceeded);

			const middleware = rateLimitMiddleware();
			await middleware(req, res, next);

			expect(res.status).toHaveBeenCalledWith(429);
			expect(res.json).toHaveBeenCalledWith({
				error: 'Rate limit exceeded',
				message: `Too many requests. Try again in ${rateLimitExceeded.resetTime} seconds.`,
				retryAfter: rateLimitExceeded.resetTime,
			});
			expect(next).not.toHaveBeenCalled();
		});

		it('continues without rate limiting on redis errors', async () => {
			const req = buildReq();
			const res = buildResponse();
			const next = buildNext();

			redisService.checkRateLimit.mockRejectedValueOnce(
				new Error('redis down'),
			);

			const middleware = rateLimitMiddleware();
			await middleware(req, res, next);

			expect(next).toHaveBeenCalledTimes(1);
		});
	});

	describe('sessionMiddleware', () => {
		it('attaches session data when present', async () => {
			const req = buildReq({ headers: { 'x-session-id': sessionIdHeader } });
			const res = buildResponse();
			const next = buildNext();

			redisService.getSession.mockResolvedValueOnce(sessionData);

			const middleware = sessionMiddleware();
			await middleware(req, res, next);

			expect(req.session).toEqual(sessionData);
			expect(next).toHaveBeenCalledTimes(1);
		});

		it('handles redis errors without throwing', async () => {
			const req = buildReq({ headers: { 'x-session-id': sessionIdHeader } });
			const res = buildResponse();
			const next = buildNext();

			redisService.getSession.mockRejectedValueOnce(new Error('redis error'));

			const middleware = sessionMiddleware();
			await middleware(req, res, next);

			expect(req.session).toBeUndefined();
			expect(next).toHaveBeenCalledTimes(1);
		});
	});

	describe('activityTrackingMiddleware', () => {
		it('tracks activity when a user id exists', async () => {
			const req = buildReq({
				user: { id: activityUserId },
			});
			const res = buildResponse();
			const next = buildNext();

			redisService.trackUserActivity.mockResolvedValueOnce();

			const middleware = activityTrackingMiddleware();
			await middleware(req, res, next);

			expect(redisService.trackUserActivity).toHaveBeenCalled();
			expect(next).toHaveBeenCalledTimes(1);
		});

		it('ignores tracking errors and continues', async () => {
			const req = buildReq({ user: { id: activityUserId } });
			const res = buildResponse();
			const next = buildNext();

			redisService.trackUserActivity.mockRejectedValueOnce(
				new Error('redis down'),
			);

			const middleware = activityTrackingMiddleware();
			await middleware(req, res, next);

			expect(next).toHaveBeenCalledTimes(1);
		});
	});
});
