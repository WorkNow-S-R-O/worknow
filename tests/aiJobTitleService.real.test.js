import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';

const mockCreate = vi.fn();
vi.mock('openai', () => ({
  default: vi.fn(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  })),
}));

vi.mock('@prisma/client', () => ({
  default: {
    PrismaClient: vi.fn(() => ({
      job: { findMany: vi.fn(), update: vi.fn() },
    })),
  },
  PrismaClient: vi.fn(() => ({
    job: { findMany: vi.fn(), update: vi.fn() },
  })),
}));

let AIJobTitleService;

beforeAll(async () => {
  process.env.OPENAI_API_KEY = 'test-api-key';
  ({ default: AIJobTitleService } = await import('../apps/api/services/aiJobTitleService.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.useFakeTimers();
  process.env.OPENAI_API_KEY = 'test-api-key';
});

afterEach(() => {
  vi.useRealTimers();
});

describe('AIJobTitleService (extended coverage)', () => {
  describe('generateAITitle with OpenAI', () => {
    it('generates title successfully via OpenAI', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Повар' } }],
      });

      const resultPromise = AIJobTitleService.generateAITitle(
        'Ищем повара для работы в ресторане'
      );

      // Advance timers for rate limiter
      await vi.runAllTimersAsync();

      const result = await resultPromise;

      expect(result.title).toBe('Повар');
      expect(result.method).toBe('ai');
    });

    it('uses fallback when AI returns empty title', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: '' } }],
      });

      const resultPromise = AIJobTitleService.generateAITitle(
        'Ищем повара для работы в ресторане'
      );

      await vi.runAllTimersAsync();

      const result = await resultPromise;

      // Should use fallback
      expect(result.title).toBeDefined();
    });

    it('uses fallback when OpenAI throws quota error', async () => {
      mockCreate.mockRejectedValue(new Error('quota exceeded'));

      const resultPromise = AIJobTitleService.generateAITitle(
        'Ищем повара для работы в ресторане'
      );

      await vi.runAllTimersAsync();

      const result = await resultPromise;

      expect(result.method).toBe('rule-based');
    });

    it('uses fallback when OpenAI throws rate limit error', async () => {
      mockCreate.mockRejectedValue(new Error('429 too many requests'));

      const resultPromise = AIJobTitleService.generateAITitle(
        'Ищем повара для работы в ресторане'
      );

      await vi.runAllTimersAsync();

      const result = await resultPromise;

      expect(result.method).toBe('rule-based');
    });

    it('uses fallback on other errors', async () => {
      mockCreate.mockRejectedValue(new Error('Network error'));

      const resultPromise = AIJobTitleService.generateAITitle('Generic description');

      await vi.runAllTimersAsync();

      const result = await resultPromise;

      expect(result.method).toBe('rule-based');
    });
  });

  describe('calculateAIConfidence', () => {
    it('returns 0 for empty title', () => {
      expect(AIJobTitleService.calculateAIConfidence('', 'description')).toBe(0);
    });

    it('returns 0 for empty description', () => {
      expect(AIJobTitleService.calculateAIConfidence('title', '')).toBe(0);
    });

    it('calculates higher confidence when title words match description', () => {
      const confidence = AIJobTitleService.calculateAIConfidence(
        'Повар ресторан',
        'Ищем повара для работы в ресторане'
      );
      expect(confidence).toBeGreaterThan(0.5);
    });

    it('returns lower confidence for generic title', () => {
      const confidence = AIJobTitleService.calculateAIConfidence(
        'Общая вакансия работник',
        'Ищем сотрудника'
      );
      expect(confidence).toBeLessThan(0.5);
    });

    it('caps confidence at 1', () => {
      const confidence = AIJobTitleService.calculateAIConfidence(
        'повар повар повар',
        'ищем повара повара повара повара'
      );
      expect(confidence).toBeLessThanOrEqual(1);
    });

    it('floors confidence at 0', () => {
      const confidence = AIJobTitleService.calculateAIConfidence(
        'общая работник вакансия',
        'описание без совпадений'
      );
      expect(confidence).toBeGreaterThanOrEqual(0);
    });
  });

  describe('batchGenerateAITitles', () => {
    it('processes empty jobs array', async () => {
      const resultPromise = AIJobTitleService.batchGenerateAITitles([]);
      await vi.runAllTimersAsync();
      const results = await resultPromise;
      expect(results).toHaveLength(0);
    });

    it('generates titles for multiple jobs using fallback', async () => {
      delete process.env.OPENAI_API_KEY;

      const jobs = [
        { id: 1, description: 'Ищем повара', salary: '50', city: { name: 'TLV' } },
        { id: 2, description: 'Нужен уборщик', salary: '40', city: { name: 'Jerusalem' } },
      ];

      const resultPromise = AIJobTitleService.batchGenerateAITitles(jobs);
      await vi.runAllTimersAsync();
      const results = await resultPromise;

      expect(results).toHaveLength(2);
      expect(results[0].title).toBeDefined();
    });

    it('handles errors for individual jobs gracefully', async () => {
      process.env.OPENAI_API_KEY = 'test-key';
      mockCreate.mockRejectedValue(new Error('Network error'));

      const jobs = [
        { id: 1, description: 'Test job', salary: '50', city: { name: 'TLV' } },
      ];

      const resultPromise = AIJobTitleService.batchGenerateAITitles(jobs);
      await vi.runAllTimersAsync();
      const results = await resultPromise;

      // Should use fallback for failed jobs
      expect(results).toHaveLength(1);
      expect(results[0].title).toBeDefined();
    });
  });

  describe('fallbackTitleGeneration keywords', () => {
    const testCases = [
      ['Нужен уборщик офиса', 'Уборщик'],
      ['Ищем официанта', 'Официант'],
      ['Требуется водитель', 'Водитель'],
      ['Грузчик на склад', 'Грузчик'],
      ['Продавец в магазин', 'Продавец-консультант'],
      ['Кассир нужен', 'Кассир'],
      ['Строительные работы объект', 'Строитель'],
      ['Работа электрика', 'Электрик'],
      ['Нужна сиделка', 'Сиделка'],
      ['Ищем охранника', 'Охранник'],
      ['Вакансия парикмахера', 'Парикмахер'],
      ['Массажист требуется', 'Массажист'],
      ['Курьер нужен', 'Курьер'],
      ['Программист разработчик', 'Программист'],
      ['Сантехник нужен', 'Сантехник'],
      ['Маляр работа', 'Маляр'],
      ['Требуется няня для детей', 'Няня'],
    ];

    testCases.forEach(([description, expectedTitle]) => {
      it(`generates "${expectedTitle}" for description: "${description}"`, () => {
        const result = AIJobTitleService.fallbackTitleGeneration(description);
        expect(result.title).toBe(expectedTitle);
      });
    });
  });
});
