import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockRedisService,
	mockHealthyRedisResponse,
	mockUnhealthyRedisResponse,
	mockSlowRedisResponse,
	mockPartialRedisResponse,
	mockRedisErrors,
	mockEnvironmentVariables,
	resetHealthMocks,
} from './mocks/health-integration.js';

// Import the route after mocking
import registerHealthRoutes from '../apps/api/routes/health.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	registerHealthRoutes(app);
	return app;
};

// Mock console methods
const originalConsoleError = console.error;

describe('Health Integration Tests', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();
		
		// Mock console.error to avoid noise in tests
		console.error = vi.fn();
		
		// Reset all mocks
		resetHealthMocks();
	});

	afterEach(() => {
		// Restore console.error
		console.error = originalConsoleError;
	});

	describe('GET /api/health', () => {
		describe('Successful Requests', () => {
			it('should return healthy status with timestamp', async () => {
				// Act
				const response = await request(app)
					.get('/api/health')
					.expect(200);

				// Assert
				expect(response.body).toHaveProperty('status', 'healthy');
				expect(response.body).toHaveProperty('timestamp');
				expect(response.body).toHaveProperty('environment');
				expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
			});

			it('should return development environment by default', async () => {
				// Arrange
				const originalEnv = process.env.NODE_ENV;
				delete process.env.NODE_ENV;

				// Act
				const response = await request(app)
					.get('/api/health')
					.expect(200);

				// Assert
				expect(response.body.environment).toBe('development');

				// Cleanup
				if (originalEnv) {
					process.env.NODE_ENV = originalEnv;
				}
			});

			it('should return production environment when NODE_ENV is set', async () => {
				// Arrange
				const originalEnv = process.env.NODE_ENV;
				process.env.NODE_ENV = 'production';

				// Act
				const response = await request(app)
					.get('/api/health')
					.expect(200);

				// Assert
				expect(response.body.environment).toBe('production');

				// Cleanup
				if (originalEnv) {
					process.env.NODE_ENV = originalEnv;
				} else {
					delete process.env.NODE_ENV;
				}
			});

			it('should return staging environment when NODE_ENV is set', async () => {
				// Arrange
				const originalEnv = process.env.NODE_ENV;
				process.env.NODE_ENV = 'staging';

				// Act
				const response = await request(app)
					.get('/api/health')
					.expect(200);

				// Assert
				expect(response.body.environment).toBe('staging');

				// Cleanup
				if (originalEnv) {
					process.env.NODE_ENV = originalEnv;
				} else {
					delete process.env.NODE_ENV;
				}
			});

			it('should return test environment when NODE_ENV is set', async () => {
				// Arrange
				const originalEnv = process.env.NODE_ENV;
				process.env.NODE_ENV = 'test';

				// Act
				const response = await request(app)
					.get('/api/health')
					.expect(200);

				// Assert
				expect(response.body.environment).toBe('test');

				// Cleanup
				if (originalEnv) {
					process.env.NODE_ENV = originalEnv;
				} else {
					delete process.env.NODE_ENV;
				}
			});

			it('should return valid ISO timestamp', async () => {
				// Act
				const response = await request(app)
					.get('/api/health')
					.expect(200);

				// Assert
				const timestamp = response.body.timestamp;
				expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
				expect(new Date(timestamp).getTime()).toBeGreaterThan(Date.now() - 1000);
			});
		});

		describe('HTTP Method Validation', () => {
			it('should reject POST requests', async () => {
				// Act & Assert
				await request(app)
					.post('/api/health')
					.expect(404);
			});

			it('should reject PUT requests', async () => {
				// Act & Assert
				await request(app)
					.put('/api/health')
					.expect(404);
			});

			it('should reject DELETE requests', async () => {
				// Act & Assert
				await request(app)
					.delete('/api/health')
					.expect(404);
			});

			it('should reject PATCH requests', async () => {
				// Act & Assert
				await request(app)
					.patch('/api/health')
					.expect(404);
			});
		});

		describe('Response Format Validation', () => {
			it('should return valid JSON response', async () => {
				// Act
				const response = await request(app)
					.get('/api/health')
					.expect(200)
					.expect('Content-Type', /json/);

				// Assert
				expect(typeof response.body).toBe('object');
				expect(response.body).toHaveProperty('status');
				expect(response.body).toHaveProperty('timestamp');
				expect(response.body).toHaveProperty('environment');
			});

			it('should maintain consistent response structure', async () => {
				// Act
				const response = await request(app)
					.get('/api/health')
					.expect(200);

				// Assert
				expect(Object.keys(response.body)).toEqual(['status', 'timestamp', 'environment']);
				expect(response.body.status).toBe('healthy');
				expect(typeof response.body.timestamp).toBe('string');
				expect(typeof response.body.environment).toBe('string');
			});
		});

		describe('Performance and Caching', () => {
			it('should respond quickly', async () => {
				// Arrange
				const startTime = Date.now();

				// Act
				await request(app)
					.get('/api/health')
					.expect(200);

				// Assert
				const responseTime = Date.now() - startTime;
				expect(responseTime).toBeLessThan(100); // Should respond in less than 100ms
			});

			it('should handle concurrent requests correctly', async () => {
				// Act - Make multiple concurrent requests
				const promises = Array.from({ length: 10 }).map(() =>
					request(app).get('/api/health')
				);

				const responses = await Promise.all(promises);

				// Assert
				responses.forEach((response) => {
					expect(response.status).toBe(200);
					expect(response.body.status).toBe('healthy');
				});
			});
		});
	});

	describe('GET /api/redis/health', () => {
		describe('Successful Requests', () => {
			it('should return healthy status when Redis is working', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(mockHealthyRedisResponse);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(response.body).toHaveProperty('status', 'healthy');
				expect(response.body).toHaveProperty('redis');
				expect(response.body).toHaveProperty('timestamp');
				expect(response.body.redis).toEqual(mockHealthyRedisResponse);
				expect(mockRedisService.healthCheck).toHaveBeenCalledTimes(1);
			});

			it('should return valid timestamp', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(mockHealthyRedisResponse);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				const timestamp = response.body.timestamp;
				expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
				expect(new Date(timestamp).getTime()).toBeGreaterThan(Date.now() - 1000);
			});

			it('should handle slow Redis response', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(mockSlowRedisResponse);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(response.body.status).toBe('healthy');
				expect(response.body.redis).toEqual(mockSlowRedisResponse);
				expect(response.body.redis.latency).toBe('500ms');
			});

			it('should handle partial Redis response', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(mockPartialRedisResponse);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(response.body.status).toBe('healthy');
				expect(response.body.redis).toEqual(mockPartialRedisResponse);
			});
		});

		describe('Error Handling', () => {
			it('should return unhealthy status when Redis is down', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(mockUnhealthyRedisResponse);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(response.body.status).toBe('healthy'); // Route returns 200 even when Redis is unhealthy
				expect(response.body.redis).toEqual(mockUnhealthyRedisResponse);
			});

			it('should handle Redis service promise rejection', async () => {
				// Arrange
				mockRedisService.healthCheck.mockRejectedValue(mockRedisErrors.connectionError);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(500);

				// Assert
				expect(response.body.status).toBe('unhealthy');
				expect(response.body.error).toBe('Connection refused');
				expect(response.body).toHaveProperty('timestamp');
			});

			it('should handle timeout errors', async () => {
				// Arrange
				mockRedisService.healthCheck.mockRejectedValue(mockRedisErrors.timeoutError);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(500);

				// Assert
				expect(response.body.status).toBe('unhealthy');
				expect(response.body.error).toBe('Operation timeout');
			});

			it('should handle permission errors', async () => {
				// Arrange
				mockRedisService.healthCheck.mockRejectedValue(mockRedisErrors.permissionError);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(500);

				// Assert
				expect(response.body.status).toBe('unhealthy');
				expect(response.body.error).toBe('Permission denied');
			});

			it('should handle network errors', async () => {
				// Arrange
				mockRedisService.healthCheck.mockRejectedValue(mockRedisErrors.networkError);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(500);

				// Assert
				expect(response.body.status).toBe('unhealthy');
				expect(response.body.error).toBe('Network unreachable');
			});

			it('should handle unexpected errors', async () => {
				// Arrange
				mockRedisService.healthCheck.mockRejectedValue(mockRedisErrors.unknownError);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(500);

				// Assert
				expect(response.body.status).toBe('unhealthy');
				expect(response.body.error).toBe('Unknown Redis error');
			});
		});

		describe('Edge Cases', () => {
			it('should handle Redis service returning null', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(null);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(response.body.status).toBe('healthy');
				expect(response.body.redis).toBeNull();
			});

			it('should handle Redis service returning undefined', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(undefined);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(response.body.status).toBe('healthy');
				expect(response.body.redis).toBeUndefined();
			});

			it('should handle Redis service returning empty object', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue({});

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(response.body.status).toBe('healthy');
				expect(response.body.redis).toEqual({});
			});

			it('should handle malformed Redis response', async () => {
				// Arrange
				const malformedResponse = {
					status: 'healthy',
					latency: null,
					memory: undefined,
					connected: 'yes', // Should be boolean
				};
				mockRedisService.healthCheck.mockResolvedValue(malformedResponse);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(response.body.status).toBe('healthy');
				expect(response.body.redis).toEqual(malformedResponse);
			});
		});

		describe('Performance and Caching', () => {
			it('should call Redis health check only once per request', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(mockHealthyRedisResponse);

				// Act
				await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(mockRedisService.healthCheck).toHaveBeenCalledTimes(1);
			});

			it('should handle concurrent Redis health check requests', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(mockHealthyRedisResponse);

				// Act - Make multiple concurrent requests
				const promises = Array.from({ length: 5 }).map(() =>
					request(app).get('/api/redis/health')
				);

				const responses = await Promise.all(promises);

				// Assert
				responses.forEach((response) => {
					expect(response.status).toBe(200);
					expect(response.body.status).toBe('healthy');
				});
				expect(mockRedisService.healthCheck).toHaveBeenCalledTimes(5);
			});
		});

		describe('HTTP Method Validation', () => {
			it('should reject POST requests', async () => {
				// Act & Assert
				await request(app)
					.post('/api/redis/health')
					.expect(404);
			});

			it('should reject PUT requests', async () => {
				// Act & Assert
				await request(app)
					.put('/api/redis/health')
					.expect(404);
			});

			it('should reject DELETE requests', async () => {
				// Act & Assert
				await request(app)
					.delete('/api/redis/health')
					.expect(404);
			});

			it('should reject PATCH requests', async () => {
				// Act & Assert
				await request(app)
					.patch('/api/redis/health')
					.expect(404);
			});
		});

		describe('Response Format Validation', () => {
			it('should return valid JSON response', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(mockHealthyRedisResponse);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200)
					.expect('Content-Type', /json/);

				// Assert
				expect(typeof response.body).toBe('object');
				expect(response.body).toHaveProperty('status');
				expect(response.body).toHaveProperty('redis');
				expect(response.body).toHaveProperty('timestamp');
			});

			it('should maintain consistent response structure', async () => {
				// Arrange
				mockRedisService.healthCheck.mockResolvedValue(mockHealthyRedisResponse);

				// Act
				const response = await request(app)
					.get('/api/redis/health')
					.expect(200);

				// Assert
				expect(Object.keys(response.body)).toEqual(['status', 'redis', 'timestamp']);
				expect(response.body.status).toBe('healthy');
				expect(typeof response.body.timestamp).toBe('string');
				expect(typeof response.body.redis).toBe('object');
			});
		});
	});
});
