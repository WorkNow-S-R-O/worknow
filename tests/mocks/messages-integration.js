import { vi } from 'vitest';

// Mock Prisma Client
export const mockPrismaInstance = {
	message: {
		create: vi.fn(),
		findMany: vi.fn(),
		findUnique: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
	user: {
		findUnique: vi.fn(),
		findMany: vi.fn(),
	},
};

vi.mock('@prisma/client', () => ({
	PrismaClient: vi.fn(() => mockPrismaInstance),
}));

// Mock mailer utility
export const mockSendEmail = vi.fn();

vi.mock('../../apps/api/utils/mailer.js', () => ({
	sendEmail: mockSendEmail,
}));

// Mock admin middleware
export const mockRequireAdmin = vi.fn((req, res, next) => {
	// Check if user is admin (simplified for testing)
	const isAdmin = req.headers['x-admin'] === 'true';
	
	if (!isAdmin) {
		return res.status(403).json({ 
			error: 'Доступ запрещен. Требуются права администратора.' 
		});
	}
	
	req.user = {
		id: 'admin_123',
		isAdmin: true,
		clerkUserId: 'admin_clerk_123',
	};
	next();
});

vi.mock('../../apps/api/middlewares/auth.js', () => ({
	requireAdmin: mockRequireAdmin,
}));

// Mock data
export const mockMessageData = {
	id: 'msg_123456789',
	clerkUserId: 'user_123456789',
	title: 'Test Message',
	body: 'This is a test message',
	type: 'system',
	isRead: false,
	fromAdminId: null,
	createdAt: '2024-01-01T00:00:00.000Z',
	updatedAt: '2024-01-01T00:00:00.000Z',
};

export const mockUserData = {
	id: 'user_123456789',
	clerkUserId: 'user_123456789',
	email: 'test@example.com',
	firstName: 'John',
	lastName: 'Doe',
	isAdmin: false,
};

export const mockAdminUserData = {
	id: 'admin_123456789',
	clerkUserId: 'admin_clerk_123',
	email: 'admin@example.com',
	firstName: 'Admin',
	lastName: 'User',
	isAdmin: true,
};

export const mockMessagesList = [
	{
		id: 'msg_123456789',
		clerkUserId: 'user_123456789',
		title: 'Welcome Message',
		body: 'Welcome to our platform!',
		type: 'system',
		isRead: false,
		fromAdminId: null,
		createdAt: '2024-01-01T00:00:00.000Z',
	},
	{
		id: 'msg_123456790',
		clerkUserId: 'user_123456789',
		title: 'Update Notification',
		body: 'Your profile has been updated.',
		type: 'admin',
		isRead: true,
		fromAdminId: 'admin_clerk_123',
		createdAt: '2024-01-02T00:00:00.000Z',
	},
];

export const mockUsersList = [
	mockUserData,
	{
		id: 'user_123456790',
		clerkUserId: 'user_123456790',
		email: 'user2@example.com',
		firstName: 'Jane',
		lastName: 'Smith',
		isAdmin: false,
	},
	{
		id: 'user_123456791',
		clerkUserId: 'user_123456791',
		email: 'user3@example.com',
		firstName: 'Bob',
		lastName: 'Johnson',
		isAdmin: false,
	},
];

export const mockServiceResponses = {
	createMessageSuccess: {
		success: true,
		message: mockMessageData,
	},
	createMessageError: {
		error: 'Ошибка создания сообщения',
	},
	getUserMessagesSuccess: {
		messages: mockMessagesList,
	},
	getUserMessagesError: {
		error: 'Ошибка получения сообщений',
	},
	markMessageReadSuccess: {
		success: true,
		message: { ...mockMessageData, isRead: true },
	},
	markMessageReadError: {
		error: 'Ошибка отметки сообщения',
	},
	broadcastMessageSuccess: {
		success: true,
		count: 3,
	},
	broadcastMessageError: {
		error: 'Ошибка рассылки',
	},
	deleteMessageSuccess: {
		success: true,
		message: 'Сообщение удалено',
	},
	deleteMessageNotFound: {
		error: 'Сообщение не найдено',
	},
	deleteMessageError: {
		error: 'Ошибка удаления сообщения',
	},
};

export const mockErrors = {
	validationError: 'Validation failed',
	notFoundError: 'Message not found',
	unauthorizedError: 'Unauthorized access',
	forbiddenError: 'Доступ запрещен. Требуются права администратора.',
	serverError: 'Internal server error',
	emailError: 'Email sending failed',
	databaseError: 'Database connection failed',
};

export const mockEmailResponses = {
	success: {
		messageId: 'email_123456789',
		response: 'Email sent successfully',
	},
	error: new Error('SMTP connection failed'),
};

// Reset mocks function
export const resetMessagesMocks = () => {
	mockPrismaInstance.message.create.mockClear();
	mockPrismaInstance.message.findMany.mockClear();
	mockPrismaInstance.message.findUnique.mockClear();
	mockPrismaInstance.message.update.mockClear();
	mockPrismaInstance.message.delete.mockClear();
	mockPrismaInstance.user.findUnique.mockClear();
	mockPrismaInstance.user.findMany.mockClear();
	mockSendEmail.mockClear();
	mockRequireAdmin.mockClear();
	vi.clearAllMocks();
};

