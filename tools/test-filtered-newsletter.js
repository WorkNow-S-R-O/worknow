import { PrismaClient } from '@prisma/client';
import {
	checkAndSendFilteredNewsletter,
	sendFilteredCandidatesToSubscribers,
} from '../apps/api/services/newsletterService.js';

const prisma = new PrismaClient();

async function testFilteredNewsletter() {
	try {
		console.log('🧪 Testing filtered newsletter functionality...');

		// Test 1: Check current candidate count
		const candidateCount = await prisma.seeker.count({
			where: { isActive: true },
		});
		console.log(`📊 Current active candidates: ${candidateCount}`);

		// Test 2: Get subscribers with their preferences
		const subscribers = await prisma.newsletterSubscriber.findMany({
			where: { isActive: true },
		});

		console.log(`📧 Found ${subscribers.length} active subscribers:`);
		subscribers.forEach((sub) => {
			console.log(`  - ${sub.email}:`);
			console.log(`    Cities: ${sub.preferredCities?.join(', ') || 'None'}`);
			console.log(
				`    Categories: ${sub.preferredCategories?.join(', ') || 'None'}`,
			);
			console.log(
				`    Employment: ${sub.preferredEmployment?.join(', ') || 'None'}`,
			);
			console.log(
				`    Languages: ${sub.preferredLanguages?.join(', ') || 'None'}`,
			);
			console.log(`    Gender: ${sub.preferredGender || 'None'}`);
			console.log(
				`    Documents: ${sub.preferredDocumentTypes?.join(', ') || 'None'}`,
			);
			console.log(`    Only Demanded: ${sub.onlyDemanded}`);
		});

		// Test 3: Test filtered newsletter sending
		console.log('\n📧 Testing sendFilteredCandidatesToSubscribers...');
		await sendFilteredCandidatesToSubscribers();
		console.log('✅ sendFilteredCandidatesToSubscribers test completed');

		// Test 4: Test trigger check
		console.log('\n📧 Testing checkAndSendFilteredNewsletter...');
		await checkAndSendFilteredNewsletter();
		console.log('✅ checkAndSendFilteredNewsletter test completed');

		console.log('\n🎉 All filtered newsletter tests completed!');
	} catch (error) {
		console.error('❌ Filtered newsletter test failed:', error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	testFilteredNewsletter();
}

export { testFilteredNewsletter };
