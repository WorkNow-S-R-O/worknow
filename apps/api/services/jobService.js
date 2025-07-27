import { PrismaClient } from '@prisma/client';
import redisService from './redisService.js';

const prisma = new PrismaClient();

export const getJobsService = async (filters = {}) => {
  const { category, city, page = 1, limit = 20 } = filters;
  
  try {
    // Try to get from cache first
    const cacheKey = `jobs:${category || 'all'}:${city || 'all'}:${page}:${limit}`;
    const cachedJobs = await redisService.get(cacheKey);
    
    if (cachedJobs) {
      console.log('🚀 Jobs served from Redis cache!');
      return cachedJobs;
    }
    
    console.log('💾 Fetching jobs from database...');
    
    // Build query with filters
    const where = {};
    if (category) where.categoryId = parseInt(category);
    if (city) where.cityId = parseInt(city);
    
    const skip = (page - 1) * limit;
    
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { 
          city: true, 
          user: true, 
          category: { include: { translations: true } } 
        },
        orderBy: [
          { user: { isPremium: 'desc' } },
          { boostedAt: { sort: 'desc', nulls: 'last' } },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.job.count({ where })
    ]);
    
    const result = { 
      jobs, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
    
    // Cache the result for 5 minutes
    await redisService.set(cacheKey, result, 300);
    console.log('💾 Jobs cached in Redis for 5 minutes');
    
    return result;
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    return { error: 'Ошибка получения объявлений', details: error.message };
  }
};

export const getJobByIdService = async (id) => {
  try {
    // Try to get from cache first
    const cacheKey = `job:${id}`;
    const cachedJob = await redisService.get(cacheKey);
    
    if (cachedJob) {
      console.log('🚀 Job served from Redis cache!');
      return cachedJob;
    }
    
    console.log('💾 Fetching job from database...');
    
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: { 
        city: true, 
        user: true, 
        category: { include: { translations: true } } 
      }
    });
    
    if (!job) {
      return { error: 'Вакансия не найдена' };
    }
    
    // Cache the job for 10 minutes
    await redisService.set(cacheKey, { job }, 600);
    console.log('💾 Job cached in Redis for 10 minutes');
    
    return { job };
  } catch (error) {
    console.error('❌ Error fetching job:', error);
    return { error: 'Ошибка получения объявления', details: error.message };
  }
};

export const createJobService = async (jobData) => {
  try {
    const job = await prisma.job.create({
      data: jobData,
      include: { 
        city: true, 
        user: true, 
        category: { include: { translations: true } } 
      }
    });
    
    // Invalidate related caches when new job is created
    await redisService.invalidateJobsCache();
    console.log('🗑️ Job caches invalidated after new job creation');
    
    return job;
  } catch (error) {
    console.error('❌ Error creating job:', error);
    throw error;
  }
};