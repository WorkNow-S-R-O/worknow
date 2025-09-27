import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock OpenAI
vi.mock('openai', () => ({
	default: vi.fn(() => ({
		chat: {
			completions: {
				create: vi.fn(),
			},
		},
	})),
}));

// Mock Prisma
vi.mock('@prisma/client', () => ({
	default: {
		PrismaClient: vi.fn(() => ({
			job: {
				findMany: vi.fn(),
				update: vi.fn(),
			},
		})),
	},
	PrismaClient: vi.fn(() => ({
		job: {
			findMany: vi.fn(),
			update: vi.fn(),
		},
	})),
}));

import AIJobTitleService from '../apps/api/services/aiJobTitleService.js';

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

describe('AIJobTitleService', () => {
	beforeEach(() => {
		// Reset all mocks
		vi.clearAllMocks();

		// Mock console methods
		console.log = vi.fn();
		console.error = vi.fn();
		console.warn = vi.fn();

		// Set up environment variables
		process.env.OPENAI_API_KEY = 'test-api-key';
	});

	afterEach(() => {
		// Restore console methods
		console.log = originalConsoleLog;
		console.error = originalConsoleError;
		console.warn = originalConsoleWarn;

		// Clean up environment
		delete process.env.OPENAI_API_KEY;
	});

	describe('Static Methods', () => {
		describe('buildPrompt', () => {
			it('should build prompt with description only', () => {
				const description = 'Ищем повара для работы в ресторане';
				const prompt = AIJobTitleService.buildPrompt(description);

				expect(prompt).toContain(description);
				expect(prompt).toContain(
					'Generate a concise, professional job title in Russian',
				);
			});

			it('should build prompt with context', () => {
				const description = 'Ищем повара для работы в ресторане';
				const context = {
					city: 'Tel Aviv',
					salary: '50',
					requirements: 'опыт работы',
				};
				const prompt = AIJobTitleService.buildPrompt(description, context);

				expect(prompt).toContain(description);
				expect(prompt).toContain('Location: Tel Aviv');
				expect(prompt).toContain('Salary: 50 шек/час');
				expect(prompt).toContain('Requirements: опыт работы');
			});
		});

		describe('fallbackTitleGeneration', () => {
			it('should generate titles based on keywords', () => {
				const testCases = [
					{ description: 'Ищем повара для кухни', expected: 'Повар' },
					{ description: 'Нужен уборщик для офиса', expected: 'Уборщик' },
					{
						description: 'Требуется официант в ресторан',
						expected: 'Официант',
					},
					{ description: 'Ищем грузчика на склад', expected: 'Грузчик' },
					{ description: 'Нужен водитель для доставки', expected: 'Водитель' },
					{
						description: 'Требуется продавец в магазин',
						expected: 'Продавец-консультант',
					},
					{ description: 'Ищем кассира на кассу', expected: 'Кассир' },
					{ description: 'Нужен строитель на стройку', expected: 'Строитель' },
					{ description: 'Требуется электрик', expected: 'Электрик' },
					{ description: 'Ищем сантехника', expected: 'Сантехник' },
					{ description: 'Нужен маляр', expected: 'Маляр' },
					{ description: 'Требуется курьер', expected: 'Курьер' },
					{ description: 'Ищем программиста', expected: 'Программист' },
					{ description: 'Нужна сиделка', expected: 'Сиделка' },
					{ description: 'Требуется няня', expected: 'Няня' },
					{ description: 'Ищем охранника', expected: 'Охранник' },
					{ description: 'Нужен парикмахер', expected: 'Парикмахер' },
					{ description: 'Требуется массажист', expected: 'Массажист' },
				];

				testCases.forEach(({ description, expected }) => {
					const result = AIJobTitleService.fallbackTitleGeneration(description);
					expect(result.title).toBe(expected);
					expect(result.method).toBe('rule-based');
					expect(result.confidence).toBe(0.6);
				});
			});

			it('should return generic title for unknown keywords', () => {
				const description = 'Ищем работника для непонятной работы';
				const result = AIJobTitleService.fallbackTitleGeneration(description);

				expect(result.title).toBe('Общая вакансия');
				expect(result.method).toBe('rule-based');
				expect(result.confidence).toBe(0.6);
			});

			it('should include analysis in result', () => {
				const description =
					'Ищем повара с опытом работы в ресторане в Тель-Авиве, зарплата 50 шек/час';
				const result = AIJobTitleService.fallbackTitleGeneration(description);

				expect(result.analysis).toEqual({
					hasSpecificKeywords: true,
					hasLocation: true,
					hasSalary: true,
					hasLanguageRequirement: false,
					hasExperienceRequirement: true,
				});
			});
		});

		describe('calculateAIConfidence', () => {
			it('should calculate confidence based on keyword matching', () => {
				const title = 'Повар в ресторане';
				const description = 'Ищем повара для работы в ресторане';

				const confidence = AIJobTitleService.calculateAIConfidence(
					title,
					description,
				);

				expect(confidence).toBeGreaterThan(0.5);
				expect(confidence).toBeLessThanOrEqual(1);
			});

			it('should return 0 for empty inputs', () => {
				expect(AIJobTitleService.calculateAIConfidence('', '')).toBe(0);
				expect(AIJobTitleService.calculateAIConfidence(null, null)).toBe(0);
				expect(
					AIJobTitleService.calculateAIConfidence(undefined, undefined),
				).toBe(0);
			});

			it('should reduce confidence for generic titles', () => {
				const title = 'Общая вакансия';
				const description = 'Ищем работника';

				const confidence = AIJobTitleService.calculateAIConfidence(
					title,
					description,
				);

				expect(confidence).toBeLessThan(0.5);
			});
		});

		describe('extractRequirements', () => {
			it('should extract requirements from description', () => {
				const testCases = [
					{
						description: 'Требуется опыт работы\nЗарплата 50 шек',
						expected: 'опыт работы',
					},
					{
						description: 'Требования: знание иврита\nРабота в офисе',
						expected: 'знание иврита',
					},
					{
						description: 'Обязательно наличие документов\nПолная занятость',
						expected: 'наличие документов',
					},
				];

				testCases.forEach(({ description, expected }) => {
					const result = AIJobTitleService.extractRequirements(description);
					expect(result).toBe(expected);
				});
			});

			it('should return empty string when no requirements found', () => {
				const description = 'Просто описание работы без требований';
				const result = AIJobTitleService.extractRequirements(description);
				expect(result).toBe('');
			});
		});

		describe('Analysis Helper Functions', () => {
			describe('hasSpecificKeywords', () => {
				it('should detect specific job keywords', () => {
					const keywords = [
						'повар',
						'официант',
						'грузчик',
						'водитель',
						'продавец',
					];

					keywords.forEach((keyword) => {
						const description = `Ищем ${keyword} для работы`;
						expect(AIJobTitleService.hasSpecificKeywords(description)).toBe(
							true,
						);
					});
				});

				it('should return false for generic descriptions', () => {
					const description = 'Ищем работника для непонятной работы';
					expect(AIJobTitleService.hasSpecificKeywords(description)).toBe(
						false,
					);
				});
			});

			describe('hasLocation', () => {
				it('should detect location mentions', () => {
					const testCases = [
						'Работа в Тель-Авиве',
						'На склад в Иерусалиме',
						'В офисе Хайфы',
					];

					testCases.forEach((description) => {
						expect(AIJobTitleService.hasLocation(description)).toBe(true);
					});
				});

				it('should return false when no location mentioned', () => {
					const description = 'Работа без указания места';
					expect(AIJobTitleService.hasLocation(description)).toBe(false);
				});
			});

			describe('hasSalary', () => {
				it('should detect salary mentions', () => {
					const testCases = [
						'Зарплата 50 шек/час',
						'50 ₪ в час',
						'50 ILS за час',
					];

					testCases.forEach((description) => {
						expect(AIJobTitleService.hasSalary(description)).toBe(true);
					});
				});

				it('should return false when no salary mentioned', () => {
					const description = 'Работа без указания зарплаты';
					expect(AIJobTitleService.hasSalary(description)).toBe(false);
				});
			});

			describe('hasLanguageRequirement', () => {
				it('should detect language requirements', () => {
					const testCases = [
						'Требуется знание иврита',
						'Обязательно английский язык',
						'Нужен русский язык',
					];

					testCases.forEach((description) => {
						expect(AIJobTitleService.hasLanguageRequirement(description)).toBe(
							true,
						);
					});
				});

				it('should return false when no language requirements', () => {
					const description = 'Работа без языковых требований';
					expect(AIJobTitleService.hasLanguageRequirement(description)).toBe(
						false,
					);
				});
			});

			describe('hasExperienceRequirement', () => {
				it('should detect experience requirements', () => {
					const testCases = [
						'Требуется опыт работы',
						'Нужен опытный работник',
						'Обязательно опыт работы в сфере',
					];

					testCases.forEach((description) => {
						expect(
							AIJobTitleService.hasExperienceRequirement(description),
						).toBe(true);
					});
				});

				it('should return false when no experience requirements', () => {
					const description = 'Работа без требований к стажу';
					expect(AIJobTitleService.hasExperienceRequirement(description)).toBe(
						false,
					);
				});
			});
		});
	});

	describe('AI Title Generation', () => {
		it('should use fallback when OpenAI API key is missing', async () => {
			delete process.env.OPENAI_API_KEY;

			const description = 'Ищем повара для работы в ресторане';
			const result = await AIJobTitleService.generateAITitle(description);

			expect(result.method).toBe('rule-based');
			expect(result.title).toBe('Повар');
			expect(console.warn).toHaveBeenCalledWith(
				'⚠️ OpenAI API key not found. Using fallback method.',
			);
		});
	});
});
