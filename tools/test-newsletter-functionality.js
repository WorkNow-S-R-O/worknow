import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Test data
const testEmail = 'newtest@example.com';
const testSubscriber = {
  email: testEmail,
  firstName: 'Test',
  lastName: 'User',
  language: 'ru',
  preferences: {}
};

/**
 * Test newsletter subscription functionality
 */
async function testNewsletterFunctionality() {
  console.log('🧪 Testing Newsletter Functionality...\n');

  try {
    // Test 1: Check subscription status for non-existent email
    console.log('📧 Test 1: Check subscription status for non-existent email');
    try {
      const checkResponse = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
        params: { email: 'nonexistent@example.com' }
      });
      console.log('✅ Check response:', checkResponse.data);
    } catch (error) {
      console.error('❌ Check error:', error.response?.data || error.message);
    }

    // Test 2: Subscribe to newsletter
    console.log('\n📧 Test 2: Subscribe to newsletter');
    try {
      const subscribeResponse = await axios.post(`${API_URL}/api/newsletter/subscribe`, testSubscriber);
      console.log('✅ Subscribe response:', subscribeResponse.data);
    } catch (error) {
      console.error('❌ Subscribe error:', error.response?.data || error.message);
    }

    // Test 3: Check subscription status for subscribed email
    console.log('\n📧 Test 3: Check subscription status for subscribed email');
    try {
      const checkResponse2 = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
        params: { email: testEmail }
      });
      console.log('✅ Check response:', checkResponse2.data);
    } catch (error) {
      console.error('❌ Check error:', error.response?.data || error.message);
    }

    // Test 4: Try to subscribe again (should fail)
    console.log('\n📧 Test 4: Try to subscribe again (should fail)');
    try {
      const subscribeResponse2 = await axios.post(`${API_URL}/api/newsletter/subscribe`, testSubscriber);
      console.log('✅ Subscribe response:', subscribeResponse2.data);
    } catch (error) {
      console.log('✅ Expected error (already subscribed):', error.response?.data?.message || error.message);
    }

    // Test 5: Unsubscribe from newsletter
    console.log('\n📧 Test 5: Unsubscribe from newsletter');
    try {
      const unsubscribeResponse = await axios.post(`${API_URL}/api/newsletter/unsubscribe`, {
        email: testEmail
      });
      console.log('✅ Unsubscribe response:', unsubscribeResponse.data);
    } catch (error) {
      console.error('❌ Unsubscribe error:', error.response?.data || error.message);
    }

    // Test 6: Check subscription status after unsubscribe
    console.log('\n📧 Test 6: Check subscription status after unsubscribe');
    try {
      const checkResponse3 = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
        params: { email: testEmail }
      });
      console.log('✅ Check response:', checkResponse3.data);
    } catch (error) {
      console.error('❌ Check error:', error.response?.data || error.message);
    }

    // Test 7: Get all subscribers (admin endpoint)
    console.log('\n📧 Test 7: Get all subscribers');
    try {
      const subscribersResponse = await axios.get(`${API_URL}/api/newsletter/subscribers`);
      console.log('✅ Subscribers response:', subscribersResponse.data);
    } catch (error) {
      console.error('❌ Subscribers error:', error.response?.data || error.message);
    }

    console.log('\n✅ All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testNewsletterFunctionality().catch(console.error); 