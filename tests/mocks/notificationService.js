import { vi } from 'vitest';

// Mock Prisma client
export const mockPrisma = {
	user: {
		findMany: vi.fn(),
	},
};

// Mock email utility
export const mockSendEmail = vi.fn();

// Mock console methods
export const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
export const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock user data
export const mockUserData = {
	userWithFullName: {
		id: 'user1',
		email: 'john.doe@example.com',
		firstName: 'John',
		lastName: 'Doe',
		clerkUserId: 'clerk_user1',
	},
	
	userWithFirstNameOnly: {
		id: 'user2',
		email: 'jane@example.com',
		firstName: 'Jane',
		lastName: null,
		clerkUserId: 'clerk_user2',
	},
	
	userWithLastNameOnly: {
		id: 'user3',
		email: 'smith@example.com',
		firstName: null,
		lastName: 'Smith',
		clerkUserId: 'clerk_user3',
	},
	
	userWithNoName: {
		id: 'user4',
		email: 'anonymous@example.com',
		firstName: null,
		lastName: null,
		clerkUserId: 'clerk_user4',
	},
	
	userWithEmptyName: {
		id: 'user5',
		email: 'empty@example.com',
		firstName: '',
		lastName: '',
		clerkUserId: 'clerk_user5',
	},
};

// Mock seeker data
export const mockSeekerData = {
	seekerWithAllFields: {
		id: 1,
		name: 'Иван Петров',
		city: 'Тель-Авив',
		description: 'Опытный разработчик с 5-летним стажем работы в IT-сфере.',
		category: 'IT',
		employment: 'Полная занятость',
		languages: ['Русский', 'Английский', 'Иврит'],
		isDemanded: true,
		contact: '+972-50-123-4567',
		facebook: 'https://facebook.com/ivan.petrov',
		nativeLanguage: 'Русский',
		documents: 'Паспорт, виза',
		note: 'Готов к переезду',
		announcement: 'Ищу работу в IT-компании',
		documentType: 'Паспорт',
	},
	
	seekerWithMinimalFields: {
		id: 2,
		name: 'Мария Сидорова',
		city: 'Иерусалим',
		description: 'Ищу работу в сфере обслуживания.',
		category: null,
		employment: null,
		languages: [],
		isDemanded: false,
		contact: '+972-50-987-6543',
		facebook: null,
		nativeLanguage: null,
		documents: null,
		note: null,
		announcement: null,
		documentType: null,
	},
	
	seekerWithPartialFields: {
		id: 3,
		name: 'Александр Козлов',
		city: 'Хайфа',
		description: 'Специалист по маркетингу.',
		category: 'Маркетинг',
		employment: 'Частичная занятость',
		languages: ['Русский', 'Английский'],
		isDemanded: false,
		contact: '+972-50-555-1234',
		facebook: 'https://facebook.com/alex.kozlov',
		nativeLanguage: 'Русский',
		documents: 'Паспорт',
		note: 'Опыт работы 3 года',
		announcement: 'Ищу работу в маркетинговом агентстве',
		documentType: 'Паспорт',
	},
	
	seekerWithSpecialCharacters: {
		id: 4,
		name: 'Ольга & Петр',
		city: 'Беэр-Шева',
		description: 'Семейная пара ищет работу. Ольга - бухгалтер, Петр - водитель.',
		category: 'Бухгалтерия',
		employment: 'Полная занятость',
		languages: ['Русский'],
		isDemanded: true,
		contact: '+972-50-777-8888',
		facebook: null,
		nativeLanguage: 'Русский',
		documents: 'Паспорта, визы',
		note: 'Готовы к переезду',
		announcement: 'Ищем работу в одном городе',
		documentType: 'Паспорт',
	},
	
	seekerWithLongDescription: {
		id: 5,
		name: 'Елена Васильева',
		city: 'Нетания',
		description: 'Опытный менеджер по продажам с большим опытом работы в различных отраслях. Имею опыт работы с клиентами, ведения переговоров, заключения сделок. Готова к работе в команде и самостоятельной работе. Стрессоустойчива, коммуникабельна, ответственная.',
		category: 'Продажи',
		employment: 'Полная занятость',
		languages: ['Русский', 'Английский', 'Иврит', 'Арабский'],
		isDemanded: true,
		contact: '+972-50-999-0000',
		facebook: 'https://facebook.com/elena.vasilieva',
		nativeLanguage: 'Русский',
		documents: 'Паспорт, виза, диплом',
		note: 'Готова к командировкам',
		announcement: 'Ищу работу в сфере продаж',
		documentType: 'Паспорт',
	},
};

// Mock user arrays
export const mockUserArrays = {
	emptyUsers: [],
	
	singleUser: [mockUserData.userWithFullName],
	
	multipleUsers: [
		mockUserData.userWithFullName,
		mockUserData.userWithFirstNameOnly,
		mockUserData.userWithLastNameOnly,
		mockUserData.userWithNoName,
		mockUserData.userWithEmptyName,
	],
	
	usersWithNames: [
		mockUserData.userWithFullName,
		mockUserData.userWithFirstNameOnly,
		mockUserData.userWithLastNameOnly,
	],
	
	usersWithoutNames: [
		mockUserData.userWithNoName,
		mockUserData.userWithEmptyName,
	],
};

// Mock seeker arrays
export const mockSeekerArrays = {
	emptySeekers: [],
	
	singleSeeker: [mockSeekerData.seekerWithAllFields],
	
	multipleSeekers: [
		mockSeekerData.seekerWithAllFields,
		mockSeekerData.seekerWithMinimalFields,
		mockSeekerData.seekerWithPartialFields,
		mockSeekerData.seekerWithSpecialCharacters,
		mockSeekerData.seekerWithLongDescription,
	],
	
	seekersWithAllFields: [
		mockSeekerData.seekerWithAllFields,
		mockSeekerData.seekerWithPartialFields,
		mockSeekerData.seekerWithSpecialCharacters,
		mockSeekerData.seekerWithLongDescription,
	],
	
	seekersWithMinimalFields: [
		mockSeekerData.seekerWithMinimalFields,
	],
	
	demandedSeekers: [
		mockSeekerData.seekerWithAllFields,
		mockSeekerData.seekerWithSpecialCharacters,
		mockSeekerData.seekerWithLongDescription,
	],
	
	nonDemandedSeekers: [
		mockSeekerData.seekerWithMinimalFields,
		mockSeekerData.seekerWithPartialFields,
	],
};

// Mock email content
export const mockEmailContent = {
	subject: 'Новые соискатели на WorkNow - 1 новых кандидатов',
	
	htmlTemplate: `
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
          Мы рады сообщить, что на платформе WorkNow появились <strong>1 новых соискателей</strong>, 
          которые ищут работу в Израиле.
        </p>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 10px 0; color: #1976d2;">Новые кандидаты:</h3>
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <h3 style="margin: 0 0 10px 0; color: #1976d2;">Иван Петров</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Город:</strong> Тель-Авив</p>
            <p style="margin: 5px 0; color: #666;"><strong>Описание:</strong> Опытный разработчик с 5-летним стажем работы в IT-сфере.</p>
            <p style="margin: 5px 0; color: #666;"><strong>Категория:</strong> IT</p>
            <p style="margin: 5px 0; color: #666;"><strong>Тип занятости:</strong> Полная занятость</p>
            <p style="margin: 5px 0; color: #666;"><strong>Языки:</strong> Русский, Английский, Иврит</p>
            <p style="margin: 5px 0; color: #ff6b35; font-weight: bold;">⭐ Востребованный кандидат</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/seekers" 
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
  `,
	
	htmlWithMultipleSeekers: `
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
          Мы рады сообщить, что на платформе WorkNow появились <strong>3 новых соискателей</strong>, 
          которые ищут работу в Израиле.
        </p>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="margin: 0 0 10px 0; color: #1976d2;">Новые кандидаты:</h3>
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <h3 style="margin: 0 0 10px 0; color: #1976d2;">Иван Петров</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Город:</strong> Тель-Авив</p>
            <p style="margin: 5px 0; color: #666;"><strong>Описание:</strong> Опытный разработчик с 5-летним стажем работы в IT-сфере.</p>
            <p style="margin: 5px 0; color: #666;"><strong>Категория:</strong> IT</p>
            <p style="margin: 5px 0; color: #666;"><strong>Тип занятости:</strong> Полная занятость</p>
            <p style="margin: 5px 0; color: #666;"><strong>Языки:</strong> Русский, Английский, Иврит</p>
            <p style="margin: 5px 0; color: #ff6b35; font-weight: bold;">⭐ Востребованный кандидат</p>
          </div>
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <h3 style="margin: 0 0 10px 0; color: #1976d2;">Мария Сидорова</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Город:</strong> Иерусалим</p>
            <p style="margin: 5px 0; color: #666;"><strong>Описание:</strong> Ищу работу в сфере обслуживания.</p>
          </div>
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <h3 style="margin: 0 0 10px 0; color: #1976d2;">Александр Козлов</h3>
            <p style="margin: 5px 0; color: #666;"><strong>Город:</strong> Хайфа</p>
            <p style="margin: 5px 0; color: #666;"><strong>Описание:</strong> Специалист по маркетингу.</p>
            <p style="margin: 5px 0; color: #666;"><strong>Категория:</strong> Маркетинг</p>
            <p style="margin: 5px 0; color: #666;"><strong>Тип занятости:</strong> Частичная занятость</p>
            <p style="margin: 5px 0; color: #666;"><strong>Языки:</strong> Русский, Английский</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/seekers" 
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
  `,
};

// Mock email sending results
export const mockEmailResults = {
	successfulEmail: {
		success: true,
		email: 'john.doe@example.com',
	},
	
	failedEmail: {
		success: false,
		email: 'failed@example.com',
		error: 'SMTP connection failed',
	},
	
	mixedResults: [
		{ status: 'fulfilled', value: { success: true, email: 'user1@example.com' } },
		{ status: 'fulfilled', value: { success: true, email: 'user2@example.com' } },
		{ status: 'rejected', reason: { success: false, email: 'user3@example.com', error: 'SMTP error' } },
		{ status: 'fulfilled', value: { success: true, email: 'user4@example.com' } },
	],
	
	allSuccessful: [
		{ status: 'fulfilled', value: { success: true, email: 'user1@example.com' } },
		{ status: 'fulfilled', value: { success: true, email: 'user2@example.com' } },
		{ status: 'fulfilled', value: { success: true, email: 'user3@example.com' } },
	],
	
	allFailed: [
		{ status: 'rejected', reason: { success: false, email: 'user1@example.com', error: 'SMTP error' } },
		{ status: 'rejected', reason: { success: false, email: 'user2@example.com', error: 'SMTP error' } },
		{ status: 'rejected', reason: { success: false, email: 'user3@example.com', error: 'SMTP error' } },
	],
};

// Mock service responses
export const mockServiceResponses = {
	successfulNotification: {
		totalUsers: 3,
		successful: 3,
		failed: 0,
		newCandidates: 1,
	},
	
	partialSuccessNotification: {
		totalUsers: 4,
		successful: 3,
		failed: 1,
		newCandidates: 2,
	},
	
	failedNotification: {
		totalUsers: 2,
		successful: 0,
		failed: 2,
		newCandidates: 1,
	},
	
	noUsersNotification: {
		totalUsers: 0,
		successful: 0,
		failed: 0,
		newCandidates: 1,
	},
};

// Mock errors
export const mockErrors = {
	databaseError: new Error('Database connection failed'),
	emailError: new Error('SMTP connection failed'),
	prismaError: new Error('Prisma query failed'),
	timeoutError: new Error('Request timeout'),
	validationError: new Error('Validation failed'),
	networkError: new Error('Network error'),
	permissionError: new Error('Access denied'),
	configurationError: new Error('Configuration error'),
};

// Mock error messages
export const mockErrorMessages = {
	notificationError: 'Error sending new candidates notifications',
	emailSendError: 'Failed to send email to',
	databaseError: 'Database connection failed',
	prismaError: 'Prisma query failed',
	timeoutError: 'Request timeout',
	validationError: 'Validation failed',
	networkError: 'Network error',
	permissionError: 'Access denied',
	configurationError: 'Configuration error',
};

// Mock success messages
export const mockSuccessMessages = {
	notificationStarted: 'Starting to send notifications for',
	newCandidates: 'new candidates',
	usersFound: 'Found',
	usersToNotify: 'users to notify',
	noUsersFound: 'No users found to notify',
	emailSent: 'Email sent to',
	successfullySent: 'Successfully sent',
	notifications: 'notifications',
	failedToSend: 'Failed to send',
	notificationsFailed: 'notifications',
};

// Mock console log data
export const mockConsoleLogData = {
	notificationStarted: '📧 Starting to send notifications for',
	newCandidates: 'new candidates',
	usersFound: '👥 Found',
	usersToNotify: 'users to notify',
	noUsersFound: '⚠️ No users found to notify',
	emailSent: '✅ Email sent to',
	successfullySent: '✅ Successfully sent',
	notifications: 'notifications',
	failedToSend: '❌ Failed to send',
	notificationsFailed: 'notifications',
	errorSending: '❌ Error sending new candidates notifications:',
	emailFailed: '❌ Failed to send email to',
};

// Mock environment variables
export const mockEnvironmentVariables = {
	frontendUrl: 'http://localhost:3000',
	productionUrl: 'https://worknow.com',
	stagingUrl: 'https://staging.worknow.com',
	missingUrl: undefined,
};

// Mock email generation logic
export const mockEmailGenerationLogic = {
	generateSubject: (seekerCount) => `Новые соискатели на WorkNow - ${seekerCount} новых кандидатов`,
	
	generateCandidateList: (seekers) => {
		return seekers.map(seeker => {
			let html = `
				<div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
					<h3 style="margin: 0 0 10px 0; color: #1976d2;">${seeker.name}</h3>
					<p style="margin: 5px 0; color: #666;"><strong>Город:</strong> ${seeker.city}</p>
					<p style="margin: 5px 0; color: #666;"><strong>Описание:</strong> ${seeker.description}</p>`;
			
			if (seeker.category) {
				html += `<p style="margin: 5px 0; color: #666;"><strong>Категория:</strong> ${seeker.category}</p>`;
			}
			
			if (seeker.employment) {
				html += `<p style="margin: 5px 0; color: #666;"><strong>Тип занятости:</strong> ${seeker.employment}</p>`;
			}
			
			if (seeker.languages && seeker.languages.length > 0) {
				html += `<p style="margin: 5px 0; color: #666;"><strong>Языки:</strong> ${seeker.languages.join(', ')}</p>`;
			}
			
			if (seeker.isDemanded) {
				html += '<p style="margin: 5px 0; color: #ff6b35; font-weight: bold;">⭐ Востребованный кандидат</p>';
			}
			
			html += '</div>';
			return html;
		}).join('');
	},
	
	generateUserName: (user) => {
		if (user.firstName && user.lastName) {
			return `${user.firstName} ${user.lastName}`;
		}
		if (user.firstName) {
			return user.firstName;
		}
		if (user.lastName) {
			return user.lastName;
		}
		return 'Пользователь';
	},
	
	replaceUserName: (html, userName) => {
		return html.replace('{{userName}}', userName);
	},
};

// Mock Prisma query options
export const mockPrismaQueryOptions = {
	findMany: {
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			clerkUserId: true,
		},
	},
};

// Mock data type conversions
export const mockDataConversions = {
	string: {
		subject: 'Новые соискатели на WorkNow - 1 новых кандидатов',
		html: '<html>...</html>',
		userName: 'John Doe',
		seekerName: 'Иван Петров',
		city: 'Тель-Авив',
		description: 'Опытный разработчик',
	},
	
	number: {
		seekerCount: 1,
		userCount: 3,
		successfulCount: 3,
		failedCount: 0,
	},
	
	boolean: {
		isDemanded: true,
		success: true,
		hasCategory: true,
		hasEmployment: true,
		hasLanguages: true,
	},
	
	array: {
		languages: ['Русский', 'Английский', 'Иврит'],
		seekers: [mockSeekerData.seekerWithAllFields],
		users: [mockUserData.userWithFullName],
		results: [mockEmailResults.successfulEmail],
	},
};

// Mock HTML generation logic
export const mockHtmlGenerationLogic = {
	generateCandidateCard: (seeker) => {
		let html = `
			<div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
				<h3 style="margin: 0 0 10px 0; color: #1976d2;">${seeker.name}</h3>
				<p style="margin: 5px 0; color: #666;"><strong>Город:</strong> ${seeker.city}</p>
				<p style="margin: 5px 0; color: #666;"><strong>Описание:</strong> ${seeker.description}</p>`;
		
		if (seeker.category) {
			html += `<p style="margin: 5px 0; color: #666;"><strong>Категория:</strong> ${seeker.category}</p>`;
		}
		
		if (seeker.employment) {
			html += `<p style="margin: 5px 0; color: #666;"><strong>Тип занятости:</strong> ${seeker.employment}</p>`;
		}
		
		if (seeker.languages && seeker.languages.length > 0) {
			html += `<p style="margin: 5px 0; color: #666;"><strong>Языки:</strong> ${seeker.languages.join(', ')}</p>`;
		}
		
		if (seeker.isDemanded) {
			html += '<p style="margin: 5px 0; color: #ff6b35; font-weight: bold;">⭐ Востребованный кандидат</p>';
		}
		
		html += '</div>';
		return html;
	},
	
	generateEmailTemplate: (seekerCount, candidatesList) => {
		return `
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
						Мы рады сообщить, что на платформе WorkNow появились <strong>${seekerCount} новых соискателей</strong>, 
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
	},
};

// Reset mocks before each test
export const resetNotificationServiceMocks = () => {
	mockPrisma.user.findMany.mockClear();
	mockSendEmail.mockClear();
	mockConsoleLog.mockClear();
	mockConsoleError.mockClear();
	vi.clearAllMocks();
};
