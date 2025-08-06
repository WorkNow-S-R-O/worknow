import { config } from 'dotenv';
import { sendPremiumDeluxeWelcomeEmail } from '../apps/api/services/premiumEmailService.js';

// Load environment variables
config();

async function testPremiumDeluxeEmail() {
  console.log('🔍 Testing Premium Deluxe welcome email...');
  
  // Test email configuration
  console.log('📧 RESEND_API_KEY available:', !!process.env.RESEND_API_KEY);
  console.log('📧 RESEND_API_KEY value:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET');
  
  const testEmail = 'peterbaikov12@gmail.com'; // Use your email for testing
  const testUserName = 'Peter Baikov';
  
  console.log('📧 Testing with email:', testEmail);
  console.log('📧 Testing with user name:', testUserName);
  
  try {
    console.log('📧 Attempting to send Premium Deluxe welcome email...');
    
    const result = await sendPremiumDeluxeWelcomeEmail(testEmail, testUserName);
    
    console.log('✅ Premium Deluxe welcome email sent successfully!');
    console.log('📧 Result:', result);
    console.log('📧 Check your email inbox for the welcome message');
    
  } catch (error) {
    console.error('❌ Failed to send Premium Deluxe welcome email:', error);
  }
}

// Run the test
testPremiumDeluxeEmail().catch(console.error); 