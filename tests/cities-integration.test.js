import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockGetCitiesService,
	mockGetCategories,
	mockServiceResponses,
	mockCategoriesData,
	mockErrors,
	resetCitiesMocks,
} from './mocks/cities-integration.js';

// Import the route after mocking
import citiesRoutes from '../apps/api/routes/cities.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/cities', citiesRoutes);
	return app;
};

// Mock console methods
const originalConsoleError = console.error;

describe('Cities Integration Tests', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();

		// Mock console.error to avoid noise in tests
		console.error = vi.fn();

		// Reset all mocks
		resetCitiesMocks();
	});

	afterEach(() => {
		// Restore console.error
		console.error = originalConsoleError;
	});

	describe('GET /api/cities', () => {
		describe('Successful Requests', () => {
			it('should return cities with Russian translations by default', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successRussian,
				);

				// Act
				const response = await request(app).get('/api/cities').expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({ id: 1, name: 'Тель-Авив' });
				expect(response.body[1]).toEqual({ id: 2, name: 'Иерусалим' });
				expect(response.body[2]).toEqual({ id: 3, name: 'Хайфа' });
				expect(response.body[3]).toEqual({ id: 4, name: 'Беэр-Шева' });
				expect(response.body[4]).toEqual({ id: 5, name: 'Нетания' });

				// Verify service was called correctly
				expect(mockGetCitiesService).toHaveBeenCalledWith('ru');
			});

			it('should return cities with English translations when lang=en', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successEnglish,
				);

				// Act
				const response = await request(app)
					.get('/api/cities?lang=en')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({ id: 1, name: 'Tel Aviv' });
				expect(response.body[1]).toEqual({ id: 2, name: 'Jerusalem' });
				expect(response.body[2]).toEqual({ id: 3, name: 'Haifa' });
				expect(response.body[3]).toEqual({ id: 4, name: 'Beer Sheva' });
				expect(response.body[4]).toEqual({ id: 5, name: 'Netanya' });

				// Verify service was called correctly
				expect(mockGetCitiesService).toHaveBeenCalledWith('en');
			});

			it('should return cities with Hebrew translations when lang=he', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successHebrew,
				);

				// Act
				const response = await request(app)
					.get('/api/cities?lang=he')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({ id: 1, name: 'תל אביב' });
				expect(response.body[1]).toEqual({ id: 2, name: 'ירושלים' });
				expect(response.body[2]).toEqual({ id: 3, name: 'חיפה' });
				expect(response.body[3]).toEqual({ id: 4, name: 'באר שבע' });
				expect(response.body[4]).toEqual({ id: 5, name: 'נתניה' });

				// Verify service was called correctly
				expect(mockGetCitiesService).toHaveBeenCalledWith('he');
			});

			it('should return cities with Arabic translations when lang=ar', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successArabic,
				);

				// Act
				const response = await request(app)
					.get('/api/cities?lang=ar')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({ id: 1, name: 'تل أبيب' });
				expect(response.body[1]).toEqual({ id: 2, name: 'القدس' });
				expect(response.body[2]).toEqual({ id: 3, name: 'حيفا' });
				expect(response.body[3]).toEqual({ id: 4, name: 'بئر السبع' });
				expect(response.body[4]).toEqual({ id: 5, name: 'نتانيا' });

				// Verify service was called correctly
				expect(mockGetCitiesService).toHaveBeenCalledWith('ar');
			});

			it('should return empty array when no cities exist', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(mockServiceResponses.empty);

				// Act
				const response = await request(app).get('/api/cities').expect(200);

				// Assert
				expect(response.body).toEqual([]);
				expect(response.body).toHaveLength(0);
			});

			it('should handle additional query parameters gracefully', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successEnglish,
				);

				// Act
				const response = await request(app)
					.get('/api/cities?lang=en&filter=test&sort=name')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({ id: 1, name: 'Tel Aviv' });
			});

			it('should handle unsupported language parameter gracefully', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successRussian,
				);

				// Act
				const response = await request(app)
					.get('/api/cities?lang=fr')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(mockGetCitiesService).toHaveBeenCalledWith('fr');
			});
		});

		describe('Error Handling', () => {
			it('should handle service errors', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(mockServiceResponses.error);

				// Act
				const response = await request(app).get('/api/cities').expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка сервера при получении городов',
				});
				expect(console.error).toHaveBeenCalledWith(
					'❌ Ошибка в getCitiesService:',
					'Ошибка сервера при получении городов',
				);
			});

			it('should handle service errors with custom error message', async () => {
				// Arrange
				const customError = { error: 'Custom service error' };
				mockGetCitiesService.mockResolvedValue(customError);

				// Act
				const response = await request(app)
					.get('/api/cities?lang=en')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Custom service error',
				});
				expect(console.error).toHaveBeenCalledWith(
					'❌ Ошибка в getCitiesService:',
					'Custom service error',
				);
			});

			it('should handle service promise rejection', async () => {
				// Arrange
				const serviceError = new Error('Service promise rejected');
				mockGetCitiesService.mockRejectedValue(serviceError);

				// Act
				const response = await request(app).get('/api/cities').expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Service promise rejected',
				});
			});

			it('should handle unexpected service errors', async () => {
				// Arrange
				const unexpectedError = new Error('Unexpected error occurred');
				mockGetCitiesService.mockRejectedValue(unexpectedError);

				// Act
				const response = await request(app).get('/api/cities').expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Unexpected error occurred',
				});
			});
		});

		describe('Edge Cases', () => {
			it('should handle service returning null', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(null);

				// Act
				const response = await request(app)
					.get('/api/cities?lang=ru')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Service returned null/undefined',
				});
			});

			it('should handle service returning undefined', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(undefined);

				// Act
				const response = await request(app)
					.get('/api/cities?lang=ru')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Service returned null/undefined',
				});
			});

			it('should handle service returning empty object', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue({});

				// Act
				const response = await request(app)
					.get('/api/cities?lang=ru')
					.expect(200);

				// Assert
				expect(response.body).toBe('');
			});

			it('should handle service returning cities without error property', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue({ cities: [] });

				// Act
				const response = await request(app)
					.get('/api/cities?lang=ru')
					.expect(200);

				// Assert
				expect(response.body).toEqual([]);
			});
		});

		describe('Performance and Caching', () => {
			it('should call service only once per request', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successEnglish,
				);

				// Act
				await request(app).get('/api/cities?lang=en').expect(200);

				// Assert
				expect(mockGetCitiesService).toHaveBeenCalledTimes(1);
			});

			it('should handle concurrent requests correctly', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successRussian,
				);

				// Act - Make multiple concurrent requests
				const promises = [
					request(app).get('/api/cities?lang=ru'),
					request(app).get('/api/cities?lang=en'),
					request(app).get('/api/cities?lang=he'),
					request(app).get('/api/cities?lang=ar'),
				];

				const responses = await Promise.all(promises);

				// Assert
				responses.forEach((response, index) => {
					expect(response.status).toBe(200);
					expect(response.body).toHaveLength(5);
				});

				// Should have been called 4 times (once per request)
				expect(mockGetCitiesService).toHaveBeenCalledTimes(4);
			});
		});

		describe('HTTP Method Validation', () => {
			it('should reject POST requests', async () => {
				// Act & Assert
				await request(app).post('/api/cities').expect(404); // Express will return 404 for unhandled routes
			});

			it('should reject PUT requests', async () => {
				// Act & Assert
				await request(app).put('/api/cities').expect(404);
			});

			it('should reject DELETE requests', async () => {
				// Act & Assert
				await request(app).delete('/api/cities').expect(404);
			});

			it('should reject PATCH requests', async () => {
				// Act & Assert
				await request(app).patch('/api/cities').expect(404);
			});
		});

		describe('Response Format Validation', () => {
			it('should return valid JSON response', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successRussian,
				);

				// Act
				const response = await request(app)
					.get('/api/cities')
					.expect(200)
					.expect('Content-Type', /json/);

				// Assert
				expect(Array.isArray(response.body)).toBe(true);
				response.body.forEach((city) => {
					expect(city).toHaveProperty('id');
					expect(city).toHaveProperty('name');
					expect(typeof city.id).toBe('number');
					expect(typeof city.name).toBe('string');
				});
			});

			it('should maintain consistent response structure', async () => {
				// Arrange
				mockGetCitiesService.mockResolvedValue(
					mockServiceResponses.successEnglish,
				);

				// Act
				const response = await request(app)
					.get('/api/cities?lang=en')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				response.body.forEach((city, index) => {
					expect(city).toEqual({
						id: expect.any(Number),
						name: expect.any(String),
					});
				});
			});
		});
	});

	describe('GET /api/cities/categories', () => {
		describe('Categories Endpoint', () => {
			it('should return categories when accessing /categories endpoint', async () => {
				// Arrange
				mockGetCategories.mockImplementation((req, res) => {
					res.json(mockCategoriesData);
				});

				// Act
				const response = await request(app)
					.get('/api/cities/categories')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({ id: 1, label: 'IT' });
			});

			it('should handle categories endpoint with different languages', async () => {
				// Arrange
				const englishCategories = [
					{ id: 1, label: 'Information Technology' },
					{ id: 2, label: 'Marketing' },
					{ id: 3, label: 'Sales' },
					{ id: 4, label: 'Design' },
					{ id: 5, label: 'Finance' },
				];
				mockGetCategories.mockImplementation((req, res) => {
					res.json(englishCategories);
				});

				// Act
				const response = await request(app)
					.get('/api/cities/categories?lang=en')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({
					id: 1,
					label: 'Information Technology',
				});
			});

			it('should handle categories endpoint errors', async () => {
				// Arrange
				mockGetCategories.mockImplementation((req, res) => {
					res.status(500).json({ error: 'Ошибка при получении категорий' });
				});

				// Act
				const response = await request(app)
					.get('/api/cities/categories')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка при получении категорий',
				});
			});
		});
	});
});
