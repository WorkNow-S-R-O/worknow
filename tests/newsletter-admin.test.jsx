import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import NewsletterAdmin from '../apps/client/src/components/ui/NewsletterAdmin';

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: vi.fn(() => ({
		loading: { value: 'Loading...' },
		active: { value: 'Active' },
		inactive: { value: 'Inactive' },
	})),
}));

// Mock @clerk/clerk-react
vi.mock('@clerk/clerk-react', () => ({
	useUser: vi.fn(),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock axios
vi.mock('axios', () => ({
	default: {
		get: vi.fn(),
		post: vi.fn(),
	},
	get: vi.fn(),
	post: vi.fn(),
}));

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
	value: {
		VITE_API_URL: 'http://localhost:3001',
	},
	writable: true,
});

describe('NewsletterAdmin Component', () => {
	const mockSubscribers = [
		{
			id: 1,
			email: 'test1@example.com',
			firstName: 'John',
			lastName: 'Doe',
			createdAt: '2024-01-01T00:00:00Z',
			isActive: true,
		},
		{
			id: 2,
			email: 'test2@example.com',
			firstName: 'Jane',
			lastName: 'Smith',
			createdAt: '2024-01-02T00:00:00Z',
			isActive: false,
		},
	];

	const mockSeekers = [
		{
			id: 1,
			name: 'Candidate 1',
			contact: 'candidate1@example.com',
			city: 'Tel Aviv',
		},
		{
			id: 2,
			name: 'Candidate 2',
			contact: 'candidate2@example.com',
			city: 'Jerusalem',
		},
	];

	const adminUser = {
		emailAddresses: [{ emailAddress: 'worknow.notifications@gmail.com' }],
	};

	const nonAdminUser = {
		emailAddresses: [{ emailAddress: 'regular@example.com' }],
	};

	beforeEach(() => {
		vi.clearAllMocks();
		
		// Mock axios responses
		vi.mocked(axios.get).mockResolvedValue({
			data: {
				success: true,
				data: mockSubscribers,
			},
		});

		vi.mocked(axios.post).mockResolvedValue({
			data: {
				success: true,
				message: 'Newsletter sent successfully',
			},
		});
	});

	describe('Admin Access Control', () => {
		it('renders access denied message for non-admin users', async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: nonAdminUser,
				isLoaded: true,
				isSignedIn: true,
			});

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			expect(screen.getByText('Доступ запрещен')).toBeInTheDocument();
			expect(screen.getByText('Эта страница доступна только администраторам.')).toBeInTheDocument();
		});

		it('renders admin interface for admin users', async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: adminUser,
				isLoaded: true,
				isSignedIn: true,
			});

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			expect(screen.getByText('Управление рассылкой')).toBeInTheDocument();
			expect(screen.getByText('Подписчики (2)')).toBeInTheDocument();
			expect(screen.getByText('Отправка рассылки')).toBeInTheDocument();
		});
	});

	describe('Subscribers Management', () => {
		beforeEach(async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: adminUser,
				isLoaded: true,
				isSignedIn: true,
			});
		});

		it('fetches and displays subscribers on mount', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
				expect(screen.getByText('test2@example.com')).toBeInTheDocument();
			});

			expect(vi.mocked(axios.get)).toHaveBeenCalledWith(
				'http://localhost:3001/api/newsletter/subscribers'
			);
		});

		it('displays subscriber information correctly', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('John')).toBeInTheDocument();
				expect(screen.getByText('Jane')).toBeInTheDocument();
				expect(screen.getByText('Active')).toBeInTheDocument();
				expect(screen.getByText('Inactive')).toBeInTheDocument();
			});
		});

		it('shows loading state while fetching subscribers', async () => {
			// Mock a delayed response
			vi.mocked(axios.get).mockImplementation(() => 
				new Promise(resolve => setTimeout(() => resolve({
					data: { success: true, data: mockSubscribers }
				}), 100))
			);

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			expect(screen.getByText('Loading...')).toBeInTheDocument();
		});

		it('handles fetch subscribers error', async () => {
			vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('Подписчики (0)')).toBeInTheDocument();
			});
		});

		it('refreshes subscribers when refresh button is clicked', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const refreshButton = screen.getByText('Обновить список подписчиков');
			await act(async () => {
				fireEvent.click(refreshButton);
			});

			expect(vi.mocked(axios.get)).toHaveBeenCalledTimes(2);
		});
	});

	describe('Newsletter Sending', () => {
		beforeEach(async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: adminUser,
				isLoaded: true,
				isSignedIn: true,
			});

			// Mock seekers API response
			vi.mocked(axios.get).mockImplementation((url) => {
				if (url.includes('/api/newsletter/subscribers')) {
					return Promise.resolve({
						data: { success: true, data: mockSubscribers }
					});
				}
				if (url.includes('/api/seekers')) {
					return Promise.resolve({
						data: { seekers: mockSeekers }
					});
				}
				return Promise.resolve({ data: { success: true, data: [] } });
			});
		});

		it('sends test newsletter successfully', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const sendButton = screen.getByText('Отправить тестовую рассылку');
			await act(async () => {
				fireEvent.click(sendButton);
			});

			await waitFor(() => {
				expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
					'http://localhost:3001/api/newsletter/send',
					{
						candidates: mockSeekers,
						subject: 'Тестовая рассылка - Новые соискатели',
						customMessage: 'Это тестовая рассылка для проверки функциональности.',
					}
				);
			});
		});

		it('uses custom subject and message when provided', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const subjectInput = screen.getByPlaceholderText('Введите тему письма');
			const messageInput = screen.getByPlaceholderText('Введите дополнительное сообщение (необязательно)');

			await act(async () => {
				fireEvent.change(subjectInput, { target: { value: 'Custom Subject' } });
				fireEvent.change(messageInput, { target: { value: 'Custom Message' } });
			});

			const sendButton = screen.getByText('Отправить тестовую рассылку');
			await act(async () => {
				fireEvent.click(sendButton);
			});

			await waitFor(() => {
				expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
					'http://localhost:3001/api/newsletter/send',
					{
						candidates: mockSeekers,
						subject: 'Custom Subject',
						customMessage: 'Custom Message',
					}
				);
			});
		});

		it('disables send button when no subscribers', async () => {
			vi.mocked(axios.get).mockResolvedValue({
				data: { success: true, data: [] }
			});

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('Подписчики (0)')).toBeInTheDocument();
			});

			const sendButton = screen.getByText('Отправить тестовую рассылку');
			expect(sendButton).toBeDisabled();
		});

		it('shows sending state during newsletter sending', async () => {
			// Mock a delayed response
			vi.mocked(axios.post).mockImplementation(() => 
				new Promise(resolve => setTimeout(() => resolve({
					data: { success: true, message: 'Newsletter sent' }
				}), 100))
			);

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const sendButton = screen.getByText('Отправить тестовую рассылку');
			await act(async () => {
				fireEvent.click(sendButton);
			});

			expect(screen.getByText('Отправка...')).toBeInTheDocument();
		});

		it('handles newsletter sending error', async () => {
			vi.mocked(axios.post).mockRejectedValue(new Error('Send Error'));

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const sendButton = screen.getByText('Отправить тестовую рассылку');
			await act(async () => {
				fireEvent.click(sendButton);
			});

			await waitFor(() => {
				expect(screen.getByText('Отправить тестовую рассылку')).toBeInTheDocument();
			});
		});
	});

	describe('Automated Newsletter', () => {
		beforeEach(async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: adminUser,
				isLoaded: true,
				isSignedIn: true,
			});

			vi.mocked(axios.get).mockResolvedValue({
				data: { success: true, data: mockSubscribers }
			});
		});

		it('sends automated newsletter successfully', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const automatedButton = screen.getByText('Проверить и отправить автоматическую рассылку');
			await act(async () => {
				fireEvent.click(automatedButton);
			});

			await waitFor(() => {
				expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
					'http://localhost:3001/api/newsletter/check-and-send'
				);
			});
		});

		it('shows checking state during automated newsletter', async () => {
			// Mock a delayed response
			vi.mocked(axios.post).mockImplementation(() => 
				new Promise(resolve => setTimeout(() => resolve({
					data: { message: 'Automated newsletter sent' }
				}), 100))
			);

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const automatedButton = screen.getByText('Проверить и отправить автоматическую рассылку');
			await act(async () => {
				fireEvent.click(automatedButton);
			});

			expect(screen.getByText('Проверка...')).toBeInTheDocument();
		});

		it('handles automated newsletter error', async () => {
			vi.mocked(axios.post).mockRejectedValue(new Error('Automated Error'));

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const automatedButton = screen.getByText('Проверить и отправить автоматическую рассылку');
			await act(async () => {
				fireEvent.click(automatedButton);
			});

			await waitFor(() => {
				expect(screen.getByText('Проверить и отправить автоматическую рассылку')).toBeInTheDocument();
			});
		});
	});

	describe('Form Interactions', () => {
		beforeEach(async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: adminUser,
				isLoaded: true,
				isSignedIn: true,
			});

			vi.mocked(axios.get).mockResolvedValue({
				data: { success: true, data: mockSubscribers }
			});
		});

		it('handles subject input changes', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			const subjectInput = screen.getByPlaceholderText('Введите тему письма');
			await act(async () => {
				fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
			});

			expect(subjectInput.value).toBe('Test Subject');
		});

		it('handles custom message input changes', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			const messageInput = screen.getByPlaceholderText('Введите дополнительное сообщение (необязательно)');
			await act(async () => {
				fireEvent.change(messageInput, { target: { value: 'Test Message' } });
			});

			expect(messageInput.value).toBe('Test Message');
		});

		it('clears form fields after successful newsletter send', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const subjectInput = screen.getByPlaceholderText('Введите тему письма');
			const messageInput = screen.getByPlaceholderText('Введите дополнительное сообщение (необязательно)');

			await act(async () => {
				fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
				fireEvent.change(messageInput, { target: { value: 'Test Message' } });
			});

			// Mock seekers API response
			vi.mocked(axios.get).mockImplementation((url) => {
				if (url.includes('/api/newsletter/subscribers')) {
					return Promise.resolve({
						data: { success: true, data: mockSubscribers }
					});
				}
				if (url.includes('/api/seekers')) {
					return Promise.resolve({
						data: { seekers: mockSeekers }
					});
				}
				return Promise.resolve({ data: { success: true, data: [] } });
			});

			const sendButton = screen.getByText('Отправить тестовую рассылку');
			await act(async () => {
				fireEvent.click(sendButton);
			});

			await waitFor(() => {
				expect(subjectInput.value).toBe('');
				expect(messageInput.value).toBe('');
			});
		});
	});

	describe('Button States', () => {
		beforeEach(async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: adminUser,
				isLoaded: true,
				isSignedIn: true,
			});

			vi.mocked(axios.get).mockResolvedValue({
				data: { success: true, data: mockSubscribers }
			});
		});

		it('disables buttons during loading states', async () => {
			// Mock a delayed response
			vi.mocked(axios.post).mockImplementation(() => 
				new Promise(resolve => setTimeout(() => resolve({
					data: { success: true, message: 'Newsletter sent' }
				}), 100))
			);

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const sendButton = screen.getByText('Отправить тестовую рассылку');
			const automatedButton = screen.getByText('Проверить и отправить автоматическую рассылку');

			await act(async () => {
				fireEvent.click(sendButton);
			});

			expect(sendButton).toBeDisabled();
			expect(automatedButton).toBeDisabled();
		});

		it('enables refresh button when not loading', async () => {
			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('test1@example.com')).toBeInTheDocument();
			});

			const refreshButton = screen.getByText('Обновить список подписчиков');
			expect(refreshButton).not.toBeDisabled();
		});

		it('disables refresh button when loading', async () => {
			// Mock a delayed response
			vi.mocked(axios.get).mockImplementation(() => 
				new Promise(resolve => setTimeout(() => resolve({
					data: { success: true, data: mockSubscribers }
				}), 100))
			);

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			const refreshButton = screen.getByText('Обновление...');
			expect(refreshButton).toBeDisabled();
		});
	});

	describe('Error Handling', () => {
		beforeEach(async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: adminUser,
				isLoaded: true,
				isSignedIn: true,
			});
		});

		it('handles API errors gracefully', async () => {
			vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'));

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('Подписчики (0)')).toBeInTheDocument();
			});
		});

		it('handles empty subscribers response', async () => {
			vi.mocked(axios.get).mockResolvedValue({
				data: { success: true, data: [] }
			});

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('Подписчики (0)')).toBeInTheDocument();
			});

			const sendButton = screen.getByText('Отправить тестовую рассылку');
			expect(sendButton).toBeDisabled();
		});

		it('handles unsuccessful API responses', async () => {
			vi.mocked(axios.get).mockResolvedValue({
				data: { success: false, message: 'API Error' }
			});

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			await waitFor(() => {
				expect(screen.getByText('Подписчики (0)')).toBeInTheDocument();
			});
		});
	});

	describe('User Loading States', () => {
		it('handles user loading state', async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: null,
				isLoaded: false,
				isSignedIn: false,
			});

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			// Should not render admin interface while user is loading
			expect(screen.queryByText('Управление рассылкой')).not.toBeInTheDocument();
		});

		it('handles user not signed in', async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: null,
				isLoaded: true,
				isSignedIn: false,
			});

			await act(async () => {
				render(<NewsletterAdmin />);
			});

			expect(screen.getByText('Доступ запрещен')).toBeInTheDocument();
		});
	});
});
