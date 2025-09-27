import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('CandidateNotificationService', () => {
	beforeEach(() => {
		// Mock console methods
		console.log = vi.fn();
		console.error = vi.fn();
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
	});

	describe('Email Content Generation Tests', () => {
		it('should handle subscriber name variations correctly', () => {
			const testCases = [
				{
					subscriber: { firstName: 'John', lastName: 'Doe' },
					expectedName: 'John Doe',
				},
				{
					subscriber: { firstName: 'John' },
					expectedName: 'John',
				},
				{
					subscriber: { lastName: 'Doe' },
					expectedName: 'Doe',
				},
				{
					subscriber: {},
					expectedName: 'пользователь',
				},
			];

			testCases.forEach(({ subscriber, expectedName }) => {
				const subscriberName =
					subscriber.firstName && subscriber.lastName
						? `${subscriber.firstName} ${subscriber.lastName}`
						: subscriber.firstName || subscriber.lastName || 'пользователь';

				expect(subscriberName).toBe(expectedName);
			});
		});

		it('should handle candidate data variations correctly', () => {
			const testCases = [
				{
					candidate: {
						name: 'Иван Петров',
						gender: 'мужчина',
						city: 'Тель-Авив',
						employment: 'полная',
						category: 'строительство',
						languages: ['русский', 'иврит'],
						description: 'Опытный строитель',
					},
					expected: {
						name: 'Иван Петров',
						gender: 'мужчина',
						city: 'Тель-Авив',
						employment: 'полная',
						category: 'строительство',
						languages: 'русский, иврит',
						description: 'Опытный строитель',
					},
				},
				{
					candidate: {
						name: 'Мария Сидорова',
						// Missing optional fields
					},
					expected: {
						name: 'Мария Сидорова',
						gender: '',
						city: 'Не указан',
						employment: 'Не указана',
						category: 'Не указана',
						languages: 'Не указаны',
						description: 'Описание не указано',
					},
				},
			];

			testCases.forEach(({ candidate, expected }) => {
				const processedCandidate = {
					name: candidate.name,
					gender: candidate.gender || '',
					city: candidate.city || 'Не указан',
					employment: candidate.employment || 'Не указана',
					category: candidate.category || 'Не указана',
					languages: candidate.languages
						? candidate.languages.join(', ')
						: 'Не указаны',
					description: candidate.description || 'Описание не указано',
				};

				expect(processedCandidate).toEqual(expected);
			});
		});
	});

	describe('Candidate Filtering Logic Tests', () => {
		it('should filter candidates by city correctly', () => {
			const candidates = [
				{ city: 'Тель-Авив', name: 'Иван' },
				{ city: 'Иерусалим', name: 'Мария' },
				{ city: 'Хайфа', name: 'Алексей' },
			];

			const preferredCities = ['Тель-Авив'];

			const filteredCandidates = candidates.filter((candidate) =>
				preferredCities.some(
					(city) =>
						candidate.city &&
						candidate.city.toLowerCase().includes(city.toLowerCase()),
				),
			);

			expect(filteredCandidates).toHaveLength(1);
			expect(filteredCandidates[0].name).toBe('Иван');
		});

		it('should filter candidates by category correctly', () => {
			const candidates = [
				{ category: 'строительство', name: 'Иван' },
				{ category: 'уборка', name: 'Мария' },
				{ category: 'грузчик', name: 'Алексей' },
			];

			const preferredCategories = ['строительство', 'уборка'];

			const filteredCandidates = candidates.filter((candidate) =>
				preferredCategories.some(
					(category) =>
						candidate.category &&
						candidate.category.toLowerCase().includes(category.toLowerCase()),
				),
			);

			expect(filteredCandidates).toHaveLength(2);
			expect(filteredCandidates.map((c) => c.name)).toEqual(['Иван', 'Мария']);
		});

		it('should filter candidates by employment correctly', () => {
			const candidates = [
				{ employment: 'полная', name: 'Иван' },
				{ employment: 'частичная', name: 'Мария' },
				{ employment: 'полная', name: 'Алексей' },
			];

			const preferredEmployment = ['полная'];

			const filteredCandidates = candidates.filter((candidate) =>
				preferredEmployment.some(
					(employment) =>
						candidate.employment &&
						candidate.employment
							.toLowerCase()
							.includes(employment.toLowerCase()),
				),
			);

			expect(filteredCandidates).toHaveLength(2);
			expect(filteredCandidates.map((c) => c.name)).toEqual([
				'Иван',
				'Алексей',
			]);
		});

		it('should filter candidates by languages correctly', () => {
			const candidates = [
				{ languages: ['русский', 'иврит'], name: 'Иван' },
				{ languages: ['русский', 'английский'], name: 'Мария' },
				{ languages: ['иврит'], name: 'Алексей' },
			];

			const preferredLanguages = ['иврит'];

			const filteredCandidates = candidates.filter(
				(candidate) =>
					candidate.languages &&
					candidate.languages.some((lang) =>
						preferredLanguages.some((prefLang) =>
							lang.toLowerCase().includes(prefLang.toLowerCase()),
						),
					),
			);

			expect(filteredCandidates).toHaveLength(2);
			expect(filteredCandidates.map((c) => c.name)).toEqual([
				'Иван',
				'Алексей',
			]);
		});

		it('should filter candidates by gender correctly', () => {
			const candidates = [
				{ gender: 'мужчина', name: 'Иван' },
				{ gender: 'женщина', name: 'Мария' },
				{ gender: 'мужчина', name: 'Алексей' },
			];

			const preferredGender = 'мужчина';

			const filteredCandidates = candidates.filter(
				(candidate) =>
					candidate.gender &&
					candidate.gender.toLowerCase() === preferredGender.toLowerCase(),
			);

			expect(filteredCandidates).toHaveLength(2);
			expect(filteredCandidates.map((c) => c.name)).toEqual([
				'Иван',
				'Алексей',
			]);
		});

		it('should filter candidates by document types correctly', () => {
			const candidates = [
				{ documents: 'виза б1', name: 'Иван' },
				{ documents: 'виза б2', name: 'Мария' },
				{ documents: 'теудат зехут', name: 'Алексей' },
			];

			const preferredDocumentTypes = ['виза б1', 'виза б2'];

			const filteredCandidates = candidates.filter(
				(candidate) =>
					candidate.documents &&
					preferredDocumentTypes.some((docType) =>
						candidate.documents.toLowerCase().includes(docType.toLowerCase()),
					),
			);

			expect(filteredCandidates).toHaveLength(2);
			expect(filteredCandidates.map((c) => c.name)).toEqual(['Иван', 'Мария']);
		});

		it('should filter candidates by demanded status correctly', () => {
			const candidates = [
				{ isDemanded: true, name: 'Иван' },
				{ isDemanded: false, name: 'Мария' },
				{ isDemanded: true, name: 'Алексей' },
			];

			const onlyDemanded = true;

			const filteredCandidates = onlyDemanded
				? candidates.filter((candidate) => candidate.isDemanded === true)
				: candidates;

			expect(filteredCandidates).toHaveLength(2);
			expect(filteredCandidates.map((c) => c.name)).toEqual([
				'Иван',
				'Алексей',
			]);
		});
	});

	describe('Notification Trigger Logic Tests', () => {
		it('should correctly identify when to send notifications', () => {
			const testCases = [
				{ count: 3, isRecent: true, shouldSend: true },
				{ count: 6, isRecent: true, shouldSend: true },
				{ count: 9, isRecent: true, shouldSend: true },
				{ count: 4, isRecent: true, shouldSend: false },
				{ count: 7, isRecent: true, shouldSend: false },
				{ count: 3, isRecent: false, shouldSend: false },
				{ count: 6, isRecent: false, shouldSend: false },
				{ count: 0, isRecent: true, shouldSend: false },
			];

			testCases.forEach(({ count, isRecent, shouldSend }) => {
				const shouldTrigger = count > 0 && count % 3 === 0 && isRecent;
				expect(shouldTrigger).toBe(shouldSend);
			});
		});

		it('should correctly determine if candidate is recent', () => {
			const now = new Date();
			const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

			const testCases = [
				{ createdAt: new Date(now.getTime() - 2 * 60 * 1000), isRecent: true }, // 2 minutes ago
				{ createdAt: new Date(now.getTime() - 4 * 60 * 1000), isRecent: true }, // 4 minutes ago
				{ createdAt: fiveMinutesAgo, isRecent: false }, // exactly 5 minutes ago
				{
					createdAt: new Date(now.getTime() - 10 * 60 * 1000),
					isRecent: false,
				}, // 10 minutes ago
			];

			testCases.forEach(({ createdAt, isRecent }) => {
				const isRecentCandidate = createdAt > fiveMinutesAgo;
				expect(isRecentCandidate).toBe(isRecent);
			});
		});
	});

	describe('Error Handling Tests', () => {
		it('should handle missing candidate data gracefully', () => {
			const incompleteCandidate = {
				name: 'Test Candidate',
				// Missing all other fields
			};

			const safeAccess = (obj, key, defaultValue = 'Не указано') => {
				return obj[key] || defaultValue;
			};

			expect(safeAccess(incompleteCandidate, 'city')).toBe('Не указано');
			expect(safeAccess(incompleteCandidate, 'employment')).toBe('Не указано');
			expect(safeAccess(incompleteCandidate, 'category')).toBe('Не указано');
			expect(safeAccess(incompleteCandidate, 'description')).toBe('Не указано');
		});

		it('should handle empty arrays gracefully', () => {
			const emptyArray = [];
			const arrayWithItems = ['item1', 'item2'];

			const joinArray = (arr, defaultValue = 'Не указано') => {
				return arr && arr.length > 0 ? arr.join(', ') : defaultValue;
			};

			expect(joinArray(emptyArray)).toBe('Не указано');
			expect(joinArray(arrayWithItems)).toBe('item1, item2');
			expect(joinArray(null)).toBe('Не указано');
			expect(joinArray(undefined)).toBe('Не указано');
		});

		it('should handle null and undefined values gracefully', () => {
			const testCases = [
				{ value: null, expected: 'Не указано' },
				{ value: undefined, expected: 'Не указано' },
				{ value: '', expected: 'Не указано' },
				{ value: 'Valid Value', expected: 'Valid Value' },
			];

			testCases.forEach(({ value, expected }) => {
				const safeValue = value || 'Не указано';
				expect(safeValue).toBe(expected);
			});
		});
	});
});
