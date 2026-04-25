import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockSeekerCreate = vi.fn();
const mockSeekerFindMany = vi.fn();
const mockSeekerFindUnique = vi.fn();
const mockSeekerFindFirst = vi.fn();
const mockSeekerDelete = vi.fn();
const mockSeekerCount = vi.fn();
const mockCityFindFirst = vi.fn();

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    seeker: {
      create: mockSeekerCreate,
      findMany: mockSeekerFindMany,
      findUnique: mockSeekerFindUnique,
      findFirst: mockSeekerFindFirst,
      delete: mockSeekerDelete,
      count: mockSeekerCount,
    },
    city: {
      findFirst: mockCityFindFirst,
    },
  })),
}));

const mockSendNotification = vi.fn();
vi.mock('../apps/api/services/notificationService.js', () => ({
  sendSingleCandidateNotification: mockSendNotification,
}));

let getAllSeekers, createSeeker, getSeekerBySlug, deleteSeeker, getSeekerById;

beforeAll(async () => {
  ({ getAllSeekers, createSeeker, getSeekerBySlug, deleteSeeker, getSeekerById } =
    await import('../apps/api/services/seekerService.js'));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  mockCityFindFirst.mockResolvedValue(null); // Default: no translation available
});

const mockSeeker = {
  id: 1,
  name: 'Ivan Petrov',
  contact: '+972501234567',
  city: 'Tel Aviv',
  description: 'Experienced worker',
  gender: 'мужчина',
  isDemanded: false,
  facebook: null,
  languages: ['русский', 'иврит'],
  nativeLanguage: 'русский',
  category: 'Construction',
  employment: 'full',
  documents: 'Visa B1',
  announcement: null,
  note: null,
  documentType: 'Виза Б1',
  isActive: true,
  createdAt: new Date(),
  slug: 'ivan-petrov-experienced-worker',
};

describe('seekerService', () => {
  describe('getAllSeekers', () => {
    it('returns seekers with pagination', async () => {
      mockSeekerCount.mockResolvedValue(1);
      mockSeekerFindMany.mockResolvedValue([mockSeeker]);

      const result = await getAllSeekers({});

      expect(result.seekers).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.totalCount).toBe(1);
    });

    it('applies city filter', async () => {
      mockSeekerCount.mockResolvedValue(1);
      mockSeekerFindMany.mockResolvedValue([mockSeeker]);

      await getAllSeekers({ city: 'Tel Aviv' });

      expect(mockSeekerFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ city: 'Tel Aviv' }),
        })
      );
    });

    it('applies category filter', async () => {
      mockSeekerCount.mockResolvedValue(0);
      mockSeekerFindMany.mockResolvedValue([]);

      await getAllSeekers({ category: 'Construction' });

      expect(mockSeekerFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: 'Construction' }),
        })
      );
    });

    it('applies employment filter', async () => {
      mockSeekerCount.mockResolvedValue(0);
      mockSeekerFindMany.mockResolvedValue([]);

      await getAllSeekers({ employment: 'full' });

      expect(mockSeekerFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ employment: 'full' }),
        })
      );
    });

    it('applies documentType filter', async () => {
      mockSeekerCount.mockResolvedValue(0);
      mockSeekerFindMany.mockResolvedValue([]);

      await getAllSeekers({ documentType: 'Виза Б1' });

      expect(mockSeekerFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ documentType: 'Виза Б1' }),
        })
      );
    });

    it('applies languages filter', async () => {
      mockSeekerCount.mockResolvedValue(0);
      mockSeekerFindMany.mockResolvedValue([]);

      await getAllSeekers({ languages: ['русский', 'иврит'] });

      expect(mockSeekerFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ languages: { hasSome: ['русский', 'иврит'] } }),
        })
      );
    });

    it('applies gender filter', async () => {
      mockSeekerCount.mockResolvedValue(0);
      mockSeekerFindMany.mockResolvedValue([]);

      await getAllSeekers({ gender: 'мужчина' });

      expect(mockSeekerFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ gender: 'мужчина' }),
        })
      );
    });

    it('applies isDemanded filter with string true', async () => {
      mockSeekerCount.mockResolvedValue(0);
      mockSeekerFindMany.mockResolvedValue([]);

      await getAllSeekers({ isDemanded: 'true' });

      expect(mockSeekerFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isDemanded: true }),
        })
      );
    });

    it('applies isDemanded filter with boolean', async () => {
      mockSeekerCount.mockResolvedValue(0);
      mockSeekerFindMany.mockResolvedValue([]);

      await getAllSeekers({ isDemanded: true });

      expect(mockSeekerFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isDemanded: true }),
        })
      );
    });

    it('uses city translation when available', async () => {
      mockSeekerCount.mockResolvedValue(1);
      mockSeekerFindMany.mockResolvedValue([mockSeeker]);
      mockCityFindFirst.mockResolvedValue({
        name: 'Tel Aviv',
        translations: [{ name: 'Тель-Авив', lang: 'ru' }],
      });

      const result = await getAllSeekers({});

      expect(result.seekers[0].city).toBe('Тель-Авив');
    });

    it('falls back to original city name when translation fails', async () => {
      mockSeekerCount.mockResolvedValue(1);
      mockSeekerFindMany.mockResolvedValue([mockSeeker]);
      mockCityFindFirst.mockRejectedValue(new Error('DB error'));

      const result = await getAllSeekers({});

      expect(result.seekers[0].city).toBe('Tel Aviv');
    });

    it('handles pagination correctly', async () => {
      mockSeekerCount.mockResolvedValue(30);
      mockSeekerFindMany.mockResolvedValue([]);

      const result = await getAllSeekers({ page: 2, limit: 10 });

      expect(result.pagination.currentPage).toBe(2);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(true);
    });
  });

  describe('createSeeker', () => {
    it('creates seeker and sends notification', async () => {
      mockSeekerCreate.mockResolvedValue(mockSeeker);
      mockSendNotification.mockResolvedValue(undefined);

      const result = await createSeeker({
        name: 'Ivan Petrov',
        contact: '+972501234567',
        city: 'Tel Aviv',
        description: 'Experienced worker',
        gender: 'мужчина',
        isDemanded: false,
        languages: ['русский'],
        nativeLanguage: 'русский',
        category: 'Construction',
        employment: 'full',
        documentType: 'Виза Б1',
      });

      expect(result).toEqual(mockSeeker);
      expect(mockSendNotification).toHaveBeenCalledWith(mockSeeker);
    });

    it('creates seeker even when notification fails', async () => {
      mockSeekerCreate.mockResolvedValue(mockSeeker);
      mockSendNotification.mockRejectedValue(new Error('Notification error'));

      const result = await createSeeker({ name: 'Test', description: 'Test desc' });

      expect(result).toEqual(mockSeeker);
    });
  });

  describe('getSeekerBySlug', () => {
    it('returns seeker by slug', async () => {
      mockSeekerFindUnique.mockResolvedValue(mockSeeker);

      const result = await getSeekerBySlug('ivan-petrov-experienced-worker');

      expect(result).toEqual(mockSeeker);
    });
  });

  describe('deleteSeeker', () => {
    it('deletes seeker by id', async () => {
      mockSeekerDelete.mockResolvedValue(mockSeeker);

      const result = await deleteSeeker('1');

      expect(mockSeekerDelete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('getSeekerById', () => {
    it('returns seeker by id', async () => {
      mockSeekerFindUnique.mockResolvedValue(mockSeeker);

      const result = await getSeekerById('1');

      expect(result).toEqual(mockSeeker);
      expect(mockSeekerFindUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
