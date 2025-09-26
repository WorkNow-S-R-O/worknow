/**
 * Image Moderation Configuration
 *
 * This file contains configurable settings for the image moderation system.
 * The system is now focused on job advertisements and only blocks the most serious violations.
 */

export const IMAGE_MODERATION_CONFIG = {
	// Moderation mode - now simplified to job-focused
	MODE: 'job-focused',

	// Confidence threshold - only block very clear violations
	CONFIDENCE_THRESHOLD: 90,

	// Content that will ALWAYS be blocked (critical violations)
	ALWAYS_BLOCK: [
		'Explicit Nudity', // Clear pornographic content
		'Violence', // Clear violent content
		'Hate Symbols', // Hate speech symbols
	],

	// Content that will be MONITORED but NOT blocked
	MONITOR_ONLY: [
		'Drugs', // Recreational drug content
		'Gambling', // Casino, betting content
		'Tobacco', // Smoking, cigarettes
		'Alcohol', // Drinking, alcoholic beverages
		'Adult Content', // Suggestive but not explicit content
		'Weapons', // Tools, kitchen items, construction equipment
		'Knife', // Kitchen knives, work tools
		'Tool', // Construction tools, work equipment
		'Hammer', // Construction tools
		'Scissors', // Office supplies, work tools
		'Gun', // Firearms (only blocked if clearly violent)
		'Violence', // Violence (only blocked if explicit)
	],

	// Fallback behavior when moderation fails
	FAILURE_BEHAVIOR: {
		allowImage: true, // Trust user if moderation fails
		logFailure: true, // Log the failure for monitoring
		notifyAdmin: false, // Whether to notify administrators
	},

	// Logging configuration
	LOGGING: {
		logApprovedImages: false, // Whether to log approved images
		logRejectedImages: true, // Whether to log rejected images
		logModerationFailures: true, // Whether to log moderation failures
		includeConfidenceScores: true, // Whether to include confidence scores in logs
	},
};

/**
 * Get moderation configuration
 * @returns {Object} Current moderation settings
 */
export const getModerationConfig = () => {
	return {
		mode: IMAGE_MODERATION_CONFIG.MODE,
		confidenceThreshold: IMAGE_MODERATION_CONFIG.CONFIDENCE_THRESHOLD,
		alwaysBlock: IMAGE_MODERATION_CONFIG.ALWAYS_BLOCK,
		monitorOnly: IMAGE_MODERATION_CONFIG.MONITOR_ONLY,
		failureBehavior: IMAGE_MODERATION_CONFIG.FAILURE_BEHAVIOR,
		logging: IMAGE_MODERATION_CONFIG.LOGGING,
	};
};

export default IMAGE_MODERATION_CONFIG;
