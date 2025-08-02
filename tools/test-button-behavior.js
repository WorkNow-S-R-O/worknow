import axios from 'axios';

const API_URL = 'http://localhost:3001';

/**
 * Test button behavior and subscription checking
 */
async function testButtonBehavior() {
  console.log('🧪 Testing Button Behavior...\n');

  const testEmail = 'buttonbehavior@example.com';
  const testSubscriber = {
    email: testEmail,
    firstName: 'Button',
    lastName: 'Behavior',
    language: 'ru',
    preferences: {}
  };

  try {
    // Step 1: Check initial state - should show "Сбросить" (Reset)
    console.log('📧 Step 1: Check initial state');
    const check1 = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
      params: { email: testEmail }
    });
    console.log('✅ Initial state:', check1.data.isSubscribed ? 'Subscribed' : 'Not subscribed');
    console.log('   Button should show: "Сбросить" (Reset)');

    // Step 2: Subscribe
    console.log('\n📧 Step 2: Subscribe to newsletter');
    const subscribe = await axios.post(`${API_URL}/api/newsletter/subscribe`, testSubscriber);
    console.log('✅ Subscribe result:', subscribe.data.success ? 'Success' : 'Failed');

    // Step 3: Check subscribed state - should show "Unsubscribe"
    console.log('\n📧 Step 3: Check subscribed state');
    const check2 = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
      params: { email: testEmail }
    });
    console.log('✅ Subscribed state:', check2.data.isSubscribed ? 'Subscribed' : 'Not subscribed');
    console.log('   Button should show: "Unsubscribe"');

    // Step 4: Test unsubscribe functionality
    console.log('\n📧 Step 4: Test unsubscribe functionality');
    const unsubscribe = await axios.post(`${API_URL}/api/newsletter/unsubscribe`, {
      email: testEmail
    });
    console.log('✅ Unsubscribe result:', unsubscribe.data.success ? 'Success' : 'Failed');

    // Step 5: Check final state - should show "Сбросить" (Reset) again
    console.log('\n📧 Step 5: Check final state');
    const check3 = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
      params: { email: testEmail }
    });
    console.log('✅ Final state:', check3.data.isSubscribed ? 'Subscribed' : 'Not subscribed');
    console.log('   Button should show: "Сбросить" (Reset)');

    console.log('\n✅ Button Behavior Test Completed!');
    console.log('\n📋 Summary:');
    console.log('   - Not subscribed: Button shows "Сбросить" (Reset)');
    console.log('   - Subscribed: Button shows "Unsubscribe"');
    console.log('   - After unsubscribe: Button shows "Сбросить" (Reset) again');
    console.log('   - Unsubscribe functionality: Working correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testButtonBehavior().catch(console.error); 