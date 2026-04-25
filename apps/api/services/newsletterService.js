import prisma from '../lib/prisma.js';
import { Resend } from 'resend';
import { sendEmail } from '../utils/mailer.js';
import process from 'process';


// Debug: Check if RESEND_API_KEY is available
console.log('🔍 RESEND_API_KEY available:', !!process.env.RESEND_API_KEY);
console.log(
	'🔍 RESEND_API_KEY value:',
	process.env.RESEND_API_KEY
		? process.env.RESEND_API_KEY.substring(0, 10) + '...'
		: 'NOT SET',
);

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send 3 candidates to a newly subscribed user (only once)
 */
export async function sendCandidatesToNewSubscriber(subscriber) {
	try {
		console.log(
			`📧 Отправляем 3 кандидата новому подписчику: ${subscriber.email}`,
		);

		// Get 3 most recent active candidates
		const candidates = await prisma.seeker.findMany({
			where: {
				isActive: true,
			},
			orderBy: { createdAt: 'desc' },
			take: 3,
		});

		if (candidates.length === 0) {
			console.log('📧 Нет доступных кандидатов для отправки');
			return;
		}

		// Generate email content
		const emailContent = generateCandidatesEmailContent(candidates, subscriber);
		const emailSubject = 'Новые соискатели с сайта WorkNow';

		// Send email with fallback
		console.log('📧 Attempting to send email via Resend...');
		console.log('📧 From:', 'WorkNow <onboarding@resend.dev>');
		console.log('📧 To:', subscriber.email);
		console.log('📧 Subject:', emailSubject);

		try {
			const result = await resend.emails.send({
				from: 'WorkNow <onboarding@resend.dev>',
				to: subscriber.email,
				subject: emailSubject,
				html: emailContent,
			});

			console.log('📧 Resend API response:', result);
			console.log(
				`📧 Email с кандидатами успешно отправлен через Resend: ${subscriber.email}`,
			);
		} catch (resendError) {
			console.error('❌ Resend failed, trying Gmail fallback:', resendError);

			// Fallback to Gmail
			try {
				await sendEmail(subscriber.email, emailSubject, emailContent);
				console.log(
					`📧 Email с кандидатами успешно отправлен через Gmail: ${subscriber.email}`,
				);
			} catch (gmailError) {
				console.error('❌ Gmail fallback also failed:', gmailError);
				throw new Error(
					`Failed to send email: Resend error - ${resendError.message}, Gmail error - ${gmailError.message}`,
				);
			}
		}
	} catch (error) {
		console.error('❌ Ошибка при отправке кандидатов:', error);
		throw error;
	}
}

/**
 * Generate email content with candidates
 */
function generateCandidatesEmailContent(candidates, subscriber) {
	const candidatesHtml = candidates
		.map(
			(candidate) => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">
        ${candidate.name} ${candidate.gender ? `${candidate.gender}` : ''}
      </h3>
      <p style="margin: 5px 0; color: #666;">
        <strong>Город:</strong> ${candidate.city || 'Не указан'}
      </p>
      <p style="margin: 5px 0; color: #666;">
        <strong>Занятость:</strong> ${candidate.employment || 'Не указана'}
      </p>
      <p style="margin: 5px 0; color: #666;">
        <strong>Категория:</strong> ${candidate.category || 'Не указана'}
      </p>
      ${candidate.experience ? `<p style="margin: 5px 0; color: #666;"><strong>Опыт, лет:</strong> ${candidate.experience}</p>` : ''}
      <p style="margin: 5px 0; color: #666;">
        <strong>Языки:</strong> ${candidate.languages ? candidate.languages.join(', ') : 'Не указаны'}
      </p>
      <p style="margin: 10px 0 0 0; color: #333; font-style: italic;">
        <strong>Объявление:</strong> ${candidate.description || 'Описание не указано'}
      </p>
    </div>
  `,
		)
		.join('');

	const subscriberName =
		subscriber.firstName && subscriber.lastName
			? `${subscriber.firstName} ${subscriber.lastName}`
			: subscriber.firstName || subscriber.lastName || 'пользователь';

	return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Новые соискатели</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header with Hebrew text -->
        <div style="background-color: #1976d2; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
          <h1 style="margin: 0; font-size: 24px;">WORKNOW</h1>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1976d2; margin: 0 0 10px 0;">
            Уважаемый/ая ${subscriberName}! Для вас найдено ${candidates.length} новых соискателей.
          </h2>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">
            Обратите внимание на соискателей:
          </h3>
          ${candidatesHtml}
        </div>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin-top: 30px;">
          <h3 style="color: #333; margin: 0 0 10px 0;">Наши новости:</h3>
          <p style="margin: 5px 0; color: #666;">
            Открыт вотсапп-чат проекта Авода
          </p>
          <p style="margin: 5px 0; color: #666;">
            Для всех желающих получать максимально оперативно свежую информацию о соискателях, анонсы и новости Системы, открыт вотсапп - чат. Присоединяйтесь !!!
          </p>
          <p style="margin: 5px 0; color: #666;">
            <a href="#" style="color: #1976d2; text-decoration: none;">перейти -></a>
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            Вы получаете эту рассылку потому, что зарегистрировались на нашем сайте.
          </p>
          <p style="color: #666; font-size: 12px; margin: 5px 0;">
            For unsubscribe click here: 
            <a href="https://worknow.co.il/newsletter" style="color: #1976d2; text-decoration: none;">
              https://worknow.co.il/newsletter
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send candidates to existing subscribers (for testing or manual trigger)
 */
export async function sendCandidatesToSubscribers(subscriberIds = null) {
	try {
		console.log('📧 Отправляем кандидатов подписчикам...');

		// Get subscribers
		const whereClause = subscriberIds
			? { id: { in: subscriberIds }, isActive: true }
			: { isActive: true };

		const subscribers = await prisma.newsletterSubscriber.findMany({
			where: whereClause,
		});

		if (subscribers.length === 0) {
			console.log('📧 Нет активных подписчиков для рассылки');
			return;
		}

		// Get 3 most recent active candidates
		const candidates = await prisma.seeker.findMany({
			where: {
				isActive: true,
			},
			orderBy: { createdAt: 'desc' },
			take: 3,
		});

		if (candidates.length === 0) {
			console.log('📧 Нет доступных кандидатов для отправки');
			return;
		}

		console.log(
			`📧 Отправляем ${candidates.length} кандидатов ${subscribers.length} подписчикам`,
		);

		// Send emails to all subscribers with fallback
		const emailPromises = subscribers.map(async (subscriber) => {
			const emailContent = generateCandidatesEmailContent(
				candidates,
				subscriber,
			);
			const emailSubject = 'Новые соискатели с сайта WorkNow';

			try {
				const result = await resend.emails.send({
					from: 'WorkNow <onboarding@resend.dev>',
					to: subscriber.email,
					subject: emailSubject,
					html: emailContent,
				});
				console.log(`📧 Email sent via Resend to: ${subscriber.email}`);
				return result;
			} catch (resendError) {
				console.error(
					`❌ Resend failed for ${subscriber.email}, trying Gmail fallback:`,
					resendError,
				);

				// Fallback to Gmail
				try {
					await sendEmail(subscriber.email, emailSubject, emailContent);
					console.log(`📧 Email sent via Gmail to: ${subscriber.email}`);
				} catch (gmailError) {
					console.error(
						`❌ Gmail fallback also failed for ${subscriber.email}:`,
						gmailError,
					);
					throw new Error(
						`Failed to send email to ${subscriber.email}: Resend error - ${resendError.message}, Gmail error - ${gmailError.message}`,
					);
				}
			}
		});

		await Promise.all(emailPromises);

		console.log(
			`📧 Рассылка успешно отправлена ${subscribers.length} подписчикам`,
		);
	} catch (error) {
		console.error('❌ Ошибка при отправке кандидатов подписчикам:', error);
		throw error;
	}
}

/**
 * Send filtered candidates to subscribers when 3 new candidates are added
 */
export async function sendFilteredCandidatesToSubscribers() {
	try {
		console.log(
			'📧 Checking for new candidates and sending filtered emails...',
		);

		// Get all active subscribers
		const subscribers = await prisma.newsletterSubscriber.findMany({
			where: { isActive: true },
		});

		if (subscribers.length === 0) {
			console.log('📧 Нет активных подписчиков для рассылки');
			return;
		}

		// Get all active candidates
		const allCandidates = await prisma.seeker.findMany({
			where: { isActive: true },
			orderBy: { createdAt: 'desc' },
		});

		if (allCandidates.length === 0) {
			console.log('📧 Нет доступных кандидатов для рассылки');
			return;
		}

		console.log(
			`📧 Найдено ${allCandidates.length} кандидатов и ${subscribers.length} подписчиков`,
		);

		// Send filtered candidates to each subscriber
		for (const subscriber of subscribers) {
			try {
				const filteredCandidates = filterCandidatesByPreferences(
					allCandidates,
					subscriber,
				);

				if (filteredCandidates.length > 0) {
					// Take up to 3 candidates
					const candidatesToSend = filteredCandidates.slice(0, 3);

					const emailContent = generateCandidatesEmailContent(
						candidatesToSend,
						subscriber,
					);
					const emailSubject = 'Новые соискатели с сайта WorkNow';

					console.log(
						`📧 Отправляем ${candidatesToSend.length} отфильтрованных кандидатов подписчику: ${subscriber.email}`,
					);

					// Send email with fallback
					try {
						await resend.emails.send({
							from: 'WorkNow <onboarding@resend.dev>',
							to: subscriber.email,
							subject: emailSubject,
							html: emailContent,
						});

						console.log(
							`📧 Email с отфильтрованными кандидатами отправлен через Resend: ${subscriber.email}`,
						);
					} catch (resendError) {
						console.error(
							`❌ Resend failed for ${subscriber.email}, trying Gmail fallback:`,
							resendError,
						);

						// Fallback to Gmail
						try {
							await sendEmail(subscriber.email, emailSubject, emailContent);
							console.log(
								`📧 Email с отфильтрованными кандидатами отправлен через Gmail: ${subscriber.email}`,
							);
						} catch (gmailError) {
							console.error(
								`❌ Gmail fallback also failed for ${subscriber.email}:`,
								gmailError,
							);
						}
					}
				} else {
					console.log(
						`📧 Нет подходящих кандидатов для подписчика: ${subscriber.email}`,
					);
				}
			} catch (error) {
				console.error(
					`❌ Ошибка при отправке кандидатов подписчику ${subscriber.email}:`,
					error,
				);
			}
		}

		console.log('📧 Рассылка отфильтрованных кандидатов завершена');
	} catch (error) {
		console.error('❌ Ошибка при отправке отфильтрованных кандидатов:', error);
		throw error;
	}
}

/**
 * Filter candidates based on subscriber preferences
 */
function filterCandidatesByPreferences(candidates, subscriber) {
	let filteredCandidates = [...candidates];

	// Filter by cities
	if (subscriber.preferredCities && subscriber.preferredCities.length > 0) {
		filteredCandidates = filteredCandidates.filter((candidate) =>
			subscriber.preferredCities.some(
				(city) =>
					candidate.city &&
					candidate.city.toLowerCase().includes(city.toLowerCase()),
			),
		);
	}

	// Filter by categories
	if (
		subscriber.preferredCategories &&
		subscriber.preferredCategories.length > 0
	) {
		filteredCandidates = filteredCandidates.filter((candidate) =>
			subscriber.preferredCategories.some(
				(category) =>
					candidate.category &&
					candidate.category.toLowerCase().includes(category.toLowerCase()),
			),
		);
	}

	// Filter by employment type
	if (
		subscriber.preferredEmployment &&
		subscriber.preferredEmployment.length > 0
	) {
		filteredCandidates = filteredCandidates.filter((candidate) =>
			subscriber.preferredEmployment.some(
				(employment) =>
					candidate.employment &&
					candidate.employment.toLowerCase().includes(employment.toLowerCase()),
			),
		);
	}

	// Filter by languages
	if (
		subscriber.preferredLanguages &&
		subscriber.preferredLanguages.length > 0
	) {
		filteredCandidates = filteredCandidates.filter(
			(candidate) =>
				candidate.languages &&
				candidate.languages.some((lang) =>
					subscriber.preferredLanguages.some((prefLang) =>
						lang.toLowerCase().includes(prefLang.toLowerCase()),
					),
				),
		);
	}

	// Filter by gender
	if (subscriber.preferredGender) {
		filteredCandidates = filteredCandidates.filter(
			(candidate) =>
				candidate.gender &&
				candidate.gender.toLowerCase() ===
					subscriber.preferredGender.toLowerCase(),
		);
	}

	// Filter by document types
	if (
		subscriber.preferredDocumentTypes &&
		subscriber.preferredDocumentTypes.length > 0
	) {
		filteredCandidates = filteredCandidates.filter(
			(candidate) =>
				candidate.documents &&
				subscriber.preferredDocumentTypes.some((docType) =>
					candidate.documents.toLowerCase().includes(docType.toLowerCase()),
				),
		);
	}

	// Filter by demanded status
	if (subscriber.onlyDemanded) {
		filteredCandidates = filteredCandidates.filter(
			(candidate) => candidate.isDemanded === true,
		);
	}

	console.log(
		`📧 Подписчик ${subscriber.email}: ${filteredCandidates.length} кандидатов после фильтрации из ${candidates.length} общих`,
	);

	return filteredCandidates;
}

/**
 * Check if we should send emails (triggered every 3rd new candidate)
 * DISABLED: This duplicate notification logic has been moved to candidateNotificationService.js
 * to prevent duplicate emails. This function now only handles newsletter subscriptions.
 */
export async function checkAndSendFilteredNewsletter() {
	try {
		console.log(
			'📧 Newsletter service: Duplicate notification logic disabled to prevent duplicate emails',
		);
		console.log(
			'📧 Candidate notifications are now handled exclusively by candidateNotificationService.js',
		);

		// This function no longer sends candidate notifications to prevent duplicates
		// Candidate notifications are handled by candidateNotificationService.js
	} catch (error) {
		console.error('❌ Error in newsletter service:', error);
	}
}

// DISABLED: sendNewCandidatesNotification function moved to candidateNotificationService.js to prevent duplicate emails

// DISABLED: generateNewCandidatesNotificationEmail function moved to candidateNotificationService.js to prevent duplicate emails
