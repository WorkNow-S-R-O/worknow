import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';

const prisma = new PrismaClient();

// Configure AWS (you'll need to set these environment variables)
AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION || 'us-east-1',
});

const sns = new AWS.SNS();

/**
 * Test SNS email verification functionality
 */
async function testSNSVerification() {
	try {
		console.log('🧪 Testing SNS email verification...');

		const testEmail = 'test@example.com';
		const testCode = '123456';

		console.log('📧 Test email:', testEmail);
		console.log('🔢 Test code:', testCode);

		// Test 1: Create SNS topic
		console.log('\n1️⃣ Testing SNS topic creation...');
		const topicName = 'worknow-email-verification-test';

		let topicArn;
		try {
			const createTopicResult = await sns
				.createTopic({ Name: topicName })
				.promise();
			topicArn = createTopicResult.TopicArn;
			console.log('✅ Topic created:', topicArn);
		} catch (error) {
			if (error.code === 'AlreadyExistsException') {
				console.log('ℹ️ Topic already exists, getting ARN...');
				const listTopicsResult = await sns.listTopics().promise();
				const topic = listTopicsResult.Topics.find((t) =>
					t.TopicArn.includes(topicName),
				);
				topicArn = topic.TopicArn;
				console.log('✅ Topic found:', topicArn);
			} else {
				throw error;
			}
		}

		// Test 2: Subscribe email to topic
		console.log('\n2️⃣ Testing email subscription...');
		try {
			await sns
				.subscribe({
					TopicArn: topicArn,
					Protocol: 'email',
					Endpoint: testEmail,
				})
				.promise();
			console.log('✅ Email subscribed to topic');
		} catch (subscribeError) {
			if (subscribeError.code === 'AlreadySubscribedException') {
				console.log('ℹ️ Email already subscribed');
			} else {
				throw subscribeError;
			}
		}

		// Test 3: Send verification message
		console.log('\n3️⃣ Testing message sending...');
		const message = `Ваш код подтверждения для подписки на рассылку WorkNow: ${testCode}. Код действителен в течение 10 минут.`;

		const publishResult = await sns
			.publish({
				TopicArn: topicArn,
				Subject: 'WorkNow - Код подтверждения (Тест)',
				Message: message,
			})
			.promise();

		console.log('✅ Message sent successfully');
		console.log('📨 Message ID:', publishResult.MessageId);

		// Test 4: Test database operations
		console.log('\n4️⃣ Testing database operations...');

		// Store verification code
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

		await prisma.newsletterVerification.upsert({
			where: { email: testEmail },
			update: {
				code: testCode,
				expiresAt,
				attempts: 0,
			},
			create: {
				email: testEmail,
				code: testCode,
				expiresAt,
				attempts: 0,
			},
		});

		console.log('✅ Verification code stored in database');

		// Test 5: Verify code
		console.log('\n5️⃣ Testing code verification...');

		const verification = await prisma.newsletterVerification.findUnique({
			where: { email: testEmail },
		});

		if (verification) {
			console.log('✅ Verification record found');
			console.log('📧 Email:', verification.email);
			console.log('🔢 Code:', verification.code);
			console.log('⏰ Expires:', verification.expiresAt);
			console.log('🔄 Attempts:', verification.attempts);

			// Test verification
			if (verification.code === testCode) {
				console.log('✅ Code verification successful');

				// Clean up
				await prisma.newsletterVerification.delete({
					where: { email: testEmail },
				});
				console.log('✅ Test verification record cleaned up');
			} else {
				console.log('❌ Code verification failed');
			}
		} else {
			console.log('❌ Verification record not found');
		}

		// Test 6: Clean up SNS topic
		console.log('\n6️⃣ Cleaning up SNS topic...');
		try {
			await sns.deleteTopic({ TopicArn: topicArn }).promise();
			console.log('✅ Test topic deleted');
		} catch (error) {
			console.log('ℹ️ Could not delete topic (may be in use):', error.message);
		}

		console.log('\n🎉 All tests completed successfully!');
	} catch (error) {
		console.error('❌ Test failed:', error);
		console.error('Error details:', error.message);

		if (error.code === 'CredentialsError') {
			console.log(
				'\n💡 Make sure you have set the following environment variables:',
			);
			console.log('- AWS_ACCESS_KEY_ID');
			console.log('- AWS_SECRET_ACCESS_KEY');
			console.log('- AWS_REGION (optional, defaults to us-east-1)');
		}
	} finally {
		await prisma.$disconnect();
	}
}

// Run the test
testSNSVerification();
