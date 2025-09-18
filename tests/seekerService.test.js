import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import mock data
import {
	mockPrisma,
	mockNotificationService,
	mockConsoleLog,
	mockConsoleError,
	mockCityData,
	mockSeekerData,
	mockSeekerCreationData,
	mockQueryParameters,
	mockPaginationData,
	mockWhereClauseData,
	mockSlugGenerationData,
	mockCityTranslationData,
	mockErrors,
	mockErrorMessages,
	mockSuccessMessages,
	mockConsoleLogData,
	mockServiceResponses,
	mockDataConversions,
	mockFilteringLogic,
	mockPaginationLogic,
	mockSlugGenerationLogic,
	mockCityTranslationLogic,
	mockNotificationLogic,
	resetSeekerServiceMocks,
} from './mocks/seekerService.js';

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('SeekerService', () => {
	beforeEach(() => {
		// Reset all mocks
		resetSeekerServiceMocks();
		
		// Mock console methods
		console.log = vi.fn();
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('City Translation Logic', () => {
		it('should translate city names correctly', async () => {
			const translations = mockCityTranslationData.telAvivTranslations;
			
			expect(await mockCityTranslationLogic.translateCityName('Tel Aviv', 'ru')).toBe(translations.ru);
			expect(await mockCityTranslationLogic.translateCityName('Tel Aviv', 'he')).toBe(translations.he);
			expect(await mockCityTranslationLogic.translateCityName('Tel Aviv', 'en')).toBe(translations.en);
			expect(await mockCityTranslationLogic.translateCityName('Tel Aviv', 'ar')).toBe(translations.ar);
		});

		it('should return original name when translation not found', async () => {
			const result = await mockCityTranslationLogic.translateCityName('Unknown City', 'ru');
			expect(result).toBe('Unknown City');
		});

		it('should handle different languages', () => {
			const languages = mockCityTranslationLogic.getAvailableLanguages();
			expect(languages).toEqual(['ru', 'he', 'en', 'ar']);
		});

		it('should validate language codes', () => {
			expect(mockCityTranslationLogic.isValidLanguage('ru')).toBe(true);
			expect(mockCityTranslationLogic.isValidLanguage('he')).toBe(true);
			expect(mockCityTranslationLogic.isValidLanguage('en')).toBe(true);
			expect(mockCityTranslationLogic.isValidLanguage('ar')).toBe(true);
			expect(mockCityTranslationLogic.isValidLanguage('invalid')).toBe(false);
		});
	});

	describe('Slug Generation Logic', () => {
		it('should generate basic slug', () => {
			const data = mockSlugGenerationData.basicName;
			const result = mockSlugGenerationLogic.generateSlug(data.name, data.description);
			expect(result).toBe(data.expectedSlug);
		});

		it('should handle special characters', () => {
			const data = mockSlugGenerationData.nameWithSpecialChars;
			const result = mockSlugGenerationLogic.generateSlug(data.name, data.description);
			expect(result).toBe(data.expectedSlug);
		});

		it('should handle multiple lines', () => {
			const data = mockSlugGenerationData.nameWithMultipleLines;
			const result = mockSlugGenerationLogic.generateSlug(data.name, data.description);
			expect(result).toBe(data.expectedSlug);
		});

		it('should handle Cyrillic characters', () => {
			const data = mockSlugGenerationData.nameWithCyrillic;
			const result = mockSlugGenerationLogic.generateSlug(data.name, data.description);
			expect(result).toBe(data.expectedSlug);
		});

		it('should validate slug format', () => {
			expect(mockSlugGenerationLogic.validateSlug('valid-slug')).toBe(true);
			expect(mockSlugGenerationLogic.validateSlug('invalid slug')).toBe(false);
			expect(mockSlugGenerationLogic.validateSlug('invalid@slug')).toBe(false);
		});

		it('should normalize slug', () => {
			const result = mockSlugGenerationLogic.normalizeSlug('  Invalid@Slug!  ');
			expect(result).toBe('invalid-slug');
		});
	});

	describe('Filtering Logic', () => {
		it('should build basic where clause', () => {
			const result = mockFilteringLogic.buildWhereClause({});
			expect(result).toEqual({ isActive: true });
		});

		it('should build where clause with city filter', () => {
			const filters = { city: 'Tel Aviv' };
			const result = mockFilteringLogic.buildWhereClause(filters);
			expect(result).toEqual({
				isActive: true,
				city: 'Tel Aviv',
			});
		});

		it('should build where clause with languages filter', () => {
			const filters = { languages: ['English', 'Hebrew'] };
			const result = mockFilteringLogic.buildWhereClause(filters);
			expect(result).toEqual({
				isActive: true,
				languages: { hasSome: ['English', 'Hebrew'] },
			});
		});

		it('should build where clause with isDemanded filter', () => {
			const filters = { isDemanded: 'true' };
			const result = mockFilteringLogic.buildWhereClause(filters);
			expect(result).toEqual({
				isActive: true,
				isDemanded: true,
			});
		});

		it('should apply filters to seekers', () => {
			const seekers = [mockSeekerData.validSeeker, mockSeekerData.anotherSeeker];
			const filters = { city: 'Tel Aviv' };
			const result = mockFilteringLogic.applyFilters(seekers, filters);
			expect(result).toHaveLength(1);
			expect(result[0].city).toBe('Tel Aviv');
		});
	});

	describe('Pagination Logic', () => {
		it('should calculate pagination for first page', () => {
			const result = mockPaginationLogic.calculatePagination(1, 10, 50);
			expect(result).toEqual({
				currentPage: 1,
				totalPages: 5,
				totalCount: 50,
				hasNextPage: true,
				hasPrevPage: false,
				skip: 0,
				take: 10,
			});
		});

		it('should calculate pagination for middle page', () => {
			const result = mockPaginationLogic.calculatePagination(3, 10, 50);
			expect(result).toEqual({
				currentPage: 3,
				totalPages: 5,
				totalCount: 50,
				hasNextPage: true,
				hasPrevPage: true,
				skip: 20,
				take: 10,
			});
		});

		it('should calculate pagination for last page', () => {
			const result = mockPaginationLogic.calculatePagination(5, 10, 50);
			expect(result).toEqual({
				currentPage: 5,
				totalPages: 5,
				totalCount: 50,
				hasNextPage: false,
				hasPrevPage: true,
				skip: 40,
				take: 10,
			});
		});

		it('should validate pagination parameters', () => {
			const result = mockPaginationLogic.validatePagination('invalid', 'invalid');
			expect(result).toEqual({ page: 1, limit: 10 });
		});

		it('should handle edge cases', () => {
			const result = mockPaginationLogic.calculatePagination(1, 10, 0);
			expect(result.totalPages).toBe(0);
			expect(result.hasNextPage).toBe(false);
		});
	});

	describe('Notification Logic', () => {
		it('should send notification successfully', async () => {
			const result = await mockNotificationLogic.sendNotification(mockSeekerData.validSeeker);
			expect(result).toBe(true);
		});

		it('should handle notification errors', () => {
			const error = new Error('Notification failed');
			mockNotificationLogic.handleNotificationError(error);
			expect(console.error).toHaveBeenCalledWith('❌ Failed to send notification for new candidate:', error);
		});

		it('should validate seeker for notification', () => {
			expect(mockNotificationLogic.validateSeekerForNotification(mockSeekerData.validSeeker)).toBe(true);
			expect(mockNotificationLogic.validateSeekerForNotification(null)).toBe(false);
			expect(mockNotificationLogic.validateSeekerForNotification({})).toBe(false);
		});
	});

	describe('Data Processing Logic', () => {
		it('should handle valid seeker data', () => {
			const seeker = mockSeekerData.validSeeker;
			expect(seeker).toHaveProperty('id');
			expect(seeker).toHaveProperty('name');
			expect(seeker).toHaveProperty('contact');
			expect(seeker).toHaveProperty('city');
			expect(seeker).toHaveProperty('description');
			expect(seeker).toHaveProperty('isActive');
		});

		it('should handle seeker creation data', () => {
			const data = mockSeekerCreationData.validSeekerData;
			expect(data).toHaveProperty('name');
			expect(data).toHaveProperty('contact');
			expect(data).toHaveProperty('city');
			expect(data).toHaveProperty('description');
			expect(data).toHaveProperty('languages');
			expect(Array.isArray(data.languages)).toBe(true);
		});

		it('should handle query parameters', () => {
			const query = mockQueryParameters.basicQuery;
			expect(query).toHaveProperty('page');
			expect(query).toHaveProperty('limit');
			expect(query).toHaveProperty('lang');
			expect(typeof query.page).toBe('number');
			expect(typeof query.limit).toBe('number');
		});

		it('should handle pagination data', () => {
			const pagination = mockPaginationData.firstPage;
			expect(pagination).toHaveProperty('currentPage');
			expect(pagination).toHaveProperty('totalPages');
			expect(pagination).toHaveProperty('totalCount');
			expect(pagination).toHaveProperty('hasNextPage');
			expect(pagination).toHaveProperty('hasPrevPage');
		});
	});

	describe('Data Type Conversion Tests', () => {
		it('should handle string data types', () => {
			const strings = mockDataConversions.string;
			expect(typeof strings.name).toBe('string');
			expect(typeof strings.contact).toBe('string');
			expect(typeof strings.city).toBe('string');
			expect(typeof strings.description).toBe('string');
		});

		it('should handle number data types', () => {
			const numbers = mockDataConversions.number;
			expect(typeof numbers.id).toBe('number');
			expect(typeof numbers.page).toBe('number');
			expect(typeof numbers.limit).toBe('number');
			expect(typeof numbers.totalCount).toBe('number');
		});

		it('should handle boolean data types', () => {
			const booleans = mockDataConversions.boolean;
			expect(typeof booleans.isActive).toBe('boolean');
			expect(typeof booleans.isDemanded).toBe('boolean');
			expect(typeof booleans.hasNextPage).toBe('boolean');
			expect(typeof booleans.hasPrevPage).toBe('boolean');
		});

		it('should handle array data types', () => {
			const arrays = mockDataConversions.array;
			expect(Array.isArray(arrays.languages)).toBe(true);
			expect(Array.isArray(arrays.translations)).toBe(true);
			expect(arrays.languages).toHaveLength(3);
			expect(arrays.translations).toHaveLength(2);
		});

		it('should handle object data types', () => {
			const objects = mockDataConversions.object;
			expect(typeof objects.seeker).toBe('object');
			expect(typeof objects.city).toBe('object');
			expect(typeof objects.pagination).toBe('object');
			expect(typeof objects.whereClause).toBe('object');
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle database errors', () => {
			const error = mockErrors.databaseError;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Database connection failed');
		});

		it('should handle city not found errors', () => {
			const error = mockErrors.cityNotFound;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('City not found');
		});

		it('should handle seeker not found errors', () => {
			const error = mockErrors.seekerNotFound;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Seeker not found');
		});

		it('should handle invalid ID errors', () => {
			const error = mockErrors.invalidId;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Invalid ID format');
		});

		it('should handle notification errors', () => {
			const error = mockErrors.notificationError;
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe('Notification service failed');
		});
	});

	describe('Service Response Format Tests', () => {
		it('should return getAllSeekers success response', () => {
			const response = mockServiceResponses.getAllSeekersSuccess;
			expect(response).toHaveProperty('seekers');
			expect(response).toHaveProperty('pagination');
			expect(Array.isArray(response.seekers)).toBe(true);
			expect(typeof response.pagination).toBe('object');
		});

		it('should return createSeeker success response', () => {
			const response = mockServiceResponses.createSeekerSuccess;
			expect(response).toHaveProperty('id');
			expect(response).toHaveProperty('name');
			expect(response).toHaveProperty('contact');
			expect(response).toHaveProperty('city');
		});

		it('should return getSeekerBySlug success response', () => {
			const response = mockServiceResponses.getSeekerBySlugSuccess;
			expect(response).toHaveProperty('id');
			expect(response).toHaveProperty('slug');
			expect(response).toHaveProperty('name');
		});

		it('should return getSeekerById success response', () => {
			const response = mockServiceResponses.getSeekerByIdSuccess;
			expect(response).toHaveProperty('id');
			expect(response).toHaveProperty('name');
			expect(response).toHaveProperty('contact');
		});

		it('should return deleteSeeker success response', () => {
			const response = mockServiceResponses.deleteSeekerSuccess;
			expect(response).toHaveProperty('id');
			expect(response).toHaveProperty('name');
		});
	});

	describe('Mock Data Validation', () => {
		it('should have valid mock city data', () => {
			const city = mockCityData.telAviv;
			expect(city).toHaveProperty('id');
			expect(city).toHaveProperty('name');
			expect(city).toHaveProperty('translations');
			expect(Array.isArray(city.translations)).toBe(true);
		});

		it('should have valid mock seeker data', () => {
			const seeker = mockSeekerData.validSeeker;
			expect(seeker).toHaveProperty('id');
			expect(seeker).toHaveProperty('name');
			expect(seeker).toHaveProperty('contact');
			expect(seeker).toHaveProperty('city');
			expect(seeker).toHaveProperty('description');
			expect(seeker).toHaveProperty('isActive');
		});

		it('should have valid mock seeker creation data', () => {
			const data = mockSeekerCreationData.validSeekerData;
			expect(data).toHaveProperty('name');
			expect(data).toHaveProperty('contact');
			expect(data).toHaveProperty('city');
			expect(data).toHaveProperty('description');
			expect(data).toHaveProperty('languages');
		});

		it('should have valid mock query parameters', () => {
			const query = mockQueryParameters.basicQuery;
			expect(query).toHaveProperty('page');
			expect(query).toHaveProperty('limit');
			expect(query).toHaveProperty('lang');
		});

		it('should have valid mock pagination data', () => {
			const pagination = mockPaginationData.firstPage;
			expect(pagination).toHaveProperty('currentPage');
			expect(pagination).toHaveProperty('totalPages');
			expect(pagination).toHaveProperty('totalCount');
			expect(pagination).toHaveProperty('hasNextPage');
			expect(pagination).toHaveProperty('hasPrevPage');
		});

		it('should have valid mock where clause data', () => {
			const whereClause = mockWhereClauseData.basicWhereClause;
			expect(whereClause).toHaveProperty('isActive');
			expect(whereClause.isActive).toBe(true);
		});

		it('should have valid mock slug generation data', () => {
			const data = mockSlugGenerationData.basicName;
			expect(data).toHaveProperty('name');
			expect(data).toHaveProperty('description');
			expect(data).toHaveProperty('expectedSlug');
		});

		it('should have valid mock city translation data', () => {
			const translations = mockCityTranslationData.telAvivTranslations;
			expect(translations).toHaveProperty('ru');
			expect(translations).toHaveProperty('he');
			expect(translations).toHaveProperty('en');
			expect(translations).toHaveProperty('ar');
		});

		it('should have valid mock errors', () => {
			const errors = mockErrors;
			expect(errors).toHaveProperty('databaseError');
			expect(errors).toHaveProperty('cityNotFound');
			expect(errors).toHaveProperty('seekerNotFound');
			expect(errors).toHaveProperty('invalidId');
			expect(errors).toHaveProperty('notificationError');

			Object.values(errors).forEach(error => {
				expect(error).toBeInstanceOf(Error);
				expect(error.message).toBeDefined();
				expect(typeof error.message).toBe('string');
			});
		});

		it('should have valid mock error messages', () => {
			const errorMessages = mockErrorMessages;
			expect(errorMessages).toHaveProperty('databaseError');
			expect(errorMessages).toHaveProperty('cityNotFound');
			expect(errorMessages).toHaveProperty('seekerNotFound');
			expect(errorMessages).toHaveProperty('invalidId');
			expect(errorMessages).toHaveProperty('notificationError');

			Object.values(errorMessages).forEach(message => {
				expect(typeof message).toBe('string');
				expect(message.length).toBeGreaterThan(0);
			});
		});

		it('should have valid mock success messages', () => {
			const successMessages = mockSuccessMessages;
			expect(successMessages).toHaveProperty('seekersRetrieved');
			expect(successMessages).toHaveProperty('seekerCreated');
			expect(successMessages).toHaveProperty('seekerRetrieved');
			expect(successMessages).toHaveProperty('seekerDeleted');
			expect(successMessages).toHaveProperty('cityTranslated');
			expect(successMessages).toHaveProperty('slugGenerated');

			Object.values(successMessages).forEach(message => {
				expect(typeof message).toBe('string');
				expect(message.length).toBeGreaterThan(0);
			});
		});

		it('should have valid mock console log data', () => {
			const consoleLogData = mockConsoleLogData;
			expect(consoleLogData).toHaveProperty('serviceProcessingQuery');
			expect(consoleLogData).toHaveProperty('cityFilterApplied');
			expect(consoleLogData).toHaveProperty('categoryFilterApplied');
			expect(consoleLogData).toHaveProperty('seekersRetrieved');
			expect(consoleLogData).toHaveProperty('notificationFailed');

			Object.values(consoleLogData).forEach(message => {
				expect(typeof message).toBe('string');
				expect(message.length).toBeGreaterThan(0);
			});
		});

		it('should have valid mock service responses', () => {
			const responses = mockServiceResponses;
			expect(responses).toHaveProperty('getAllSeekersSuccess');
			expect(responses).toHaveProperty('createSeekerSuccess');
			expect(responses).toHaveProperty('getSeekerBySlugSuccess');
			expect(responses).toHaveProperty('getSeekerByIdSuccess');
			expect(responses).toHaveProperty('deleteSeekerSuccess');
		});

		it('should have valid mock data conversions', () => {
			const conversions = mockDataConversions;
			expect(conversions).toHaveProperty('string');
			expect(conversions).toHaveProperty('number');
			expect(conversions).toHaveProperty('boolean');
			expect(conversions).toHaveProperty('array');
			expect(conversions).toHaveProperty('object');
		});

		it('should have valid mock filtering logic', () => {
			const filteringLogic = mockFilteringLogic;
			expect(filteringLogic).toHaveProperty('buildWhereClause');
			expect(filteringLogic).toHaveProperty('applyFilters');
			expect(typeof filteringLogic.buildWhereClause).toBe('function');
			expect(typeof filteringLogic.applyFilters).toBe('function');
		});

		it('should have valid mock pagination logic', () => {
			const paginationLogic = mockPaginationLogic;
			expect(paginationLogic).toHaveProperty('calculatePagination');
			expect(paginationLogic).toHaveProperty('validatePagination');
			expect(typeof paginationLogic.calculatePagination).toBe('function');
			expect(typeof paginationLogic.validatePagination).toBe('function');
		});

		it('should have valid mock slug generation logic', () => {
			const slugLogic = mockSlugGenerationLogic;
			expect(slugLogic).toHaveProperty('generateSlug');
			expect(slugLogic).toHaveProperty('validateSlug');
			expect(slugLogic).toHaveProperty('normalizeSlug');
			expect(typeof slugLogic.generateSlug).toBe('function');
			expect(typeof slugLogic.validateSlug).toBe('function');
			expect(typeof slugLogic.normalizeSlug).toBe('function');
		});

		it('should have valid mock city translation logic', () => {
			const translationLogic = mockCityTranslationLogic;
			expect(translationLogic).toHaveProperty('translateCityName');
			expect(translationLogic).toHaveProperty('getAvailableLanguages');
			expect(translationLogic).toHaveProperty('isValidLanguage');
			expect(typeof translationLogic.translateCityName).toBe('function');
			expect(typeof translationLogic.getAvailableLanguages).toBe('function');
			expect(typeof translationLogic.isValidLanguage).toBe('function');
		});

		it('should have valid mock notification logic', () => {
			const notificationLogic = mockNotificationLogic;
			expect(notificationLogic).toHaveProperty('sendNotification');
			expect(notificationLogic).toHaveProperty('handleNotificationError');
			expect(notificationLogic).toHaveProperty('validateSeekerForNotification');
			expect(typeof notificationLogic.sendNotification).toBe('function');
			expect(typeof notificationLogic.handleNotificationError).toBe('function');
			expect(typeof notificationLogic.validateSeekerForNotification).toBe('function');
		});
	});
});
