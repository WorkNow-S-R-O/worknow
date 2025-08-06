import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

const API_URL = 'http://localhost:3000';

async function testVerificationFlow() {
  console.log('🔍 Testing complete verification flow...');
  
  const testEmail = 'verificationtest@example.com';
  const testData = {
    email: testEmail,
    firstName: 'Verification',
    lastName: 'Test'
  };
  
  try {
    console.log('📧 Step 1: Sending verification code request...');
    console.log('📧 Email:', testEmail);
    console.log('📧 API URL:', `${API_URL}/api/newsletter/send-verification`);
    
    const response = await axios.post(`${API_URL}/api/newsletter/send-verification`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Step 1: API Response received');
    console.log('📧 Response status:', response.status);
    console.log('📧 Response data:', response.data);
    
    if (response.data.success) {
      console.log('✅ Verification code request successful');
      console.log('📧 Email:', response.data.email);
      console.log('📧 Message:', response.data.message);
    } else {
      console.log('❌ Verification code request failed');
      console.log('📧 Error:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Error in verification flow test:', error);
    if (error.response) {
      console.log('📧 Error response status:', error.response.status);
      console.log('📧 Error response data:', error.response.data);
    }
  }
}

testVerificationFlow().catch(console.error); 