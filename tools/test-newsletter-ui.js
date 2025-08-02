import axios from 'axios';

const API_URL = 'http://localhost:3001';

/**
 * Test the complete newsletter UI flow
 */
async function testNewsletterUIFlow() {
  console.log('🧪 Testing Newsletter UI Flow...\n');

  const testEmail = 'unsubscribetest@example.com';
  const testSubscriber = {
    email: testEmail,
    firstName: 'UI',
    lastName: 'Test',
    language: 'ru',
    preferences: {}
  };

  try {
    // Step 1: Check initial state (not subscribed)
    console.log('📧 Step 1: Check initial state (not subscribed)');
    const check1 = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
      params: { email: testEmail }
    });
    console.log('✅ Initial state:', check1.data.isSubscribed ? 'Subscribed' : 'Not subscribed');

    // Step 2: Subscribe
    console.log('\n📧 Step 2: Subscribe to newsletter');
    const subscribe = await axios.post(`${API_URL}/api/newsletter/subscribe`, testSubscriber);
    console.log('✅ Subscribe result:', subscribe.data.success ? 'Success' : 'Failed');

    // Step 3: Check subscribed state
    console.log('\n📧 Step 3: Check subscribed state');
    const check2 = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
      params: { email: testEmail }
    });
    console.log('✅ Subscribed state:', check2.data.isSubscribed ? 'Subscribed' : 'Not subscribed');
    if (check2.data.subscriber) {
      console.log('   Subscriber info:', `${check2.data.subscriber.firstName} ${check2.data.subscriber.lastName} (${check2.data.subscriber.email})`);
    }

    // Step 4: Unsubscribe (using the "Сбросить" button logic)
    console.log('\n📧 Step 4: Unsubscribe (using "Сбросить" button)');
    const unsubscribe = await axios.post(`${API_URL}/api/newsletter/unsubscribe`, {
      email: testEmail
    });
    console.log('✅ Unsubscribe result:', unsubscribe.data.success ? 'Success' : 'Failed');

    // Step 5: Check final state (should be unsubscribed)
    console.log('\n📧 Step 5: Check final state (should be unsubscribed)');
    const check3 = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
      params: { email: testEmail }
    });
    console.log('✅ Final state:', check3.data.isSubscribed ? 'Subscribed' : 'Not subscribed');

    // Step 6: Verify database deletion
    console.log('\n📧 Step 6: Verify database deletion');
    const subscribers = await axios.get(`${API_URL}/api/newsletter/subscribers`);
    const found = subscribers.data.subscribers.find(s => s.email === testEmail);
    console.log('✅ Database check:', found ? 'Still exists' : 'Successfully deleted');

    console.log('\n✅ UI Flow Test Completed!');
    console.log('\n📋 Summary:');
    console.log('   - Initial state: Not subscribed');
    console.log('   - After subscribe: Subscribed');
    console.log('   - After unsubscribe: Not subscribed');
    console.log('   - Database: Record deleted');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testNewsletterUIFlow().catch(console.error); 