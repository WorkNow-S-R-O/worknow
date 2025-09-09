#!/usr/bin/env node

/**
 * Test script for the simplified image moderation system
 * This system only blocks porn and violent content, allowing normal job ads to upload freely.
 */

import {
	moderateImage,
	validateRekognitionConfig,
} from '../apps/api/services/imageModerationService.js';
import { getModerationConfig } from '../config/imageModeration.config.js';

// Create a test image buffer (this would normally come from a real image)
const createTestImageBuffer = () => {
	// This is a mock buffer for testing - in real usage, you'd have actual image data
	return Buffer.from('fake-image-data-for-testing');
};

async function testSimplifiedModeration() {
	try {
		console.log('🧪 Testing Simplified Image Moderation System\n');

		// Test 1: Show current configuration
		console.log('📋 Current Moderation Configuration:');
		const currentConfig = getModerationConfig();
		console.log(`   Mode: ${currentConfig.mode}`);
		console.log(
			`   Confidence Threshold: ${currentConfig.confidenceThreshold}%`,
		);
		console.log(`   Always Block: ${currentConfig.alwaysBlock.join(', ')}`);
		console.log(
			`   Monitor Only: ${currentConfig.monitorOnly.slice(0, 5).join(', ')}... (${currentConfig.monitorOnly.length} total)\n`,
		);

		// Test 2: Show what gets blocked vs monitored
		console.log('🚫 Content Blocking Policy:');
		console.log('   ALWAYS BLOCKED (Critical violations):');
		currentConfig.alwaysBlock.forEach((item) => {
			console.log(`     ❌ ${item}`);
		});

		console.log('\n   MONITORED ONLY (Never blocked):');
		currentConfig.monitorOnly.slice(0, 10).forEach((item) => {
			console.log(`     📝 ${item}`);
		});
		if (currentConfig.monitorOnly.length > 10) {
			console.log(
				`     ... and ${currentConfig.monitorOnly.length - 10} more items`,
			);
		}

		// Test 3: Test moderation with a sample image
		console.log('\n📸 Testing Moderation System:\n');

		const testImageBuffer = createTestImageBuffer();

		try {
			const result = await moderateImage(testImageBuffer);

			console.log(
				`   Status: ${result.isApproved ? '✅ APPROVED' : '❌ REJECTED'}`,
			);
			console.log(`   Confidence: ${result.confidence}%`);

			if (result.detectedIssues.criticalViolations.length > 0) {
				console.log(
					`   Critical Violations: ${result.detectedIssues.criticalViolations.map((v) => `${v.name} (${v.confidence}%)`).join(', ')}`,
				);
			}

			if (result.moderationFailed) {
				console.log('   ⚠️ Moderation failed, image allowed (trusting user)');
			}

			console.log('');
		} catch (error) {
			console.error('   ❌ Error testing moderation:', error.message);
		}

		// Test 4: Show configuration summary
		console.log('⚙️ Configuration Summary:');
		console.log(
			'   This system is designed for job advertisements and work-related content.',
		);
		console.log(
			'   Only blocks: Porn, Violence, Hate Symbols (with 90%+ confidence)',
		);
		console.log(
			'   Allows: Tools, kitchen items, construction equipment, alcohol, tobacco, etc.',
		);
		console.log('   Fallback: Trusts users if moderation fails\n');

		// Test 5: Show examples of what gets allowed
		console.log('✅ Examples of Content That Gets Allowed:');
		console.log('   🏗️  Construction tools (hammers, drills, saws)');
		console.log('   🍳 Kitchen equipment (knives, scissors, utensils)');
		console.log('   🚗 Work vehicles and machinery');
		console.log('   🏢 Office supplies and equipment');
		console.log('   🍺 Alcohol and tobacco (for restaurant/bar jobs)');
		console.log('   🎰 Gambling content (for casino jobs)');
		console.log('   💊 Medical/scientific equipment');
		console.log('   🔧 Any work-related tools and equipment\n');

		// Test 6: Show examples of what gets blocked
		console.log('❌ Examples of Content That Gets Blocked:');
		console.log('   🚫 Explicit pornographic content');
		console.log(
			'   🚫 Clear violent content (fighting, weapons in violent context)',
		);
		console.log('   🚫 Hate speech symbols and content');
		console.log(
			'   Note: Only blocked with 90%+ confidence to avoid false positives\n',
		);

		console.log('✅ Simplified moderation system test completed');
	} catch (error) {
		console.error('❌ Test failed:', error);
	}
}

// Run the test
testSimplifiedModeration().catch(console.error);
