import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import { sendEmail } from '../utils/mailer.js';
import process from 'process';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send 3 latest candidates to a newly subscribed user (only once)
 */
export async function sendInitialCandidatesToNewSubscriber(subscriber) {
	try {
		console.log(
			`📧 Отправляем 3 последних кандидата новому подписчику: ${subscriber.email}`,
		);

		const candidates = await prisma.seeker.findMany({
			where: { isActive: true },
			orderBy: { createdAt: 'desc' },
			take: 3,
		});

		if (candidates.length === 0) {
			console.log('📧 Нет доступных кандидатов для отправки');
			return;
		}

		const emailContent = generateInitialCandidatesEmail(candidates, subscriber);
		const emailSubject = 'Добро пожаловать! Ваши первые кандидаты с WorkNow';

		try {
			await resend.emails.send({
				from: 'WorkNow <onboarding@resend.dev>',
				to: subscriber.email,
				subject: emailSubject,
				html: emailContent,
			});
			console.log(
				`📧 Email с первыми кандидатами отправлен: ${subscriber.email}`,
			);
		} catch (resendError) {
			console.error('❌ Resend failed, trying Gmail fallback:', resendError);
			await sendEmail(subscriber.email, emailSubject, emailContent);
			console.log(
				`📧 Email с первыми кандидатами отправлен через Gmail: ${subscriber.email}`,
			);
		}
	} catch (error) {
		console.error('❌ Ошибка при отправке первых кандидатов:', error);
		throw error;
	}
}

/**
 * Check if we should send notifications about new candidates
 * Only triggers when exactly 3 new candidates are added since last notification
 * This is the SINGLE source of truth for candidate notifications
 */
export async function checkAndSendNewCandidatesNotification() {
	try {
		console.log(
			'📧 Проверяем необходимость отправки уведомлений о новых кандидатах...',
		);

		// Get the current total count of active candidates
		const currentCandidateCount = await prisma.seeker.count({
			where: { isActive: true },
		});

		console.log(`📧 Всего активных кандидатов: ${currentCandidateCount}`);

		// Simple approach: only send notifications if we have exactly 3, 6, 9, etc. candidates
		// AND the most recent candidate was created recently (within last 5 minutes)
		const mostRecentCandidate = await prisma.seeker.findFirst({
			where: { isActive: true },
			orderBy: { createdAt: 'desc' },
		});

		if (!mostRecentCandidate) {
			console.log('📧 Нет кандидатов для уведомлений');
			return;
		}

		// Check if the most recent candidate was created recently (within last 5 minutes)
		const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
		const isRecent = mostRecentCandidate.createdAt > fiveMinutesAgo;

		if (!isRecent) {
			console.log(
				'📧 Последний кандидат был добавлен более 5 минут назад, уведомления уже отправлены',
			);
			return;
		}

		// Only send notification if total count is divisible by 3 AND candidate is recent
		if (
			currentCandidateCount > 0 &&
			currentCandidateCount % 3 === 0 &&
			isRecent
		) {
			console.log(
				`📧 Триггер отправки: ${currentCandidateCount} кандидатов (делится на 3) и кандидат недавний`,
			);

			// Get the 3 most recent candidates
			const recentCandidates = await prisma.seeker.findMany({
				where: { isActive: true },
				orderBy: { createdAt: 'desc' },
				take: 3,
			});

			if (recentCandidates.length > 0) {
				console.log(
					`📧 Отправляем уведомления о ${recentCandidates.length} новых кандидатах`,
				);
				await sendNewCandidatesNotification(recentCandidates);
				console.log(
					`📧 Уведомления отправлены для ${currentCandidateCount} кандидатов`,
				);
			}
		} else {
			console.log(
				`📧 Триггер не сработал: ${currentCandidateCount} кандидатов, недавний: ${isRecent}`,
			);
		}
	} catch (error) {
		console.error('❌ Ошибка при проверке триггера рассылки:', error);
	}
}

/**
 * Send notification about new candidates to all active subscribers
 */
async function sendNewCandidatesNotification(newCandidates) {
	try {
		console.log(
			'📧 Отправляем уведомления о новых кандидатах всем подписчикам...',
		);

		const subscribers = await prisma.newsletterSubscriber.findMany({
			where: { isActive: true },
		});

		if (subscribers.length === 0) {
			console.log('📧 Нет активных подписчиков для рассылки');
			return;
		}

		console.log(
			`📧 Отправляем уведомления ${subscribers.length} подписчикам о ${newCandidates.length} новых кандидатах`,
		);

		for (const subscriber of subscribers) {
			try {
				const filteredCandidates = filterCandidatesByPreferences(
					newCandidates,
					subscriber,
				);

				if (filteredCandidates.length > 0) {
					const emailContent = generateNewCandidatesNotificationEmail(
						filteredCandidates,
						subscriber,
					);
					const emailSubject = 'Новые соискатели добавлены на WorkNow';

					try {
						await resend.emails.send({
							from: 'WorkNow <onboarding@resend.dev>',
							to: subscriber.email,
							subject: emailSubject,
							html: emailContent,
						});
						console.log(
							`📧 Уведомление отправлено через Resend: ${subscriber.email}`,
						);
					} catch (resendError) {
						await sendEmail(subscriber.email, emailSubject, emailContent);
						console.log(
							`📧 Уведомление отправлено через Gmail: ${subscriber.email}`,
						);
					}
				}
			} catch (error) {
				console.error(
					`❌ Ошибка при отправке уведомления подписчику ${subscriber.email}:`,
					error,
				);
			}
		}

		console.log('📧 Рассылка уведомлений о новых кандидатах завершена');
	} catch (error) {
		console.error(
			'❌ Ошибка при отправке уведомлений о новых кандидатах:',
			error,
		);
		throw error;
	}
}

/**
 * Filter candidates based on subscriber preferences
 */
function filterCandidatesByPreferences(candidates, subscriber) {
	let filteredCandidates = [...candidates];

	if (subscriber.preferredCities && subscriber.preferredCities.length > 0) {
		filteredCandidates = filteredCandidates.filter((candidate) =>
			subscriber.preferredCities.some(
				(city) =>
					candidate.city &&
					candidate.city.toLowerCase().includes(city.toLowerCase()),
			),
		);
	}

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

	if (subscriber.preferredGender) {
		filteredCandidates = filteredCandidates.filter(
			(candidate) =>
				candidate.gender &&
				candidate.gender.toLowerCase() ===
					subscriber.preferredGender.toLowerCase(),
		);
	}

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
 * Generate email content for initial subscription (first 3 candidates)
 */
function generateInitialCandidatesEmail(candidates, subscriber) {
	const candidatesHtml = candidates
		.map(
			(candidate) => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">
        <strong>Соискатель:</strong> ${candidate.name} ${candidate.gender ? `${candidate.gender}` : ''}
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
      <title>Добро пожаловать на WorkNow!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background-color: #1976d2; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
          <h1 style="margin: 0; font-size: 24px;">WORKNOW</h1>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1976d2; margin: 0 0 10px 0;">
            Добро пожаловать, ${subscriberName}! Для вас найдено ${candidates.length} соискателей.
          </h2>
          <p style="margin: 5px 0; color: #666;">
            Это ваш первый email с кандидатами. В дальнейшем вы будете получать уведомления о новых соискателях каждые 3 добавленных кандидата.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">
            Обратите внимание на соискателей:
          </h3>
          ${candidatesHtml}
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
 * Generate email content for new candidates notification
 */
function generateNewCandidatesNotificationEmail(candidates, subscriber) {
	const candidatesHtml = candidates
		.map(
			(candidate) => `
    <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">
        <strong>Новый соискатель:</strong> ${candidate.name} ${candidate.gender ? `${candidate.gender}` : ''}
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
      <title>Новые соискатели добавлены</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background-color: #1976d2; color: white; text-align: center; padding: 20px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
          <h1 style="margin: 0; font-size: 24px;">WORKNOW</h1>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1976d2; margin: 0 0 10px 0;">
            Уважаемый/ая ${subscriberName}! На сайт добавлено ${candidates.length} новых соискателей.
          </h2>
          <p style="margin: 5px 0; color: #666;">
            Вы получаете это уведомление потому, что на сайт добавлено 3 новых кандидата.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 2px solid #1976d2; padding-bottom: 10px;">
            Новые соискатели:
          </h3>
          ${candidatesHtml}
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            Вы получаете эту рассылку потому, что подписаны на уведомления о новых соискателях.
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
