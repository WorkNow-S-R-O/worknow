import redisService from '../services/redisService.js';

// Cache middleware for API responses
export const cacheMiddleware = (ttl = 300) => {
	return async (req, res, next) => {
		// Skip caching for non-GET requests
		if (req.method !== 'GET') {
			return next();
		}

		// Create cache key based on URL and query parameters
		const cacheKey = `api:${req.originalUrl}`;

		try {
			// Try to get cached response
			const cachedResponse = await redisService.get(cacheKey);

			if (cachedResponse) {
				// Cache hit - serving from cache
				return res.json(cachedResponse);
			}

			// If no cache, intercept the response
			const originalSend = res.json;
			res.json = function (data) {
				// Cache the response
				redisService.set(cacheKey, data, ttl);
				// Response cached successfully

				// Send the original response
				return originalSend.call(this, data);
			};

			next();
		} catch (error) {
			console.error('❌ Cache middleware error:', error);
			next(); // Continue without caching if Redis fails
		}
	};
};

// Rate limiting middleware
export const rateLimitMiddleware = (limit = 100, window = 3600) => {
	return async (req, res, next) => {
		const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';

		try {
			const rateLimit = await redisService.checkRateLimit(
				identifier,
				limit,
				window,
			);

			// Add rate limit headers
			res.set({
				'X-RateLimit-Limit': rateLimit.limit,
				'X-RateLimit-Remaining': rateLimit.remaining,
				'X-RateLimit-Reset': rateLimit.resetTime,
			});

			if (!rateLimit.allowed) {
				return res.status(429).json({
					error: 'Rate limit exceeded',
					message: `Too many requests. Try again in ${rateLimit.resetTime} seconds.`,
					retryAfter: rateLimit.resetTime,
				});
			}

			next();
		} catch (error) {
			console.error('❌ Rate limit middleware error:', error);
			next(); // Continue without rate limiting if Redis fails
		}
	};
};

// Session middleware using Redis
export const sessionMiddleware = () => {
	return async (req, res, next) => {
		const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

		if (sessionId) {
			try {
				const session = await redisService.getSession(sessionId);
				if (session) {
					req.session = session;
					// Session loaded from cache
				}
			} catch (error) {
				console.error('❌ Session middleware error:', error);
			}
		}

		next();
	};
};

// Activity tracking middleware
export const activityTrackingMiddleware = () => {
	return async (req, res, next) => {
		const userId = req.user?.id || req.headers['x-user-id'];

		if (userId) {
			try {
				const action = {
					method: req.method,
					path: req.path,
					timestamp: new Date().toISOString(),
					userAgent: req.headers['user-agent'],
				};

				await redisService.trackUserActivity(userId, action);
			} catch (error) {
				console.error('❌ Activity tracking error:', error);
			}
		}

		next();
	};
};
