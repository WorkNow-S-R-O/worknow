import redisService from '../services/redisService.js';

export const cacheMiddleware = (ttl = 300) => {
	return async (req, res, next) => {
		if (req.method !== 'GET') {
			return next();
		}

		const cacheKey = `api:${req.originalUrl}`;

		try {
			const cachedResponse = await redisService.get(cacheKey);

			if (cachedResponse) {
				return res.json(cachedResponse);
			}

			const originalSend = res.json;
			res.json = function (data) {
				redisService.set(cacheKey, data, ttl);
				return originalSend.call(this, data);
			};

			next();
		} catch (error) {
			console.error('❌ Cache middleware error:', error);
			next();
		}
	};
};

export const rateLimitMiddleware = (limit = 100, window = 3600) => {
	return async (req, res, next) => {
		const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';

		try {
			const rateLimit = await redisService.checkRateLimit(
				identifier,
				limit,
				window,
			);

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
			next();
		}
	};
};

export const sessionMiddleware = () => {
	return async (req, res, next) => {
		const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

		if (sessionId) {
			try {
				const session = await redisService.getSession(sessionId);
				if (session) {
					req.session = session;
				}
			} catch (error) {
				console.error('❌ Session middleware error:', error);
			}
		}

		next();
	};
};

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
