import { config } from 'dotenv';
import axios from 'axios';

// Load environment variables
config();

const API_URL = 'http://localhost:3000';

async function testFrontendFlow() {
  console.log('🔍 Testing frontend newsletter subscription flow...');
  
  const testEmail = 'frontendtest@example.com';
  const testData = {
    email: testEmail,
    firstName: 'Frontend',
    lastName: 'Test',
    language: 'ru',
    preferences: {},
    preferredCities: [],
    preferredCategories: [],
    preferredEmployment: [],
    preferredLanguages: [],
    preferredGender: null,
    preferredDocumentTypes: [],
    onlyDemanded: false
  };
  
  try {
    console.log('📧 Step 1: Calling send-verification endpoint (exactly like frontend)...');
    console.log('📧 URL:', `${API_URL}/api/newsletter/send-verification`);
    console.log('📧 Data:', JSON.stringify(testData, null, 2));
    
    const response = await axios.post(`${API_URL}/api/newsletter/send-verification`, testData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('✅ Step 1: Response received');
    console.log('📧 Status:', response.status);
    console.log('📧 Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Verification code request successful');
      console.log('📧 Email:', response.data.email);
      console.log('📧 Message:', response.data.message);
      
      // Now let's verify the code was stored
      console.log('📧 Step 2: Checking if verification code was stored...');
      const dbCheckResponse = await axios.get(`${API_URL}/api/newsletter/check-subscription?email=${testEmail}`);
      console.log('📧 DB check response:', dbCheckResponse.data);
      
    } else {
      console.log('❌ Verification code request failed');
      console.log('📧 Error:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Error in frontend flow test:', error);
    if (error.response) {
      console.log('📧 Error response status:', error.response.status);
      console.log('📧 Error response data:', error.response.data);
    }
  }
}

testFrontendFlow().catch(console.error); 