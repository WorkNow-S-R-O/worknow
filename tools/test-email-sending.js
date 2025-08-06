import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

const API_URL = 'http://localhost:3000';

async function testEmailSending() {
  console.log('🔍 Testing email sending through the server...');
  
  const testEmail = 'emailsendingtest@example.com';
  const testData = {
    email: testEmail,
    firstName: 'Email',
    lastName: 'Sending'
  };
  
  try {
    console.log('📧 Step 1: Sending verification code request...');
    console.log('📧 Email:', testEmail);
    console.log('📧 This should trigger the server to send an email via Resend');
    
    const response = await axios.post(`${API_URL}/api/newsletter/send-verification`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Step 1: Response received');
    console.log('📧 Status:', response.status);
    console.log('📧 Success:', response.data.success);
    console.log('📧 Message:', response.data.message);
    
    if (response.data.success) {
      console.log('✅ API says verification code was sent');
      console.log('📧 Now check if you received an email at:', testEmail);
      console.log('📧 The email should be from: WorkNow <onboarding@resend.dev>');
      console.log('📧 Subject: WorkNow - Код подтверждения');
      console.log('📧 If you received the email, the system is working!');
      console.log('📧 If you did NOT receive the email, there is an issue with the server logs or email sending');
    }
    
  } catch (error) {
    console.error('❌ Error in email sending test:', error);
    if (error.response) {
      console.log('📧 Error response status:', error.response.status);
      console.log('📧 Error response data:', error.response.data);
    }
  }
}

testEmailSending().catch(console.error); 