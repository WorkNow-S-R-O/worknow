import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

const API_URL = 'http://localhost:3000';

async function testServerLogs() {
  console.log('🔍 Testing server logs for verification code sending...');
  
  const testEmail = 'serverlogstest@example.com';
  const testData = {
    email: testEmail,
    firstName: 'Server',
    lastName: 'Logs'
  };
  
  try {
    console.log('📧 Sending verification code request...');
    console.log('📧 This should trigger server logs showing the email sending process');
    console.log('📧 Email:', testEmail);
    
    const startTime = Date.now();
    const response = await axios.post(`${API_URL}/api/newsletter/send-verification`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const endTime = Date.now();
    
    console.log('✅ Response received in', endTime - startTime, 'ms');
    console.log('📧 Status:', response.status);
    console.log('📧 Success:', response.data.success);
    console.log('📧 Message:', response.data.message);
    
    if (response.data.success) {
      console.log('✅ API says verification code was sent');
      console.log('📧 Check the server terminal for logs showing:');
      console.log('📧 - "Generated verification code: XXXXXX"');
      console.log('📧 - "Storing verification code..."');
      console.log('📧 - "Verification code stored successfully"');
      console.log('📧 - "Sending verification code..."');
      console.log('📧 - "Attempting to send verification code via Resend..."');
      console.log('📧 - "Verification code sent via Resend: email"');
      console.log('📧 - "Verification code sent successfully"');
    }
    
  } catch (error) {
    console.error('❌ Error in server logs test:', error);
    if (error.response) {
      console.log('📧 Error response status:', error.response.status);
      console.log('📧 Error response data:', error.response.data);
    }
  }
}

testServerLogs().catch(console.error); 