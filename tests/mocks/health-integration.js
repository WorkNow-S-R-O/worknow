import { vi } from 'vitest';

// Mock Redis service
export const mockRedisService = {
	healthCheck: vi.fn(),
	set: vi.fn(),
	get: vi.fn(),
	del: vi.fn(),
	setSession: vi.fn(),
	getSession: vi.fn(),
	deleteSession: vi.fn(),
	checkRateLimit: vi.fn(),
	cacheJobs: vi.fn(),
	getCachedJobs: vi.fn(),
	invalidateJobsCache: vi.fn(),
	trackUserActivity: vi.fn(),
	publishNotification: vi.fn(),
	close: vi.fn(),
};

// Mock Redis service module
vi.mock('../../apps/api/services/redisService.js', () => ({
	default: mockRedisService,
}));

// Mock data
export const mockHealthyRedisResponse = {
	status: 'healthy',
	latency: '5ms',
	memory: 'used_memory:1024000\nused_memory_human:1000.00K',
	connected: true,
};

export const mockUnhealthyRedisResponse = {
	status: 'unhealthy',
	error: 'Connection refused',
	connected: false,
};

export const mockSlowRedisResponse = {
	status: 'healthy',
	latency: '500ms',
	memory: 'used_memory:2048000\nused_memory_human:2.00M',
	connected: true,
};

export const mockPartialRedisResponse = {
	status: 'healthy',
	latency: '10ms',
	// Missing memory and connected properties
};

export const mockRedisErrors = {
	connectionError: new Error('Connection refused'),
	timeoutError: new Error('Operation timeout'),
	permissionError: new Error('Permission denied'),
	networkError: new Error('Network unreachable'),
	unknownError: new Error('Unknown Redis error'),
};

// Environment variables mock
export const mockEnvironmentVariables = {
	development: {
		NODE_ENV: 'development',
	},
	production: {
		NODE_ENV: 'production',
	},
	staging: {
		NODE_ENV: 'staging',
	},
	test: {
		NODE_ENV: 'test',
	},
	noEnv: {
		// No NODE_ENV set
	},
};

// Reset mocks function
export const resetHealthMocks = () => {
	mockRedisService.healthCheck.mockClear();
	mockRedisService.set.mockClear();
	mockRedisService.get.mockClear();
	mockRedisService.del.mockClear();
	mockRedisService.setSession.mockClear();
	mockRedisService.getSession.mockClear();
	mockRedisService.deleteSession.mockClear();
	mockRedisService.checkRateLimit.mockClear();
	mockRedisService.cacheJobs.mockClear();
	mockRedisService.getCachedJobs.mockClear();
	mockRedisService.invalidateJobsCache.mockClear();
	mockRedisService.trackUserActivity.mockClear();
	mockRedisService.publishNotification.mockClear();
	mockRedisService.close.mockClear();
	vi.clearAllMocks();
};
