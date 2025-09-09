#!/usr/bin/env node

/**
 * Test script for the new candidate notification system
 * This script tests:
 * 1. Sending initial candidates to new subscribers (only once)
 * 2. Triggering notifications every third candidate added
 */

import { PrismaClient } from '@prisma/client';
import {
	sendInitialCandidatesToNewSubscriber,
	checkAndSendNewCandidatesNotification,
} from '../apps/api/services/candidateNotificationService.js';

const prisma = new PrismaClient();

async function testCandidateNotifications() {
	try {
		console.log('🧪 Testing candidate notification system...\n');

		// Test 1: Get current candidate count
		const currentCandidateCount = await prisma.seeker.count({
			where: { isActive: true },
		});
		console.log(`📊 Current active candidates: ${currentCandidateCount}`);

		// Test 2: Check if we should trigger notifications
		console.log('\n🔍 Testing notification trigger logic...');
		await checkAndSendNewCandidatesNotification();

		// Test 3: Get a test subscriber (first active subscriber)
		const testSubscriber = await prisma.newsletterSubscriber.findFirst({
			where: { isActive: true },
		});

		if (testSubscriber) {
			console.log(`\n👤 Test subscriber found: ${testSubscriber.email}`);

			// Test 4: Test sending initial candidates (this would normally only happen once)
			console.log('\n📧 Testing initial candidates email (simulation)...');
			try {
				await sendInitialCandidatesToNewSubscriber(testSubscriber);
				console.log('✅ Initial candidates email test completed');
			} catch (error) {
				console.error(
					'❌ Error testing initial candidates email:',
					error.message,
				);
			}
		} else {
			console.log('\n⚠️  No active subscribers found for testing');
		}

		// Test 5: Show notification schedule
		console.log('\n📅 Notification Schedule:');
		console.log(`   - Current candidates: ${currentCandidateCount}`);
		console.log(
			`   - Next notification at: ${Math.ceil((currentCandidateCount + 1) / 3) * 3} candidates`,
		);
		console.log(
			`   - Candidates until next notification: ${3 - (currentCandidateCount % 3)}`,
		);

		console.log('\n✅ Candidate notification system test completed');
	} catch (error) {
		console.error('❌ Test failed:', error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the test
testCandidateNotifications().catch(console.error);
