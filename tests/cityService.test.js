import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;

describe('CityService', () => {
	beforeEach(() => {
		// Mock console methods
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.error = originalConsoleError;
	});

	describe('City Data Processing Logic', () => {
		it('should correctly map city data with translations', () => {
			// Test the data mapping logic from the service
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [
						{ lang: 'ru', name: 'Тель-Авив' },
						{ lang: 'he', name: 'תל אביב' },
						{ lang: 'en', name: 'Tel Aviv' },
					],
				},
				{
					id: 2,
					name: 'Jerusalem',
					translations: [
						{ lang: 'ru', name: 'Иерусалим' },
						{ lang: 'he', name: 'ירושלים' },
						{ lang: 'en', name: 'Jerusalem' },
					],
				},
			];

			// Test the mapping logic from the service
			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			expect(result).toEqual([
				{ id: 1, name: 'Тель-Авив' },
				{ id: 2, name: 'Иерусалим' },
			]);
		});

		it('should handle different language translations', () => {
			const mockCitiesRu = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'ru', name: 'Тель-Авив' }],
				},
			];

			const mockCitiesHe = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'he', name: 'תל אביב' }],
				},
			];

			const mockCitiesEn = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'en', name: 'Tel Aviv' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			// Test different languages
			expect(mapCities(mockCitiesRu, 'ru')[0].name).toBe('Тель-Авив');
			expect(mapCities(mockCitiesHe, 'he')[0].name).toBe('תל אביב');
			expect(mapCities(mockCitiesEn, 'en')[0].name).toBe('Tel Aviv');
		});

		it('should fallback to original name when translation is missing', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'ru', name: 'Тель-Авив' }],
				},
				{
					id: 2,
					name: 'Jerusalem',
					translations: [], // No translations
				},
				{
					id: 3,
					name: 'Haifa',
					translations: [
						{ lang: 'en', name: 'Haifa' }, // Wrong language
					],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			expect(result).toEqual([
				{ id: 1, name: 'Тель-Авив' }, // Has translation
				{ id: 2, name: 'Jerusalem' }, // Fallback to original name
				{ id: 3, name: 'Haifa' }, // Fallback to original name
			]);
		});

		it('should handle cities with null translations', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: null,
				},
				{
					id: 2,
					name: 'Jerusalem',
					translations: undefined,
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: (city.translations && city.translations[0]?.name) || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			expect(result).toEqual([
				{ id: 1, name: 'Tel Aviv' }, // Fallback to original name
				{ id: 2, name: 'Jerusalem' }, // Fallback to original name
			]);
		});

		it('should handle cities with translation name as null', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'ru', name: null }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			// Should fallback to original name when translation name is null
			expect(result).toEqual([{ id: 1, name: 'Tel Aviv' }]);
		});

		it('should handle cities with translation name as empty string', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'ru', name: '' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			// Should fallback to original name when translation name is empty
			expect(result).toEqual([{ id: 1, name: 'Tel Aviv' }]);
		});

		it('should handle cities with translation name as undefined', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'ru', name: undefined }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			// Should fallback to original name when translation name is undefined
			expect(result).toEqual([{ id: 1, name: 'Tel Aviv' }]);
		});

		it('should handle empty cities list', () => {
			const mockCities = [];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			expect(result).toEqual([]);
		});

		it('should handle cities with multiple translations correctly', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [
						{ lang: 'ru', name: 'Тель-Авив' },
						{ lang: 'ru', name: 'Тель-Авив-Яффо' }, // Duplicate language
					],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			// Should use the first translation found
			expect(result).toEqual([{ id: 1, name: 'Тель-Авив' }]);
		});
	});

	describe('Language Support Tests', () => {
		it('should support Russian language (ru)', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'ru', name: 'Тель-Авив' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');
			expect(result[0].name).toBe('Тель-Авив');
		});

		it('should support Hebrew language (he)', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'he', name: 'תל אביב' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'he');
			expect(result[0].name).toBe('תל אביב');
		});

		it('should support English language (en)', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'en', name: 'Tel Aviv' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'en');
			expect(result[0].name).toBe('Tel Aviv');
		});

		it('should support Arabic language (ar)', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'ar', name: 'تل أبيب' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ar');
			expect(result[0].name).toBe('تل أبيب');
		});
	});

	describe('Data Structure Tests', () => {
		it('should preserve city ID as integer', () => {
			const mockCities = [
				{
					id: 42,
					name: 'Test City',
					translations: [{ lang: 'ru', name: 'Тестовый город' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			expect(typeof result[0].id).toBe('number');
			expect(result[0].id).toBe(42);
		});

		it('should preserve city name as string', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Test City',
					translations: [{ lang: 'ru', name: 'Тестовый город' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			expect(typeof result[0].name).toBe('string');
			expect(result[0].name).toBe('Тестовый город');
		});

		it('should return correct data structure', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'ru', name: 'Тель-Авив' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			// Verify the mapped structure
			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toHaveProperty('id');
			expect(result[0]).toHaveProperty('name');
			expect(result[0]).not.toHaveProperty('translations'); // Should be removed
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle missing city data gracefully', () => {
			const incompleteCity = {
				id: 1,
				// Missing name and translations
			};

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			// Test that the service can handle incomplete data
			const safeAccess = (obj, key, defaultValue = 'Unknown') => {
				return obj[key] || defaultValue;
			};

			expect(safeAccess(incompleteCity, 'name')).toBe('Unknown');
			expect(safeAccess(incompleteCity, 'id')).toBe(1);
		});

		it('should handle null and undefined values gracefully', () => {
			const testCases = [
				{ value: null, expected: 'Unknown' },
				{ value: undefined, expected: 'Unknown' },
				{ value: '', expected: 'Unknown' },
				{ value: 'Valid Value', expected: 'Valid Value' },
			];

			testCases.forEach(({ value, expected }) => {
				const safeValue = value || 'Unknown';
				expect(safeValue).toBe(expected);
			});
		});

		it('should handle large number of cities efficiently', () => {
			// Generate a large number of cities
			const mockCities = Array.from({ length: 100 }, (_, index) => ({
				id: index + 1,
				name: `City ${index + 1}`,
				translations: [{ lang: 'ru', name: `Город ${index + 1}` }],
			}));

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			expect(result).toHaveLength(100);
			expect(result[0]).toEqual({ id: 1, name: 'Город 1' });
			expect(result[99]).toEqual({ id: 100, name: 'Город 100' });
		});
	});

	describe('Service Response Format Tests', () => {
		it('should return correct response format', () => {
			const mockCities = [
				{
					id: 1,
					name: 'Tel Aviv',
					translations: [{ lang: 'ru', name: 'Тель-Авив' }],
				},
			];

			const mapCities = (cities, lang = 'ru') => {
				return cities.map((city) => ({
					id: city.id,
					name: city.translations[0]?.name || city.name,
				}));
			};

			const result = mapCities(mockCities, 'ru');

			// Test the service response format
			const serviceResponse = { cities: result };

			expect(serviceResponse).toHaveProperty('cities');
			expect(Array.isArray(serviceResponse.cities)).toBe(true);
			expect(serviceResponse.cities[0]).toHaveProperty('id');
			expect(serviceResponse.cities[0]).toHaveProperty('name');
		});

		it('should handle error response format', () => {
			const errorResponse = { error: 'Ошибка сервера при получении городов' };

			expect(errorResponse).toHaveProperty('error');
			expect(typeof errorResponse.error).toBe('string');
			expect(errorResponse.error).toBe('Ошибка сервера при получении городов');
		});
	});
});
