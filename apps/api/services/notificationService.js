import prisma from '../lib/prisma.js';
import { sendEmail } from '../utils/mailer.js';


/**
 * Send notifications to all users when new candidates are added
 * @param {Array} newSeekers - Array of newly added seekers
 */
export async function sendNewCandidatesNotification(newSeekers) {
	try {
		console.log(
			'📧 Starting to send notifications for',
			newSeekers.length,
			'new candidates',
		);

		// Get all users
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				clerkUserId: true,
			},
		});

		console.log('👥 Found', users.length, 'users to notify');

		if (users.length === 0) {
			console.log('⚠️ No users found to notify');
			return;
		}

		// Prepare email content
		const emailContent = generateNewCandidatesEmail(newSeekers);

		// Send emails to all users
		const emailPromises = users.map((user) =>
			sendEmailToUser(user, emailContent),
		);

		// Wait for all emails to be sent
		const results = await Promise.allSettled(emailPromises);

		// Log results
		const successful = results.filter((r) => r.status === 'fulfilled').length;
		const failed = results.filter((r) => r.status === 'rejected').length;

		console.log(`✅ Successfully sent ${successful} notifications`);
		if (failed > 0) {
			console.log(`❌ Failed to send ${failed} notifications`);
		}

		return {
			totalUsers: users.length,
			successful,
			failed,
			newCandidates: newSeekers.length,
		};
	} catch (error) {
		console.error('❌ Error sending new candidates notifications:', error);
		throw error;
	}
}

/**
 * Send email to a specific user
 * @param {Object} user - User object with email and name
 * @param {Object} emailContent - Email content object
 */
async function sendEmailToUser(user, emailContent) {
	try {
		const userName = user.firstName || user.lastName || 'Пользователь';

		await sendEmail(
			user.email,
			emailContent.subject,
			emailContent.html.replace('{{userName}}', userName),
		);

		console.log(`✅ Email sent to ${user.email}`);
		return { success: true, email: user.email };
	} catch (error) {
		console.error(`❌ Failed to send email to ${user.email}:`, error.message);
		return { success: false, email: user.email, error: error.message };
	}
}

/**
 * Generate email content for new candidates notification
 * @param {Array} newSeekers - Array of newly added seekers
 * @returns {Object} Email content with subject and HTML
 */
function generateNewCandidatesEmail(newSeekers) {
	const candidatesList = newSeekers
		.map(
			(seeker) => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h3 style="margin: 0 0 10px 0; color: #1976d2;">${seeker.name}</h3>
      <p style="margin: 5px 0; color: #666;"><strong>Город:</strong> ${seeker.city}</p>
      <p style="margin: 5px 0; color: #666;"><strong>Описание:</strong> ${seeker.description}</p>
      ${seeker.category ? `<p style="margin: 5px 0; color: #666;"><strong>Категория:</strong> ${seeker.category}</p>` : ''}
      ${seeker.employment ? `<p style="margin: 5px 0; color: #666;"><strong>Тип занятости:</strong> ${seeker.employment}</p>` : ''}
      ${seeker.languages && seeker.languages.length > 0 ? `<p style="margin: 5px 0; color: #666;"><strong>Языки:</strong> ${seeker.languages.join(', ')}</p>` : ''}
      ${seeker.isDemanded ? '<p style="margin: 5px 0; color: #ff6b35; font-weight: bold;">⭐ Востребованный кандидат</p>' : ''}
    </div>
  `,
		)
		.join('');

	const subject = `Новые соискатели на WorkNow - ${newSeekers.length} новых кандидатов`;

	const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Новые соискатели</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1976d2; margin: 0;">WorkNow</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Платформа поиска работы в Израиле</p>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px;">Здравствуйте, {{userName}}!</h2>
        
        <p style="margin-bottom: 20px; font-size: 16px;">
          Мы рады сообщить, что на платформе WorkNow появились <strong>${newSeekers.length} новых соискателей</strong>, 
          которые ищут работу в Израиле.
        </p>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 10px 0; color: #1976d2;">Новые кандидаты:</h3>
          ${candidatesList}
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/seekers" 
             style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Посмотреть всех соискателей
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666;">
          <p>Это письмо отправлено автоматически. Если у вас есть вопросы, свяжитесь с нами.</p>
          <p>С уважением,<br>Команда WorkNow</p>
        </div>
      </div>
    </body>
    </html>
  `;

	return { subject, html };
}

/**
 * Send notification for a single new seeker
 * @param {Object} seeker - Newly added seeker
 */
export async function sendSingleCandidateNotification(seeker) {
	return sendNewCandidatesNotification([seeker]);
}

/**
 * Send notification for multiple new seekers
 * @param {Array} seekers - Array of newly added seekers
 */
export async function sendMultipleCandidatesNotification(seekers) {
	return sendNewCandidatesNotification(seekers);
}
