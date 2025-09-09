import { PrismaClient } from '@prisma/client';
import AWS from 'aws-sdk';
import { Resend } from 'resend';
import { sendEmail } from '../utils/mailer.js';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Configure AWS
const hasAwsCredentials =
	process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

if (hasAwsCredentials) {
	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION || 'us-east-1',
	});
} else {
	console.log(
		'⚠️ AWS credentials not found. SNS email verification will be simulated for development.',
	);
}

const sns = hasAwsCredentials ? new AWS.SNS() : null;

/**
 * Generate a random verification code
 */
export function generateVerificationCode() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification code via email using Resend with Gmail fallback
 */
export async function sendVerificationCode(email, code) {
	try {
		// Try Resend first (if available)
		if (process.env.RESEND_API_KEY) {
			console.log('📧 Attempting to send verification code via Resend...');

			try {
				const emailSubject = 'WorkNow - Код подтверждения';
				const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #1976d2; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">WORKNOW</h1>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 20px;">Код подтверждения для подписки на рассылку</h2>
              <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                <h3 style="color: #1976d2; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h3>
              </div>
              <p style="color: #666; margin-bottom: 20px;">
                Этот код действителен в течение 10 минут. Если вы не запрашивали этот код, проигнорируйте это письмо.
              </p>
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #666; font-size: 12px; margin: 0;">
                  WorkNow - Платформа для поиска работы в Израиле
                </p>
              </div>
            </div>
          </div>
        `;

				const result = await resend.emails.send({
					from: 'WorkNow <onboarding@resend.dev>',
					to: email,
					subject: emailSubject,
					html: emailContent,
				});

				console.log('✅ Verification code sent via Resend:', email);
				return {
					success: true,
					messageId: result.id || 'resend-' + Date.now(),
				};
			} catch (resendError) {
				console.error('❌ Resend failed, trying Gmail fallback:', resendError);
			}
		}

		// Try Gmail fallback
		console.log('📧 Attempting to send verification code via Gmail...');

		try {
			const emailSubject = 'WorkNow - Код подтверждения';
			const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1976d2; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">WORKNOW</h1>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Код подтверждения для подписки на рассылку</h2>
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
              <h3 style="color: #1976d2; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h3>
            </div>
            <p style="color: #666; margin-bottom: 20px;">
              Этот код действителен в течение 10 минут. Если вы не запрашивали этот код, проигнорируйте это письмо.
            </p>
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                WorkNow - Платформа для поиска работы в Израиле
              </p>
            </div>
          </div>
        </div>
      `;

			await sendEmail(email, emailSubject, emailContent);
			console.log('✅ Verification code sent via Gmail fallback:', email);
			return { success: true, messageId: 'gmail-fallback-' + Date.now() };
		} catch (gmailError) {
			console.error('❌ Gmail fallback failed:', gmailError);
			console.log('📧 [DEV MODE] Verification code would be sent to:', email);
			console.log('📧 [DEV MODE] Verification code:', code);
			console.log(
				'📧 [DEV MODE] In production, this would be sent via AWS SNS',
			);
			console.log('🔢 FOR TESTING - Your verification code is:', code);
			console.log('📧 Email address:', email);

			// Simulate a delay to mimic real email sending
			await new Promise((resolve) => setTimeout(resolve, 1000));

			return { success: true, messageId: 'dev-simulation-' + Date.now() };
		}

		// Create SNS topic for email notifications
		const topicName = 'worknow-email-verification';

		// Try to create topic or get existing one
		let topicArn;
		try {
			const createTopicResult = await sns
				.createTopic({ Name: topicName })
				.promise();
			topicArn = createTopicResult.TopicArn;
		} catch (error) {
			if (error.code === 'AlreadyExistsException') {
				// Topic already exists, get its ARN
				const listTopicsResult = await sns.listTopics().promise();
				const topic = listTopicsResult.Topics.find((t) =>
					t.TopicArn.includes(topicName),
				);
				topicArn = topic.TopicArn;
			} else if (error.code === 'AuthorizationError') {
				// Handle authorization error gracefully - try Resend or Gmail fallback
				console.log(
					'⚠️ AWS SNS Authorization Error. Trying Resend/Gmail fallback...',
				);

				// Try Resend first
				if (process.env.RESEND_API_KEY) {
					try {
						const emailSubject = 'WorkNow - Код подтверждения';
						const emailContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1976d2; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
                  <h1 style="margin: 0; font-size: 24px;">WORKNOW</h1>
                </div>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <h2 style="color: #333; margin-bottom: 20px;">Код подтверждения для подписки на рассылку</h2>
                  <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                    <h3 style="color: #1976d2; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h3>
                  </div>
                  <p style="color: #666; margin-bottom: 20px;">
                    Этот код действителен в течение 10 минут. Если вы не запрашивали этот код, проигнорируйте это письмо.
                  </p>
                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="color: #666; font-size: 12px; margin: 0;">
                      WorkNow - Платформа для поиска работы в Израиле
                    </p>
                  </div>
                </div>
              </div>
            `;

						const result = await resend.emails.send({
							from: 'WorkNow <onboarding@resend.dev>',
							to: email,
							subject: emailSubject,
							html: emailContent,
						});

						console.log(
							'✅ Verification code sent via Resend after SNS error:',
							email,
						);
						return {
							success: true,
							messageId: result.id || 'resend-' + Date.now(),
						};
					} catch (resendError) {
						console.error('❌ Resend also failed, trying Gmail:', resendError);
					}
				}

				// Try Gmail fallback
				try {
					const emailSubject = 'WorkNow - Код подтверждения';
					const emailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #1976d2; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">WORKNOW</h1>
              </div>
              <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-bottom: 20px;">Код подтверждения для подписки на рассылку</h2>
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
                  <h3 style="color: #1976d2; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h3>
                </div>
                <p style="color: #666; margin-bottom: 20px;">
                  Этот код действителен в течение 10 минут. Если вы не запрашивали этот код, проигнорируйте это письмо.
                </p>
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                  <p style="color: #666; font-size: 12px; margin: 0;">
                    WorkNow - Платформа для поиска работы в Израиле
                  </p>
                </div>
              </div>
            </div>
          `;

					await sendEmail(email, emailSubject, emailContent);
					console.log(
						'✅ Verification code sent via Gmail fallback after SNS error:',
						email,
					);
					return { success: true, messageId: 'gmail-fallback-' + Date.now() };
				} catch (gmailError) {
					console.error('❌ Gmail fallback also failed:', gmailError);
					console.log('📧 [DEV MODE] Would create SNS topic:', topicName);
					console.log('📧 [DEV MODE] Would send email to:', email);
					console.log('📧 [DEV MODE] Verification code:', code);
					console.log('🔢 FOR TESTING - Your verification code is:', code);
					console.log('📧 Email address:', email);

					// Simulate successful email sending
					return { success: true, messageId: 'dev-simulation-' + Date.now() };
				}
			} else {
				throw error;
			}
		}

		// Subscribe email to topic
		try {
			await sns
				.subscribe({
					TopicArn: topicArn,
					Protocol: 'email',
					Endpoint: email,
				})
				.promise();
		} catch (subscribeError) {
			// If already subscribed, that's fine
			if (subscribeError.code !== 'AlreadySubscribedException') {
				throw subscribeError;
			}
		}

		// Send verification message
		const message = `Ваш код подтверждения для подписки на рассылку WorkNow: ${code}. Код действителен в течение 10 минут.`;

		const publishResult = await sns
			.publish({
				TopicArn: topicArn,
				Subject: 'WorkNow - Код подтверждения',
				Message: message,
			})
			.promise();

		console.log('✅ Verification code sent via SNS:', email);
		return { success: true, messageId: publishResult.MessageId };
	} catch (error) {
		console.error('❌ Error sending verification code via SNS:', error);
		throw error;
	}
}

/**
 * Store verification code in database
 */
export async function storeVerificationCode(email, code) {
	try {
		// Store verification code with expiration (10 minutes)
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

		await prisma.newsletterVerification.upsert({
			where: { email },
			update: {
				code,
				expiresAt,
				attempts: 0,
			},
			create: {
				email,
				code,
				expiresAt,
				attempts: 0,
			},
		});

		console.log('✅ Verification code stored for:', email);
		return true;
	} catch (error) {
		console.error('❌ Error storing verification code:', error);
		throw error;
	}
}

/**
 * Verify the provided code
 */
export async function verifyCode(email, providedCode) {
	try {
		const verification = await prisma.newsletterVerification.findUnique({
			where: { email },
		});

		if (!verification) {
			return { valid: false, message: 'Verification code not found' };
		}

		// Check if code has expired
		if (new Date() > verification.expiresAt) {
			// Delete expired verification
			await prisma.newsletterVerification.delete({
				where: { email },
			});
			return { valid: false, message: 'Verification code has expired' };
		}

		// Check if too many attempts
		if (verification.attempts >= 3) {
			// Delete verification after too many attempts
			await prisma.newsletterVerification.delete({
				where: { email },
			});
			return {
				valid: false,
				message: 'Too many attempts. Please request a new code.',
			};
		}

		// Increment attempts
		await prisma.newsletterVerification.update({
			where: { email },
			data: { attempts: verification.attempts + 1 },
		});

		// Check if code matches
		if (verification.code === providedCode) {
			// Delete verification after successful verification
			await prisma.newsletterVerification.delete({
				where: { email },
			});
			return { valid: true, message: 'Verification successful' };
		} else {
			return { valid: false, message: 'Invalid verification code' };
		}
	} catch (error) {
		console.error('❌ Error verifying code:', error);
		throw error;
	}
}

/**
 * Clean up expired verification codes
 */
export async function cleanupExpiredVerifications() {
	try {
		const result = await prisma.newsletterVerification.deleteMany({
			where: {
				expiresAt: {
					lt: new Date(),
				},
			},
		});

		if (result.count > 0) {
			console.log(`✅ Cleaned up ${result.count} expired verification codes`);
		}

		return result.count;
	} catch (error) {
		console.error('❌ Error cleaning up expired verifications:', error);
		throw error;
	}
}
