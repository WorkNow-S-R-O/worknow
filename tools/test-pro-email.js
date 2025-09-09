import { config } from 'dotenv';
import { sendProWelcomeEmail } from '../apps/api/services/premiumEmailService.js';

// Load environment variables
config();

async function testProEmail() {
	console.log('🔍 Testing Pro welcome email...');

	// Test email configuration
	console.log('📧 RESEND_API_KEY available:', !!process.env.RESEND_API_KEY);
	console.log(
		'📧 RESEND_API_KEY value:',
		process.env.RESEND_API_KEY
			? process.env.RESEND_API_KEY.substring(0, 10) + '...'
			: 'NOT SET',
	);

	const testEmail = 'peterbaikov12@gmail.com'; // Use your email for testing
	const testUserName = 'Peter Baikov';

	console.log('📧 Testing with email:', testEmail);
	console.log('📧 Testing with user name:', testUserName);

	try {
		console.log('📧 Attempting to send Pro welcome email...');

		const result = await sendProWelcomeEmail(testEmail, testUserName);

		console.log('✅ Pro welcome email sent successfully!');
		console.log('📧 Result:', result);
		console.log('📧 Check your email inbox for the Pro welcome message');
	} catch (error) {
		console.error('❌ Failed to send Pro welcome email:', error);
	}
}

// Run the test
testProEmail().catch(console.error);
