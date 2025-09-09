import { config } from 'dotenv';
import {
	sendVerificationCode,
	storeVerificationCode,
} from '../apps/api/services/snsService.js';

// Load environment variables
config();

async function debugSNSService() {
	console.log('🔍 Debugging SNS Service...');

	const testEmail = 'debugsns@example.com';
	const testCode = '123456';

	try {
		console.log('📧 Step 1: Storing verification code...');
		await storeVerificationCode(testEmail, testCode);
		console.log('✅ Verification code stored successfully');

		console.log('📧 Step 2: Sending verification code...');
		console.log('📧 Email:', testEmail);
		console.log('📧 Code:', testCode);

		const result = await sendVerificationCode(testEmail, testCode);
		console.log('✅ Send verification code result:', result);
	} catch (error) {
		console.error('❌ Error in SNS service debug:', error);
	}
}

debugSNSService().catch(console.error);
