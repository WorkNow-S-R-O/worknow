export const cacheKey = 'jobs:all:all:1';
export const cacheValue = { id: 1, title: 'Cached job', salary: '₪5,000' };

export const sessionId = 'session-789';
export const sessionPayload = { id: 55, email: 'user@example.com', role: 'admin' };

export const rateLimitIdentifier = 'ip:127.0.0.1';

export const notificationChannel = 'jobs-updates';
export const notificationMessage = { type: 'created', jobId: 42 };

export const userActivity = {
	userId: 'user-123',
	action: 'VIEW_JOB',
};

export const mockJobCacheParams = {
	category: 'it',
	city: 'tel-aviv',
	page: 1,
	jobs: [cacheValue],
};
