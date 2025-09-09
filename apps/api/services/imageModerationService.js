import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS Rekognition (use supported region for Rekognition)
const rekognition = new AWS.Rekognition({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REKOGNITION_REGION || 'us-east-1', // Rekognition is available in us-east-1, us-west-2, eu-west-1
});

/**
 * Moderate image content using AWS Rekognition
 * @param {Buffer} imageBuffer - The image buffer to moderate
 * @returns {Promise<Object>} Moderation result with status and details
 */
export const moderateImage = async (imageBuffer) => {
	try {
		// Starting content moderation

		// Prepare parameters for Rekognition
		const params = {
			Image: {
				Bytes: imageBuffer,
			},
			MinConfidence: 95, // Very high confidence threshold for very strict moderation
		};

		// Analyzing image content

		// Detect inappropriate content
		const [moderationResult, labelResult] = await Promise.all([
			rekognition.detectModerationLabels(params).promise(),
			rekognition.detectLabels(params).promise(),
		]);

		// Analysis completed

		// Check for inappropriate content - only the most serious violations
		const inappropriateLabels = ['Explicit Nudity', 'Violence', 'Hate Symbols'];

		const detectedInappropriate =
			moderationResult.ModerationLabels?.filter(
				(label) =>
					inappropriateLabels.includes(label.Name) && label.Confidence >= 95,
			) || [];

		// Additional checks for specific content types
		const detectedLabels = labelResult.Labels?.map((label) => label.Name) || [];

		// Check for potentially inappropriate labels - only the most serious
		const potentiallyInappropriate = [
			'Weapon',
			'Gun',
			'Knife',
			'Adult',
			'Nude',
		];

		const detectedPotentiallyInappropriate = detectedLabels.filter((label) =>
			potentiallyInappropriate.some((inappropriate) =>
				label.toLowerCase().includes(inappropriate.toLowerCase()),
			),
		);

		const isInappropriate =
			detectedInappropriate.length > 0 ||
			detectedPotentiallyInappropriate.length > 0;

		const result = {
			isApproved: !isInappropriate,
			confidence: Math.max(
				...detectedInappropriate.map((label) => label.Confidence),
				...detectedPotentiallyInappropriate.map(() => 98), // Very high confidence for potential issues
				0,
			),
			detectedIssues: {
				moderationLabels: detectedInappropriate,
				potentiallyInappropriateLabels: detectedPotentiallyInappropriate,
			},
			analysis: {
				moderationLabels: moderationResult.ModerationLabels || [],
				detectedLabels: detectedLabels,
				moderationConfidence:
					detectedInappropriate.length > 0
						? Math.max(
								...detectedInappropriate.map((label) => label.Confidence),
							)
						: 0,
			},
		};

		if (isInappropriate) {
			// Content rejected due to inappropriate content
		} else {
			// Content approved
		}

		return result;
	} catch (error) {
		console.error('❌ Image Moderation - Error during moderation:', error);

		// If moderation fails, we can either:
		// 1. Reject the image (safer approach)
		// 2. Allow the image (less restrictive)
		// For now, we'll reject if moderation fails
		return {
			isApproved: false,
			confidence: 0,
			error: error.message,
			detectedIssues: {
				moderationLabels: [],
				potentiallyInappropriateLabels: [],
			},
			analysis: {
				moderationLabels: [],
				detectedLabels: [],
				moderationConfidence: 0,
			},
		};
	}
};

/**
 * Validate Rekognition configuration
 * @returns {Object} Configuration status
 */
export const validateRekognitionConfig = () => {
	const requiredEnvVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];

	const missingVars = requiredEnvVars.filter(
		(varName) => !process.env[varName],
	);

	if (missingVars.length > 0) {
		console.error('❌ Missing Rekognition environment variables:', missingVars);
		return {
			isValid: false,
			missingVars,
			message: `Missing Rekognition environment variables: ${missingVars.join(', ')}`,
		};
	}

	// Check if Rekognition region is supported
	const rekognitionRegion = process.env.AWS_REKOGNITION_REGION || 'us-east-1';
	const supportedRegions = [
		'us-east-1',
		'us-west-2',
		'eu-west-1',
		'ap-southeast-2',
	];

	if (!supportedRegions.includes(rekognitionRegion)) {
		console.error('❌ Rekognition not available in region:', rekognitionRegion);
		console.error('💡 Supported regions:', supportedRegions.join(', '));
		return {
			isValid: false,
			missingVars: [],
			message: `Rekognition not available in region: ${rekognitionRegion}. Supported regions: ${supportedRegions.join(', ')}`,
		};
	}

	return {
		isValid: true,
		missingVars: [],
		message: 'Rekognition configuration is valid',
	};
};

export default {
	moderateImage,
	validateRekognitionConfig,
};
