import { PrismaClient } from '@prisma/client';
import { sendCandidatesToNewSubscriber, sendCandidatesToSubscribers } from '../services/newsletterService.js';

const prisma = new PrismaClient();

async function testNewsletterFunctionality() {
  try {
    console.log('🧪 Testing newsletter functionality...');

    // Test 1: Get a subscriber
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true },
      take: 1
    });

    if (subscribers.length === 0) {
      console.log('❌ No active subscribers found. Please create a subscriber first.');
      return;
    }

    const testSubscriber = subscribers[0];
    console.log(`✅ Found test subscriber: ${testSubscriber.email}`);

    // Test 2: Send candidates to new subscriber
    console.log('📧 Testing sendCandidatesToNewSubscriber...');
    await sendCandidatesToNewSubscriber(testSubscriber);
    console.log('✅ sendCandidatesToNewSubscriber test passed');

    // Test 3: Send candidates to all subscribers
    console.log('📧 Testing sendCandidatesToSubscribers...');
    await sendCandidatesToSubscribers();
    console.log('✅ sendCandidatesToSubscribers test passed');

    console.log('🎉 All newsletter tests passed!');

  } catch (error) {
    console.error('❌ Newsletter test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testNewsletterFunctionality();
}

export { testNewsletterFunctionality }; 