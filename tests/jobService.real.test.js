import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

const mockCount = vi.fn();
const mockFindMany = vi.fn();
const mockFindUnique = vi.fn();
const mockCreate = vi.fn();

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    job: {
      count: mockCount,
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      create: mockCreate,
    },
  })),
}));

const mockRedisGet = vi.fn();
const mockRedisSet = vi.fn();
const mockRedisInvalidate = vi.fn();

vi.mock('../apps/api/services/redisService.js', () => ({
  default: {
    get: mockRedisGet,
    set: mockRedisSet,
    invalidateJobsCache: mockRedisInvalidate,
  },
}));

let getJobsService, getJobByIdService, createJobService;

beforeAll(async () => {
  ({ getJobsService, getJobByIdService, createJobService } = await import(
    '../apps/api/services/jobService.js'
  ));
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  mockRedisGet.mockResolvedValue(null);
  mockRedisSet.mockResolvedValue(undefined);
  mockRedisInvalidate.mockResolvedValue(undefined);
});

const mockJob = {
  id: 1,
  title: 'Developer',
  salary: '45 шек/час',
  city: { id: 1, name: 'Tel Aviv' },
  user: { id: 'u1', isPremium: false },
  category: { id: 1, name: 'IT', translations: [] },
};

describe('jobService', () => {
  describe('getJobsService', () => {
    it('returns jobs with pagination when no filters', async () => {
      mockCount.mockResolvedValue(1);
      mockFindMany.mockResolvedValue([mockJob]);

      const result = await getJobsService({});

      expect(result.jobs).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.total).toBe(1);
    });

    it('applies category filter', async () => {
      mockCount.mockResolvedValue(1);
      mockFindMany.mockResolvedValue([mockJob]);

      await getJobsService({ category: '1' });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId: 1 }),
        })
      );
    });

    it('applies city filter', async () => {
      mockCount.mockResolvedValue(1);
      mockFindMany.mockResolvedValue([mockJob]);

      await getJobsService({ city: '2' });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ cityId: 2 }),
        })
      );
    });

    it('applies shuttle filter', async () => {
      mockCount.mockResolvedValue(1);
      mockFindMany.mockResolvedValue([mockJob]);

      await getJobsService({ shuttle: true });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ shuttle: true }),
        })
      );
    });

    it('applies meals filter', async () => {
      mockCount.mockResolvedValue(1);
      mockFindMany.mockResolvedValue([mockJob]);

      await getJobsService({ meals: true });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ meals: true }),
        })
      );
    });

    it('filters by salary', async () => {
      mockCount.mockResolvedValue(2);
      mockFindMany.mockResolvedValue([
        { ...mockJob, salary: '40 шек/час' },
        { ...mockJob, id: 2, salary: '50 шек/час' },
      ]);

      const result = await getJobsService({ salary: '45' });

      expect(result.jobs).toHaveLength(1);
      expect(result.jobs[0].salary).toBe('50 шек/час');
    });

    it('handles salary filter with no matching jobs', async () => {
      mockCount.mockResolvedValue(1);
      mockFindMany.mockResolvedValue([{ ...mockJob, salary: '30 шек/час' }]);

      const result = await getJobsService({ salary: '100' });

      expect(result.jobs).toHaveLength(0);
    });

    it('handles salary filter when salary has no numeric value', async () => {
      mockCount.mockResolvedValue(1);
      mockFindMany.mockResolvedValue([{ ...mockJob, salary: 'negotiable' }]);

      const result = await getJobsService({ salary: '30' });

      expect(result.jobs).toHaveLength(0);
    });

    it('uses pagination correctly', async () => {
      mockCount.mockResolvedValue(100);
      mockFindMany.mockResolvedValue([]);

      const result = await getJobsService({ page: 2, limit: 10 });

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.pages).toBe(10);
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 10, take: 10 })
      );
    });

    it('returns error object when prisma throws', async () => {
      mockCount.mockRejectedValue(new Error('DB error'));

      const result = await getJobsService({});

      expect(result).toHaveProperty('error');
      expect(result.details).toBeDefined();
    });
  });

  describe('getJobByIdService', () => {
    it('returns job from cache when available', async () => {
      const cached = { job: mockJob };
      mockRedisGet.mockResolvedValue(cached);

      const result = await getJobByIdService(1);

      expect(result).toEqual(cached);
      expect(mockFindUnique).not.toHaveBeenCalled();
    });

    it('fetches job from DB and caches it', async () => {
      mockRedisGet.mockResolvedValue(null);
      mockFindUnique.mockResolvedValue(mockJob);

      const result = await getJobByIdService(1);

      expect(result).toEqual({ job: mockJob });
      expect(mockRedisSet).toHaveBeenCalledWith(
        'job:1',
        { job: mockJob },
        600
      );
    });

    it('returns error when job not found', async () => {
      mockRedisGet.mockResolvedValue(null);
      mockFindUnique.mockResolvedValue(null);

      const result = await getJobByIdService(999);

      expect(result).toHaveProperty('error', 'Вакансия не найдена');
    });

    it('returns error when DB throws', async () => {
      mockRedisGet.mockResolvedValue(null);
      mockFindUnique.mockRejectedValue(new Error('DB error'));

      const result = await getJobByIdService(1);

      expect(result).toHaveProperty('error');
      expect(result.details).toBeDefined();
    });
  });

  describe('createJobService', () => {
    it('creates a job and invalidates cache', async () => {
      const jobData = {
        title: 'New Job',
        salary: '50 шек/час',
        city: { connect: { id: 1 } },
      };
      mockCreate.mockResolvedValue({ ...jobData, id: 1 });

      const result = await createJobService(jobData);

      expect(result).toHaveProperty('id', 1);
      expect(mockRedisInvalidate).toHaveBeenCalledOnce();
    });

    it('throws when DB throws on create', async () => {
      mockCreate.mockRejectedValue(new Error('DB error'));

      await expect(createJobService({})).rejects.toThrow('DB error');
    });
  });
});
