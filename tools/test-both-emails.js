import { config } from 'dotenv';
import {
	sendProWelcomeEmail,
	sendPremiumDeluxeWelcomeEmail,
} from '../apps/api/services/premiumEmailService.js';

// Load environment variables
config();

async function testBothEmails() {
	console.log('🔍 Testing both Pro and Premium Deluxe welcome emails...');

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
		console.log('\n📧 Testing Pro welcome email...');
		const proResult = await sendProWelcomeEmail(testEmail, testUserName);
		console.log('✅ Pro welcome email sent successfully!');
		console.log('📧 Pro Result:', proResult);

		console.log('\n📧 Testing Premium Deluxe welcome email...');
		const deluxeResult = await sendPremiumDeluxeWelcomeEmail(
			testEmail,
			testUserName,
		);
		console.log('✅ Premium Deluxe welcome email sent successfully!');
		console.log('📧 Deluxe Result:', deluxeResult);

		console.log('\n🎉 Both emails sent successfully!');
		console.log('📧 Check your email inbox for both welcome messages');
	} catch (error) {
		console.error('❌ Failed to send emails:', error);
	}
}

// Run the test
testBothEmails().catch(console.error);
