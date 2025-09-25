import { vi } from 'vitest';

export const cacheKeyPrefix = 'api:';

export const defaultTtl = 300;

export const sampleRequest = {
	method: 'GET',
	originalUrl: '/api/jobs?city=Tel%20Aviv',
	path: '/api/jobs',
	headers: {
		'user-agent': 'Vitest',
		'x-forwarded-for': '1.1.1.1',
	},
	ip: '2.2.2.2',
	cookies: {},
};

export const cachedPayload = { message: 'cached-data' };
export const freshPayload = { message: 'fresh-data' };

export const rateLimitAllowed = {
	limit: 100,
	remaining: 99,
	resetTime: 60,
	allowed: true,
};

export const rateLimitExceeded = {
	limit: 100,
	remaining: 0,
	resetTime: 30,
	allowed: false,
};

export const sessionIdHeader = 'session-123';
export const sessionData = { id: 'session-123', userId: 'user-1' };

export const activityUserId = 'user-activity';

export const buildResponse = () => {
	const res = {
		set: vi.fn().mockReturnThis(),
		status: vi.fn().mockReturnThis(),
		json: vi.fn().mockReturnThis(),
	};
	return res;
};

export const buildNext = () => vi.fn();

export const buildReq = (overrides = {}) => {
	const baseHeaders = { ...sampleRequest.headers };
	const baseCookies = { ...sampleRequest.cookies };

	const merged = {
		...sampleRequest,
		headers: baseHeaders,
		cookies: baseCookies,
	};

	if (overrides.headers) {
		merged.headers = { ...baseHeaders, ...overrides.headers };
	}

	if (overrides.cookies) {
		merged.cookies = { ...baseCookies, ...overrides.cookies };
	}

	return {
		...merged,
		...overrides,
		headers: merged.headers,
		cookies: merged.cookies,
	};
};
