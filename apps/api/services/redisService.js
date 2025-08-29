import Redis from 'ioredis';

class RedisService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.redis.on('connect', () => {
      // Redis connected successfully
    });

    this.redis.on('error', (err) => {
      console.error('❌ Redis connection error:', err);
    });

    this.redis.on('ready', () => {
      // Redis is ready for operations
    });
  }

  // Cache management
  async set(key, value, ttl = 3600) {
    try {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      await this.redis.setex(key, ttl, serializedValue);
      // Data cached successfully
      return true;
    } catch (error) {
      console.error('❌ Redis set error:', error);
      return false;
    }
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      if (value) {
        // Cache hit - data retrieved
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      // Cache miss - data not found
      return null;
    } catch (error) {
      console.error('❌ Redis get error:', error);
      return null;
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
      // Cache entry deleted
      return true;
    } catch (error) {
      console.error('❌ Redis del error:', error);
      return false;
    }
  }

  // Session management
  async setSession(sessionId, userData, ttl = 86400) {
    return this.set(`session:${sessionId}`, userData, ttl);
  }

  async getSession(sessionId) {
    return this.get(`session:${sessionId}`);
  }

  async deleteSession(sessionId) {
    return this.del(`session:${sessionId}`);
  }

  // Rate limiting
  async checkRateLimit(identifier, limit = 100, window = 3600) {
    const key = `rate_limit:${identifier}`;
    try {
      const current = await this.redis.incr(key);
      if (current === 1) {
        await this.redis.expire(key, window);
      }
      
      const remaining = Math.max(0, limit - current);
      const resetTime = await this.redis.ttl(key);
      
      return {
        allowed: current <= limit,
        remaining,
        resetTime,
        limit
      };
    } catch (error) {
      console.error('❌ Rate limit check error:', error);
      return { allowed: true, remaining: limit, resetTime: window, limit };
    }
  }

  // Job listings cache
  async cacheJobs(category, city, page, jobs) {
    const key = `jobs:${category || 'all'}:${city || 'all'}:${page}`;
    return this.set(key, jobs, 300); // 5 minutes cache
  }

  async getCachedJobs(category, city, page) {
    const key = `jobs:${category || 'all'}:${city || 'all'}:${page}`;
    return this.get(key);
  }

  async invalidateJobsCache() {
    try {
      const keys = await this.redis.keys('jobs:*');
      if (keys.length > 0) {
        await this.redis.del(...keys);
        // Job cache entries invalidated
      }
      return true;
    } catch (error) {
      console.error('❌ Cache invalidation error:', error);
      return false;
    }
  }

  // User activity tracking
  async trackUserActivity(userId, action) {
    const key = `activity:${userId}`;
    try {
      const activity = {
        action,
        timestamp: new Date().toISOString(),
        ip: 'tracked_ip' // You can add IP tracking here
      };
      
      await this.redis.lpush(key, JSON.stringify(activity));
      await this.redis.ltrim(key, 0, 99); // Keep last 100 activities
      await this.redis.expire(key, 86400); // 24 hours
      
      return true;
    } catch (error) {
      console.error('❌ Activity tracking error:', error);
      return false;
    }
  }

  // Real-time notifications
  async publishNotification(channel, message) {
    try {
      await this.redis.publish(channel, JSON.stringify(message));
      // Message published to channel
      return true;
    } catch (error) {
      console.error('❌ Notification publish error:', error);
      return false;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const start = Date.now();
      await this.redis.ping();
      const latency = Date.now() - start;
      
      return {
        status: 'healthy',
        latency: `${latency}ms`,
        memory: await this.redis.info('memory'),
        connected: this.redis.status === 'ready'
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false
      };
    }
  }

  // Close connection
  async close() {
    try {
      await this.redis.quit();
      // Redis connection closed
    } catch (error) {
      console.error('❌ Redis close error:', error);
    }
  }
}

// Create singleton instance
const redisService = new RedisService();

export default redisService; 