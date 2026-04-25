import OpenAI from 'openai';
import prisma from '../lib/prisma.js';



// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
	requestsPerMinute: 3, // Very conservative limit
	delayBetweenRequests: 20000, // 20 seconds between requests
	maxRetries: 3, // Reduced from 6 to 3
	initialDelay: 5000, // Start with 5 seconds
	exponentialBase: 2,
	jitter: true,
};

// Simple rate limiter
class RateLimiter {
	constructor(maxRequestsPerMinute) {
		this.maxRequestsPerMinute = maxRequestsPerMinute;
		this.requests = [];
	}

	async waitForSlot() {
		const now = Date.now();
		const oneMinuteAgo = now - 60000;

		// Remove old requests
		this.requests = this.requests.filter((time) => time > oneMinuteAgo);

		// If we've made too many requests recently, wait
		if (this.requests.length >= this.maxRequestsPerMinute) {
			const oldestRequest = this.requests[0];
			const waitTime = 60000 - (now - oldestRequest);
			console.log(
				`⏳ Rate limiter: Waiting ${Math.round(waitTime)}ms for next slot...`,
			);
			await new Promise((resolve) => setTimeout(resolve, waitTime));
		}

		// Add current request
		this.requests.push(now);
	}
}

// Global rate limiter instance
const rateLimiter = new RateLimiter(RATE_LIMIT_CONFIG.requestsPerMinute);

/**
 * Check if error is a quota/billing error
 * @param {Error} error - The error to check
 * @returns {boolean} True if it's a quota/billing error
 */
function isQuotaError(error) {
	const quotaKeywords = [
		'quota',
		'billing',
		'payment',
		'credit',
		'exceeded',
		'insufficient',
		'account',
		'plan',
		'subscription',
		'payment method',
	];

	const errorMessage = error.message?.toLowerCase() || '';
	return quotaKeywords.some((keyword) => errorMessage.includes(keyword));
}

/**
 * Check if error is a rate limit error
 * @param {Error} error - The error to check
 * @returns {boolean} True if it's a rate limit error
 */
function isRateLimitError(error) {
	const rateLimitKeywords = [
		'429',
		'rate limit',
		'too many requests',
		'throttle',
	];

	const errorMessage = error.message?.toLowerCase() || '';
	return rateLimitKeywords.some((keyword) => errorMessage.includes(keyword));
}

/**
 * Retry decorator with exponential backoff for rate limit handling
 * @param {Function} func - Function to retry
 * @param {Object} options - Retry options
 * @returns {Function} Wrapped function with retry logic
 */
function retryWithExponentialBackoff(
	func,
	{
		initialDelay = RATE_LIMIT_CONFIG.initialDelay,
		exponentialBase = RATE_LIMIT_CONFIG.exponentialBase,
		jitter = RATE_LIMIT_CONFIG.jitter,
		maxRetries = RATE_LIMIT_CONFIG.maxRetries,
		errors = [Error],
	} = {},
) {
	return async function (...args) {
		let numRetries = 0;
		let delay = initialDelay;

		while (true) {
			try {
				// Wait for rate limiter slot
				await rateLimiter.waitForSlot();

				return await func.apply(this, args);
			} catch (error) {
				// Check if this is a quota error - don't retry these
				if (isQuotaError(error)) {
					console.log('❌ Quota/billing error detected - not retrying');
					throw new Error(`OpenAI quota exceeded: ${error.message}`);
				}

				// Check if this is a rate limit error
				const isRateLimit = isRateLimitError(error);

				// Only retry on rate limit errors or specified errors
				if (
					!isRateLimit &&
					!errors.some((ErrorClass) => error instanceof ErrorClass)
				) {
					throw error;
				}

				numRetries += 1;

				// Check if max retries has been reached
				if (numRetries > maxRetries) {
					console.error(
						`❌ Maximum number of retries (${maxRetries}) exceeded for rate limit.`,
					);
					throw new Error(
						`Rate limit exceeded after ${maxRetries} retries. Please try again later.`,
					);
				}

				// Calculate delay with exponential backoff and optional jitter
				delay *= exponentialBase * (1 + jitter * Math.random());

				console.log(
					`⏳ Rate limit hit. Retrying in ${Math.round(delay)}ms (attempt ${numRetries}/${maxRetries})...`,
				);

				// Sleep for the delay
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	};
}

/**
 * AI-Powered Job Title Generation Service
 * Uses OpenAI to analyze job descriptions and generate accurate, professional titles
 * Includes proper rate limit handling with exponential backoff
 */
class AIJobTitleService {
	/**
	 * Generate job title using AI analysis with rate limit handling
	 * @param {string} description - Job description
	 * @param {Object} context - Additional context (city, salary, etc.)
	 * @returns {Promise<Object>} Generated title with confidence and analysis
	 */
	static async generateAITitle(description, context = {}) {
		try {
			if (!process.env.OPENAI_API_KEY) {
				console.warn('⚠️ OpenAI API key not found. Using fallback method.');
				return this.fallbackTitleGeneration(description);
			}

			// Use the retry wrapper for the actual API call
			const generateTitleWithRetry = retryWithExponentialBackoff(
				this._makeOpenAIRequest.bind(this),
				{
					initialDelay: RATE_LIMIT_CONFIG.initialDelay,
					exponentialBase: RATE_LIMIT_CONFIG.exponentialBase,
					jitter: RATE_LIMIT_CONFIG.jitter,
					maxRetries: RATE_LIMIT_CONFIG.maxRetries,
					errors: [Error],
				},
			);

			const result = await generateTitleWithRetry(description, context);
			return result;
		} catch (error) {
			console.error('❌ AI title generation failed:', error.message);

			// Check if it's a quota error
			if (isQuotaError(error)) {
				console.log('💡 Using fallback due to quota/billing issues');
			} else if (isRateLimitError(error)) {
				console.log('💡 Using fallback due to rate limits');
			} else {
				console.log('💡 Using fallback due to other errors');
			}

			return this.fallbackTitleGeneration(description);
		}
	}

	/**
	 * Make the actual OpenAI API request (separated for retry logic)
	 * @param {string} description - Job description
	 * @param {Object} context - Additional context
	 * @returns {Promise<Object>} Generated title data
	 */
	static async _makeOpenAIRequest(description, context = {}) {
		const prompt = this.buildPrompt(description, context);

		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: `You are an expert job title generator for the Israeli job market. 
                    Your task is to analyze job descriptions and generate concise, professional job titles in Russian.
                    
                    Requirements:
                    - Generate titles in Russian language
                    - Keep titles short and professional (max 5-7 words)
                    - Use specific job titles, not generic ones
                    - Consider the job location, requirements, and industry
                    - Avoid including salary, contact info, or extra details in the title
                    
                    Common job categories in Israel:
                    - Уборщик (Cleaner)
                    - Повар (Cook)
                    - Официант (Waiter)
                    - Грузчик (Loader)
                    - Водитель (Driver)
                    - Продавец-консультант (Sales Consultant)
                    - Кассир (Cashier)
                    - Строитель (Construction Worker)
                    - Электрик (Electrician)
                    - Сантехник (Plumber)
                    - Маляр (Painter)
                    - Курьер (Courier)
                    - Программист (Programmer)
                    - Сиделка (Caregiver)
                    - Няня (Nanny)
                    - Охранник (Security Guard)
                    - Парикмахер (Hairdresser)
                    - Массажист (Masseur)
                    
                    Return only the job title, nothing else.`,
				},
				{
					role: 'user',
					content: prompt,
				},
			],
			max_tokens: 50,
			temperature: 0.3,
		});

		const generatedTitle = completion.choices[0]?.message?.content?.trim();

		if (!generatedTitle) {
			throw new Error('No title generated by AI');
		}

		return {
			title: generatedTitle,
			confidence: this.calculateAIConfidence(generatedTitle, description),
			method: 'ai',
			analysis: {
				hasSpecificKeywords: this.hasSpecificKeywords(description),
				hasLocation: this.hasLocation(description),
				hasSalary: this.hasSalary(description),
				hasLanguageRequirement: this.hasLanguageRequirement(description),
				hasExperienceRequirement: this.hasExperienceRequirement(description),
			},
		};
	}

	/**
	 * Build AI prompt for job title generation
	 * @param {string} description - Job description
	 * @param {Object} context - Additional context
	 * @returns {string} Formatted prompt
	 */
	static buildPrompt(description, context = {}) {
		let prompt = `Analyze this job description and generate a professional job title in Russian:\n\n`;
		prompt += `Job Description: ${description}\n\n`;

		if (context.city) {
			prompt += `Location: ${context.city}\n`;
		}
		if (context.salary) {
			prompt += `Salary: ${context.salary} шек/час\n`;
		}
		if (context.requirements) {
			prompt += `Requirements: ${context.requirements}\n`;
		}

		prompt += `\nGenerate a concise, professional job title in Russian:`;

		return prompt;
	}

	/**
	 * Fallback title generation when AI is not available
	 * @param {string} description - Job description
	 * @returns {Object} Generated title with fallback method
	 */
	static fallbackTitleGeneration(description) {
		const lowerDescription = description.toLowerCase();

		// Simple keyword-based title generation
		let title = 'Общая вакансия';

		if (
			lowerDescription.includes('повар') ||
			lowerDescription.includes('кухня')
		) {
			title = 'Повар';
		} else if (
			lowerDescription.includes('уборщик') ||
			lowerDescription.includes('уборка')
		) {
			title = 'Уборщик';
		} else if (
			lowerDescription.includes('официант') ||
			lowerDescription.includes('ресторан')
		) {
			title = 'Официант';
		} else if (
			lowerDescription.includes('грузчик') ||
			lowerDescription.includes('склад')
		) {
			title = 'Грузчик';
		} else if (
			lowerDescription.includes('водитель') ||
			lowerDescription.includes('доставка')
		) {
			title = 'Водитель';
		} else if (
			lowerDescription.includes('продавец') ||
			lowerDescription.includes('магазин')
		) {
			title = 'Продавец-консультант';
		} else if (
			lowerDescription.includes('кассир') ||
			lowerDescription.includes('касса')
		) {
			title = 'Кассир';
		} else if (
			lowerDescription.includes('строитель') ||
			lowerDescription.includes('строительство')
		) {
			title = 'Строитель';
		} else if (lowerDescription.includes('электрик')) {
			title = 'Электрик';
		} else if (lowerDescription.includes('сантехник')) {
			title = 'Сантехник';
		} else if (lowerDescription.includes('маляр')) {
			title = 'Маляр';
		} else if (lowerDescription.includes('курьер')) {
			title = 'Курьер';
		} else if (lowerDescription.includes('программист')) {
			title = 'Программист';
		} else if (lowerDescription.includes('сиделка')) {
			title = 'Сиделка';
		} else if (lowerDescription.includes('няня')) {
			title = 'Няня';
		} else if (lowerDescription.includes('охранник')) {
			title = 'Охранник';
		} else if (lowerDescription.includes('парикмахер')) {
			title = 'Парикмахер';
		} else if (lowerDescription.includes('массажист')) {
			title = 'Массажист';
		}

		return {
			title: title,
			confidence: 0.6, // Lower confidence for rule-based method
			method: 'rule-based',
			analysis: {
				hasSpecificKeywords: this.hasSpecificKeywords(description),
				hasLocation: this.hasLocation(description),
				hasSalary: this.hasSalary(description),
				hasLanguageRequirement: this.hasLanguageRequirement(description),
				hasExperienceRequirement: this.hasExperienceRequirement(description),
			},
		};
	}

	/**
	 * Calculate confidence score for AI-generated title
	 * @param {string} title - Generated title
	 * @param {string} description - Original description
	 * @returns {number} Confidence score (0-1)
	 */
	static calculateAIConfidence(title, description) {
		if (!title || !description) return 0;

		const lowerTitle = title.toLowerCase();
		const lowerDescription = description.toLowerCase();

		// Check if title keywords appear in description
		const titleWords = lowerTitle.split(' ').filter((word) => word.length > 2);
		const matchingWords = titleWords.filter((word) =>
			lowerDescription.includes(word),
		);

		// Calculate basic confidence
		let confidence = matchingWords.length / Math.max(titleWords.length, 1);

		// Boost confidence for AI-generated titles
		confidence += 0.2;

		// Reduce confidence for generic titles
		if (lowerTitle.includes('общая') || lowerTitle.includes('работник')) {
			confidence -= 0.3;
		}

		return Math.min(Math.max(confidence, 0), 1);
	}

	/**
	 * Batch generate titles for multiple jobs with rate limit handling
	 * @param {Array} jobs - Array of job objects
	 * @returns {Promise<Array>} Array of jobs with AI-generated titles
	 */
	static async batchGenerateAITitles(jobs) {
		console.log(
			`🤖 Starting AI-powered title generation for ${jobs.length} jobs...`,
		);
		console.log(
			`📊 Rate limit config: ${RATE_LIMIT_CONFIG.requestsPerMinute} requests per minute`,
		);

		const results = [];
		let successCount = 0;
		let errorCount = 0;
		let rateLimitCount = 0;
		let quotaCount = 0;

		for (const job of jobs) {
			try {
				const context = {
					city: job.city?.name,
					salary: job.salary,
					requirements: this.extractRequirements(job.description),
				};

				const titleData = await this.generateAITitle(job.description, context);

				results.push({
					...job,
					title: titleData.title,
					titleConfidence: titleData.confidence,
					titleMethod: titleData.method,
					titleAnalysis: titleData.analysis,
				});

				successCount++;

				// Log progress every 5 jobs (reduced from 10)
				if (successCount % 5 === 0) {
					console.log(`✅ Processed ${successCount}/${jobs.length} jobs`);
				}

				// Add longer delay between requests to avoid hitting rate limits
				await new Promise((resolve) =>
					setTimeout(resolve, RATE_LIMIT_CONFIG.delayBetweenRequests),
				);
			} catch (error) {
				console.error(
					`❌ Failed to generate title for job ${job.id}:`,
					error.message,
				);
				errorCount++;

				if (isQuotaError(error)) {
					quotaCount++;
				} else if (isRateLimitError(error)) {
					rateLimitCount++;
				}

				// Use fallback for failed jobs
				const fallbackData = this.fallbackTitleGeneration(job.description);
				results.push({
					...job,
					title: fallbackData.title,
					titleConfidence: fallbackData.confidence,
					titleMethod: 'fallback',
					titleAnalysis: fallbackData.analysis,
				});
			}
		}

		console.log(`\n📊 AI Title Generation Summary:`);
		console.log(`   Total jobs: ${jobs.length}`);
		console.log(`   Successfully processed: ${successCount}`);
		console.log(`   Quota errors: ${quotaCount}`);
		console.log(`   Rate limit errors: ${rateLimitCount}`);
		console.log(
			`   Other errors (using fallback): ${errorCount - quotaCount - rateLimitCount}`,
		);

		return results;
	}

	/**
	 * Extract requirements from job description
	 * @param {string} description - Job description
	 * @returns {string} Extracted requirements
	 */
	static extractRequirements(description) {
		const requirementPatterns = [
			/требуется\s+(.+?)(?=\n|$)/i,
			/требования?\s*:\s*(.+?)(?=\n|$)/i,
			/обязательно\s+(.+?)(?=\n|$)/i,
		];

		for (const pattern of requirementPatterns) {
			const match = description.match(pattern);
			if (match) {
				return match[1].trim();
			}
		}

		return '';
	}

	/**
	 * Check if description has specific job keywords
	 * @param {string} description - Job description
	 * @returns {boolean}
	 */
	static hasSpecificKeywords(description) {
		const specificKeywords = [
			'повар',
			'официант',
			'грузчик',
			'водитель',
			'продавец',
			'кассир',
			'уборщик',
			'строитель',
			'электрик',
			'сантехник',
			'маляр',
			'курьер',
			'программист',
			'сиделка',
			'няня',
		];

		return specificKeywords.some((keyword) =>
			description.toLowerCase().includes(keyword),
		);
	}

	/**
	 * Check if description mentions a location
	 * @param {string} description - Job description
	 * @returns {boolean}
	 */
	static hasLocation(description) {
		const locationPatterns = [
			/в\s+([а-яё]+(?:\s+[а-яё]+)*)/i,
			/на\s+([а-яё]+(?:\s+[а-яё]+)*)/i,
		];

		return locationPatterns.some((pattern) => pattern.test(description));
	}

	/**
	 * Check if description mentions salary
	 * @param {string} description - Job description
	 * @returns {boolean}
	 */
	static hasSalary(description) {
		const salaryPattern = /(\d+)\s*(?:шек|₪|ILS)/i;
		return salaryPattern.test(description);
	}

	/**
	 * Check if description has language requirements
	 * @param {string} description - Job description
	 * @returns {boolean}
	 */
	static hasLanguageRequirement(description) {
		const languageKeywords = [
			'иврит',
			'ивритом',
			'английский',
			'английским',
			'русский',
			'русским',
		];
		return languageKeywords.some((keyword) =>
			description.toLowerCase().includes(keyword),
		);
	}

	/**
	 * Check if description mentions experience requirements
	 * @param {string} description - Job description
	 * @returns {boolean}
	 */
	static hasExperienceRequirement(description) {
		const experienceKeywords = ['опыт', 'опытный', 'опыт работы'];
		return experienceKeywords.some((keyword) =>
			description.toLowerCase().includes(keyword),
		);
	}

	/**
	 * Update existing jobs in database with AI-generated titles
	 * @returns {Promise<Object>} Update statistics
	 */
	static async updateDatabaseWithAITitles() {
		console.log('🤖 Updating database with AI-generated titles...\n');
		console.log(
			`📊 Rate limit config: ${RATE_LIMIT_CONFIG.requestsPerMinute} requests per minute`,
		);

		try {
			const jobs = await prisma.job.findMany({
				include: {
					city: true,
					category: true,
				},
			});

			console.log(`📊 Found ${jobs.length} jobs to update\n`);

			let updatedCount = 0;
			let skippedCount = 0;
			let errorCount = 0;
			let rateLimitCount = 0;
			let quotaCount = 0;

			for (const job of jobs) {
				try {
					const context = {
						city: job.city?.name,
						salary: job.salary,
						requirements: this.extractRequirements(job.description),
					};

					const titleData = await this.generateAITitle(
						job.description,
						context,
					);

					// Only update if the new title is better
					if (titleData.confidence > 0.7 && titleData.title !== job.title) {
						await prisma.job.update({
							where: { id: job.id },
							data: { title: titleData.title },
						});

						console.log(
							`✅ Updated: "${job.title}" → "${titleData.title}" (${titleData.method})`,
						);
						updatedCount++;
					} else {
						console.log(
							`⏭️  Skipping "${job.title}" - confidence: ${titleData.confidence.toFixed(2)}`,
						);
						skippedCount++;
					}

					// Add longer delay to avoid rate limiting
					await new Promise((resolve) =>
						setTimeout(resolve, RATE_LIMIT_CONFIG.delayBetweenRequests),
					);
				} catch (error) {
					console.error(`❌ Failed to update job ${job.id}:`, error.message);
					errorCount++;

					if (isQuotaError(error)) {
						quotaCount++;
					} else if (isRateLimitError(error)) {
						rateLimitCount++;
					}
				}
			}

			console.log(`\n📈 AI Update Summary:`);
			console.log(`   Total jobs processed: ${jobs.length}`);
			console.log(`   Jobs updated: ${updatedCount}`);
			console.log(`   Jobs skipped: ${skippedCount}`);
			console.log(`   Quota errors: ${quotaCount}`);
			console.log(`   Rate limit errors: ${rateLimitCount}`);
			console.log(
				`   Other errors: ${errorCount - quotaCount - rateLimitCount}`,
			);

			return {
				total: jobs.length,
				updated: updatedCount,
				skipped: skippedCount,
				quotaErrors: quotaCount,
				rateLimitErrors: rateLimitCount,
				otherErrors: errorCount - quotaCount - rateLimitCount,
			};
		} catch (error) {
			console.error('❌ Error updating database with AI titles:', error);
			throw error;
		}
	}
}

export default AIJobTitleService;
