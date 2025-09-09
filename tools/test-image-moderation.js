import fs from 'fs';
import path from 'path';
import {
	moderateImage,
	validateRekognitionConfig,
} from '../apps/api/services/imageModerationService.js';

/**
 * Test image moderation functionality
 */
async function testImageModeration() {
	console.log('🧪 Testing Image Moderation...\n');

	// Check configuration
	console.log('1. Checking Rekognition configuration...');
	const configStatus = validateRekognitionConfig();

	if (!configStatus.isValid) {
		console.log('❌ Configuration invalid:', configStatus.message);
		console.log('Missing variables:', configStatus.missingVars);
		return;
	}

	console.log('✅ Configuration is valid\n');

	// Test with a sample image (if available)
	const testImagePath = path.join(
		process.cwd(),
		'public',
		'images',
		'worker.png',
	);

	if (!fs.existsSync(testImagePath)) {
		console.log('⚠️ No test image found at:', testImagePath);
		console.log('Please add a test image to test moderation functionality');
		return;
	}

	console.log('2. Testing moderation with sample image...');

	try {
		const imageBuffer = fs.readFileSync(testImagePath);
		const result = await moderateImage(imageBuffer);

		console.log('✅ Moderation completed');
		console.log('Result:', JSON.stringify(result, null, 2));

		if (result.isApproved) {
			console.log('✅ Image approved');
		} else {
			console.log('❌ Image rejected');
			console.log('Detected issues:', result.detectedIssues);
		}
	} catch (error) {
		console.error('❌ Moderation test failed:', error.message);
	}
}

// Run the test
testImageModeration().catch(console.error);
