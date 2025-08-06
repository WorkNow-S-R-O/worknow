import { config } from 'dotenv';
import { Resend } from 'resend';

// Load environment variables
config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('🔍 Testing Resend email service...');
  
  // Check environment variables
  console.log('📧 RESEND_API_KEY available:', !!process.env.RESEND_API_KEY);
  console.log('📧 RESEND_API_KEY value:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'NOT SET');
  
  const testEmail = 'peterbaikov12@gmail.com';
  const testSubject = 'WorkNow - Test Resend Email';
  const testContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1976d2; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">WORKNOW</h1>
      </div>
      <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Test Resend Email Service</h2>
        <p style="color: #666; margin-bottom: 20px;">
          This is a test email to verify that the Resend email service is working correctly.
        </p>
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h3 style="color: #1976d2; margin: 0; font-size: 32px; letter-spacing: 5px;">TEST CODE: 123456</h3>
        </div>
        <p style="color: #666; margin-bottom: 20px;">
          If you receive this email, the Resend service is working properly.
        </p>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            WorkNow - Платформа для поиска работы в Израиле
          </p>
        </div>
      </div>
    </div>
  `;
  
  try {
    console.log('📧 Attempting to send test email via Resend...');
    console.log('📧 From: WorkNow <onboarding@resend.dev>');
    console.log('📧 To:', testEmail);
    console.log('📧 Subject:', testSubject);
    
    const result = await resend.emails.send({
      from: 'WorkNow <onboarding@resend.dev>',
      to: testEmail,
      subject: testSubject,
      html: testContent
    });
    
    console.log('✅ Test email sent successfully via Resend!');
    console.log('📧 Result:', result);
  } catch (error) {
    console.error('❌ Failed to send test email via Resend:', error);
    console.log('🔍 Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });
  }
}

testResend().catch(console.error); 