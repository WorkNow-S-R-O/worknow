import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

import {
	cacheKey,
	cacheValue,
	sessionId,
	sessionPayload,
	rateLimitIdentifier,
	notificationChannel,
	notificationMessage,
	userActivity,
	mockJobCacheParams,
} from '@mocks/redisService.js';

const setexMock = vi.fn();
const getMock = vi.fn();
const delMock = vi.fn();
const incrMock = vi.fn();
const expireMock = vi.fn();
const ttlMock = vi.fn();
const keysMock = vi.fn();
const publishMock = vi.fn();
const infoMock = vi.fn();
const pingMock = vi.fn();
const quitMock = vi.fn();
const lpushMock = vi.fn();
const ltrimMock = vi.fn();
const onMock = vi.fn();

const redisInstance = {
	setex: setexMock,
	get: getMock,
	del: delMock,
	incr: incrMock,
	expire: expireMock,
	ttl: ttlMock,
	keys: keysMock,
	publish: publishMock,
	info: infoMock,
	ping: pingMock,
	quit: quitMock,
	lpush: lpushMock,
	ltrim: ltrimMock,
	on: onMock,
	status: 'ready',
};

const RedisConstructorMock = vi.fn(() => redisInstance);

vi.mock('ioredis', () => ({
	__esModule: true,
	default: RedisConstructorMock,
}));

let redisService;

beforeAll(async () => {
	({ default: redisService } = await import('../apps/api/services/redisService.js'));
});

beforeEach(() => {
	[
		setexMock,
		getMock,
		delMock,
		incrMock,
		expireMock,
		ttlMock,
		keysMock,
		publishMock,
		infoMock,
		pingMock,
		quitMock,
		lpushMock,
		ltrimMock,
		onMock,
	].forEach((mockFn) => mockFn.mockReset());

	redisInstance.status = 'ready';
});

describe('redisService core cache helpers', () => {
	it('serializes objects when setting cache entries', async () => {
		setexMock.mockResolvedValueOnce('OK');

		const didCache = await redisService.set(cacheKey, cacheValue);

		expect(setexMock).toHaveBeenCalledWith(
			cacheKey,
			3600,
			JSON.stringify(cacheValue),
		);
		expect(didCache).toBe(true);
	});

	it('returns false when redis#setex throws', async () => {
		setexMock.mockRejectedValueOnce(new Error('offline'));

		const didCache = await redisService.set(cacheKey, cacheValue);

		expect(didCache).toBe(false);
	});

	it('returns parsed JSON when cache contains structured data', async () => {
		getMock.mockResolvedValueOnce(JSON.stringify(cacheValue));

		const value = await redisService.get(cacheKey);

		expect(getMock).toHaveBeenCalledWith(cacheKey);
		expect(value).toEqual(cacheValue);
	});

	it('returns raw strings when stored value is not JSON', async () => {
		getMock.mockResolvedValueOnce('primitive-value');

		const value = await redisService.get(cacheKey);

		expect(value).toBe('primitive-value');
	});

	it('returns null on cache miss or redis failures', async () => {
		getMock.mockResolvedValueOnce(null);
		const missResult = await redisService.get(cacheKey);

		getMock.mockRejectedValueOnce(new Error('redis down'));
		const errorResult = await redisService.get(cacheKey);

		expect(missResult).toBeNull();
		expect(errorResult).toBeNull();
	});

	it('deletes cache keys and reports success', async () => {
		delMock.mockResolvedValueOnce(1);

		const didDelete = await redisService.del(cacheKey);

		expect(delMock).toHaveBeenCalledWith(cacheKey);
		expect(didDelete).toBe(true);
	});

	it('returns false when deletion fails', async () => {
		delMock.mockRejectedValueOnce(new Error('cannot delete'));

		const didDelete = await redisService.del(cacheKey);

		expect(didDelete).toBe(false);
	});
});

describe('session helpers', () => {
	it('stores, retrieves and deletes session entries with proper prefixes', async () => {
		setexMock.mockResolvedValue('OK');
		getMock.mockResolvedValueOnce(JSON.stringify(sessionPayload));
		delMock.mockResolvedValueOnce(1);

		await redisService.setSession(sessionId, sessionPayload);
		const fetched = await redisService.getSession(sessionId);
		await redisService.deleteSession(sessionId);

		expect(setexMock).toHaveBeenCalledWith(
			`session:${sessionId}`,
			86400,
			JSON.stringify(sessionPayload),
		);
		expect(getMock).toHaveBeenCalledWith(`session:${sessionId}`);
		expect(fetched).toEqual(sessionPayload);
		expect(delMock).toHaveBeenCalledWith(`session:${sessionId}`);
	});
});

describe('rate limiting', () => {
	it('creates an expiring counter and reports remaining attempts', async () => {
		incrMock.mockResolvedValueOnce(1);
		expireMock.mockResolvedValueOnce(1);
		ttlMock.mockResolvedValueOnce(3500);

		const result = await redisService.checkRateLimit(rateLimitIdentifier);

		expect(incrMock).toHaveBeenCalledWith(`rate_limit:${rateLimitIdentifier}`);
		expect(expireMock).toHaveBeenCalledWith(`rate_limit:${rateLimitIdentifier}`, 3600);
		expect(result).toEqual({
			allowed: true,
			remaining: 99,
			resetTime: 3500,
			limit: 100,
		});
	});

	it('returns a permissive fallback when redis fails', async () => {
		incrMock.mockRejectedValueOnce(new Error('redis offline'));

		const result = await redisService.checkRateLimit(rateLimitIdentifier);

		expect(result).toEqual({
			allowed: true,
			remaining: 100,
			resetTime: 3600,
			limit: 100,
		});
	});
});

describe('jobs cache helpers', () => {
	it('delegates to redis#setex with the composed jobs key', async () => {
		setexMock.mockResolvedValue('OK');

		await redisService.cacheJobs(
			mockJobCacheParams.category,
			mockJobCacheParams.city,
			mockJobCacheParams.page,
			mockJobCacheParams.jobs,
		);

		expect(setexMock).toHaveBeenCalledWith(
			`jobs:${mockJobCacheParams.category}:${mockJobCacheParams.city}:${mockJobCacheParams.page}`,
			300,
			JSON.stringify(mockJobCacheParams.jobs),
		);
	});

	it('retrieves cached jobs with the same composed key', async () => {
		getMock.mockResolvedValueOnce(JSON.stringify(mockJobCacheParams.jobs));

		await redisService.getCachedJobs(
			mockJobCacheParams.category,
			mockJobCacheParams.city,
			mockJobCacheParams.page,
		);

		expect(getMock).toHaveBeenCalledWith(
			`jobs:${mockJobCacheParams.category}:${mockJobCacheParams.city}:${mockJobCacheParams.page}`,
		);
	});

	it('invalidates all cached job keys when present', async () => {
		keysMock.mockResolvedValueOnce(['jobs:a:b:1', 'jobs:c:d:2']);
		delMock.mockResolvedValueOnce(2);

		const result = await redisService.invalidateJobsCache();

		expect(keysMock).toHaveBeenCalledWith('jobs:*');
		expect(delMock).toHaveBeenCalledWith('jobs:a:b:1', 'jobs:c:d:2');
		expect(result).toBe(true);
	});

	it('returns false when cache invalidation fails', async () => {
		keysMock.mockRejectedValueOnce(new Error('redis offline'));

		const result = await redisService.invalidateJobsCache();

		expect(result).toBe(false);
	});
});

describe('activity tracking and notifications', () => {
	it('records user activity with capped history and returns success', async () => {
		lpushMock.mockResolvedValueOnce(1);
		ltrimMock.mockResolvedValueOnce('OK');
		expireMock.mockResolvedValueOnce(1);

		const didTrack = await redisService.trackUserActivity(
			userActivity.userId,
			userActivity.action,
		);

		expect(lpushMock).toHaveBeenCalledWith(
			`activity:${userActivity.userId}`,
			expect.any(String),
		);

		const [, payload] = lpushMock.mock.calls[0];
		const parsed = JSON.parse(payload);
		expect(parsed.action).toBe(userActivity.action);
		expect(parsed).toHaveProperty('timestamp');

		expect(ltrimMock).toHaveBeenCalledWith(`activity:${userActivity.userId}`, 0, 99);
		expect(expireMock).toHaveBeenCalledWith(`activity:${userActivity.userId}`, 86400);
		expect(didTrack).toBe(true);
	});

	it('publishes notifications as JSON payloads', async () => {
		publishMock.mockResolvedValueOnce(1);

		const didPublish = await redisService.publishNotification(
			notificationChannel,
			notificationMessage,
		);

		expect(publishMock).toHaveBeenCalledWith(
			notificationChannel,
			JSON.stringify(notificationMessage),
		);
		expect(didPublish).toBe(true);
	});
});

describe('health checks and shutdown', () => {
	it('reports a healthy status when the redis instance responds', async () => {
		pingMock.mockResolvedValueOnce('PONG');
		infoMock.mockResolvedValueOnce('memory:info');

		const nowSpy = vi.spyOn(Date, 'now');
		nowSpy.mockImplementationOnce(() => 1_000).mockImplementationOnce(() => 1_015);

		const status = await redisService.healthCheck();

		expect(status).toMatchObject({
			status: 'healthy',
			memory: 'memory:info',
			connected: true,
		});
		expect(status.latency).toBe('15ms');

		nowSpy.mockRestore();
	});

	it('reports an unhealthy status when redis does not respond', async () => {
		pingMock.mockRejectedValueOnce(new Error('Redis unreachable'));

		const status = await redisService.healthCheck();

		expect(status).toEqual({
			status: 'unhealthy',
			error: 'Redis unreachable',
			connected: false,
		});
	});

	it('attempts to gracefully close the redis connection', async () => {
		quitMock.mockResolvedValueOnce('OK');

		await redisService.close();

		expect(quitMock).toHaveBeenCalled();
	});
});
