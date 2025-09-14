import redisService from '../services/redisService.js';

const registerHealthRoutes = (app) => {
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  app.get('/api/redis/health', async (req, res) => {
    try {
      const redisHealth = await redisService.healthCheck();
      res.status(200).json({
        status: 'healthy',
        redis: redisHealth,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });
};

export default registerHealthRoutes;
