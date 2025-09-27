import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Import mocks
import {
	mockFindMany,
	mockPrismaInstance,
	mockCategoriesData,
	mockCategoriesWithPartialTranslations,
	mockCategoriesWithNoTranslations,
	mockCategoriesWithNullTranslations,
	mockCategoriesWithMalformedTranslations,
	mockCategoriesWithLongNames,
	mockCategoriesWithSpecialChars,
	mockErrors,
	resetCategoriesMocks,
} from './mocks/categories-integration.js';

// Import the route after mocking
import categoriesRoutes from '../apps/api/routes/categories.js';

// Create Express app for testing
const createTestApp = () => {
	const app = express();
	app.use(express.json());
	app.use('/api/categories', categoriesRoutes);
	return app;
};

// Mock console methods
const originalConsoleError = console.error;

describe('Categories Integration Tests', () => {
	let app;

	beforeEach(() => {
		// Create fresh app instance
		app = createTestApp();

		// Mock console.error to avoid noise in tests
		console.error = vi.fn();

		// Reset all mocks
		resetCategoriesMocks();
	});

	afterEach(() => {
		// Restore console.error
		console.error = originalConsoleError;
	});

	describe('GET /api/categories', () => {
		describe('Successful Requests', () => {
			it('should return categories with Russian translations by default', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act
				const response = await request(app).get('/api/categories').expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({ id: 1, label: 'IT' });
				expect(response.body[1]).toEqual({ id: 2, label: 'Маркетинг' });
				expect(response.body[2]).toEqual({ id: 3, label: 'Продажи' });
				expect(response.body[3]).toEqual({ id: 4, label: 'Дизайн' });
				expect(response.body[4]).toEqual({ id: 5, label: 'Финансы' });

				// Verify Prisma was called correctly
				expect(mockFindMany).toHaveBeenCalledWith({
					orderBy: { name: 'asc' },
					include: { translations: true },
				});
			});

			it('should return categories with English translations when lang=en', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=en')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({
					id: 1,
					label: 'Information Technology',
				});
				expect(response.body[1]).toEqual({ id: 2, label: 'Marketing' });
				expect(response.body[2]).toEqual({ id: 3, label: 'Sales' });
				expect(response.body[3]).toEqual({ id: 4, label: 'Design' });
				expect(response.body[4]).toEqual({ id: 5, label: 'Finance' });
			});

			it('should return categories with Hebrew translations when lang=he', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=he')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({ id: 1, label: 'טכנולוגיית מידע' });
				expect(response.body[1]).toEqual({ id: 2, label: 'שיווק' });
				expect(response.body[2]).toEqual({ id: 3, label: 'מכירות' });
				expect(response.body[3]).toEqual({ id: 4, label: 'עיצוב' });
				expect(response.body[4]).toEqual({ id: 5, label: 'כספים' });
			});

			it('should return categories with Arabic translations when lang=ar', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=ar')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({
					id: 1,
					label: 'تكنولوجيا المعلومات',
				});
				expect(response.body[1]).toEqual({ id: 2, label: 'تسويق' });
				expect(response.body[2]).toEqual({ id: 3, label: 'مبيعات' });
				expect(response.body[3]).toEqual({ id: 4, label: 'تصميم' });
				expect(response.body[4]).toEqual({ id: 5, label: 'مالية' });
			});

			it('should return empty array when no categories exist', async () => {
				// Arrange
				mockFindMany.mockResolvedValue([]);

				// Act
				const response = await request(app).get('/api/categories').expect(200);

				// Assert
				expect(response.body).toEqual([]);
				expect(response.body).toHaveLength(0);
			});

			it('should handle categories with partial translations', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesWithPartialTranslations);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=he')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(2);
				expect(response.body[0]).toEqual({ id: 1, label: 'IT' }); // Falls back to original name
				expect(response.body[1]).toEqual({ id: 2, label: 'שיווק' }); // Has translation
			});

			it('should handle categories with no translations', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesWithNoTranslations);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=ru')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(2);
				expect(response.body[0]).toEqual({ id: 1, label: 'IT' }); // Falls back to original name
				expect(response.body[1]).toEqual({ id: 2, label: 'Marketing' }); // Falls back to original name
			});

			it('should handle unsupported language parameter gracefully', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=fr')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				// Should fall back to original names since 'fr' is not supported
				expect(response.body[0]).toEqual({ id: 1, label: 'IT' });
				expect(response.body[1]).toEqual({ id: 2, label: 'Marketing' });
				expect(response.body[2]).toEqual({ id: 3, label: 'Sales' });
				expect(response.body[3]).toEqual({ id: 4, label: 'Design' });
				expect(response.body[4]).toEqual({ id: 5, label: 'Finance' });
			});

			it('should handle additional query parameters gracefully', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=en&filter=test&sort=name')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				expect(response.body[0]).toEqual({
					id: 1,
					label: 'Information Technology',
				});
			});
		});

		describe('Error Handling', () => {
			it('should handle database connection errors', async () => {
				// Arrange
				mockFindMany.mockRejectedValue(mockErrors.databaseError);

				// Act
				const response = await request(app).get('/api/categories').expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка при получении категорий',
				});
				expect(console.error).toHaveBeenCalledWith(
					'Ошибка при получении категорий:',
					mockErrors.databaseError,
				);
			});

			it('should handle Prisma query errors', async () => {
				// Arrange
				mockFindMany.mockRejectedValue(mockErrors.queryError);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=en')
					.expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка при получении категорий',
				});
				expect(console.error).toHaveBeenCalledWith(
					'Ошибка при получении категорий:',
					mockErrors.queryError,
				);
			});

			it('should handle timeout errors', async () => {
				// Arrange
				mockFindMany.mockRejectedValue(mockErrors.timeoutError);

				// Act
				const response = await request(app).get('/api/categories').expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка при получении категорий',
				});
				expect(console.error).toHaveBeenCalledWith(
					'Ошибка при получении категорий:',
					mockErrors.timeoutError,
				);
			});

			it('should handle unexpected errors', async () => {
				// Arrange
				mockFindMany.mockRejectedValue(mockErrors.unexpectedError);

				// Act
				const response = await request(app).get('/api/categories').expect(500);

				// Assert
				expect(response.body).toEqual({
					error: 'Ошибка при получении категорий',
				});
				expect(console.error).toHaveBeenCalledWith(
					'Ошибка при получении категорий:',
					mockErrors.unexpectedError,
				);
			});
		});

		describe('Edge Cases', () => {
			it('should handle null translations gracefully', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesWithNullTranslations);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=ru')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(2);
				expect(response.body[0]).toEqual({ id: 1, label: 'IT' }); // Falls back to original name
				expect(response.body[1]).toEqual({ id: 2, label: 'Marketing' }); // Falls back to original name
			});

			it('should handle malformed translation data', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesWithMalformedTranslations);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=en')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(1);
				expect(response.body[0]).toEqual({
					id: 1,
					label: 'Information Technology',
				});
			});

			it('should handle very long category names', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesWithLongNames);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=ru')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(1);
				expect(response.body[0]).toEqual({
					id: 1,
					label: 'Очень длинное название категории',
				});
			});

			it('should handle special characters in category names', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesWithSpecialChars);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=ru')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(2);
				expect(response.body[0]).toEqual({
					id: 1,
					label: 'IT и программное обеспечение',
				});
				expect(response.body[1]).toEqual({
					id: 2,
					label: 'Продажи/Маркетинг',
				});
			});
		});

		describe('Performance and Caching', () => {
			it('should call Prisma only once per request', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act
				await request(app).get('/api/categories?lang=en').expect(200);

				// Assert
				expect(mockFindMany).toHaveBeenCalledTimes(1);
			});

			it('should handle concurrent requests correctly', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act - Make multiple concurrent requests
				const promises = [
					request(app).get('/api/categories?lang=ru'),
					request(app).get('/api/categories?lang=en'),
					request(app).get('/api/categories?lang=he'),
					request(app).get('/api/categories?lang=ar'),
				];

				const responses = await Promise.all(promises);

				// Assert
				responses.forEach((response, index) => {
					expect(response.status).toBe(200);
					expect(response.body).toHaveLength(5);
				});

				// Should have been called 4 times (once per request)
				expect(mockFindMany).toHaveBeenCalledTimes(4);
			});
		});

		describe('HTTP Method Validation', () => {
			it('should reject POST requests', async () => {
				// Act & Assert
				await request(app).post('/api/categories').expect(404); // Express will return 404 for unhandled routes
			});

			it('should reject PUT requests', async () => {
				// Act & Assert
				await request(app).put('/api/categories').expect(404);
			});

			it('should reject DELETE requests', async () => {
				// Act & Assert
				await request(app).delete('/api/categories').expect(404);
			});

			it('should reject PATCH requests', async () => {
				// Act & Assert
				await request(app).patch('/api/categories').expect(404);
			});
		});

		describe('Response Format Validation', () => {
			it('should return valid JSON response', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act
				const response = await request(app)
					.get('/api/categories')
					.expect(200)
					.expect('Content-Type', /json/);

				// Assert
				expect(Array.isArray(response.body)).toBe(true);
				response.body.forEach((category) => {
					expect(category).toHaveProperty('id');
					expect(category).toHaveProperty('label');
					expect(typeof category.id).toBe('number');
					expect(typeof category.label).toBe('string');
				});
			});

			it('should maintain consistent response structure', async () => {
				// Arrange
				mockFindMany.mockResolvedValue(mockCategoriesData);

				// Act
				const response = await request(app)
					.get('/api/categories?lang=en')
					.expect(200);

				// Assert
				expect(response.body).toHaveLength(5);
				response.body.forEach((category, index) => {
					expect(category).toEqual({
						id: mockCategoriesData[index].id,
						label: expect.any(String),
					});
				});
			});
		});
	});
});
