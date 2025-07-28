import { PrismaClient } from '@prisma/client';
import redisService from './redisService.js';

const prisma = new PrismaClient();

export const getJobsService = async (filters = {}) => {
  const { category, city, salary, shuttle, meals, page = 1, limit = 20 } = filters;
  
  try {
    // Try to get from cache first
    // const cacheKey = `jobs:${category || 'all'}:${city || 'all'}:${salary || 'all'}:${shuttle || 'all'}:${meals || 'all'}:${page}:${limit}`;
    // const cachedJobs = await redisService.get(cacheKey);
    
    // if (cachedJobs) {
    //   console.log('🚀 Jobs served from Redis cache!');
    //   return cachedJobs;
    // }
    
    console.log('💾 Fetching jobs from database...');
    
    // Build query with filters
    const where = {};
    if (category) where.categoryId = parseInt(category);
    if (city) where.cityId = parseInt(city);
    if (shuttle) where.shuttle = true;
    if (meals) where.meals = true;
    
    // For salary filtering, we'll need to handle it differently since salary is stored as string
    // We'll filter in JavaScript after fetching the jobs
    
    const skip = (page - 1) * limit;
    
    // Get total count first (without pagination)
    const total = await prisma.job.count({ where });
    
    // Get jobs with pagination
    const jobs = await prisma.job.findMany({
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
    });
    
    // Filter by salary if specified (since salary is stored as string)
    let filteredJobs = jobs;
    if (salary) {
      const minSalary = parseInt(salary);
      filteredJobs = jobs.filter(job => {
        // Extract numeric value from salary string (e.g., "45" from "45 шек/час")
        const salaryMatch = job.salary.match(/(\d+)/);
        if (salaryMatch) {
          const jobSalary = parseInt(salaryMatch[1]);
          return jobSalary >= minSalary;
        }
        return false;
      });
    }
    
    const result = { 
      jobs: filteredJobs, 
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / limit)
      }
    };
    
    // Cache the result for 5 minutes
    // await redisService.set(cacheKey, result, 300);
    // console.log('💾 Jobs cached in Redis for 5 minutes');
    
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