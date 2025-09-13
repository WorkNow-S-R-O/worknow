import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CancelSubscription from '../apps/client/src/components/CancelSubscription';

// Mock axios
vi.mock('axios', () => ({
	default: {
		get: vi.fn(() => Promise.resolve({ data: {} })),
		post: vi.fn(() => Promise.resolve({ data: {} })),
	},
}));

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		cancel_subscription_title: 'Cancel Subscription',
		no_active_subscription: 'No active subscription',
		sign_in_to_account: 'Sign In to Account',
		auto_renewal_disabled: 'Auto renewal disabled',
		enable_loading: 'Enabling...',
		renew_subscription: 'Renew Subscription',
		confirm_cancel_auto_renewal: 'Confirm cancel auto renewal',
		cancel_loading: 'Cancelling...',
		cancel_subscription_button: 'Cancel Subscription',
		no_premium_subscription: 'No premium subscription',
		error_cancel_subscription: 'Error cancelling subscription',
		error_renew_subscription: 'Error renewing subscription',
	}),
}));

// Mock Clerk hooks
vi.mock('@clerk/clerk-react', () => ({
	useUser: vi.fn(() => ({
		user: {
			id: 'user123',
			firstName: 'John',
			lastName: 'Doe',
			emailAddresses: [{ emailAddress: 'john@example.com' }],
		},
		isLoaded: true,
	})),
	useClerk: vi.fn(() => ({
		redirectToSignIn: vi.fn(),
	})),
}));

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
	value: {
		VITE_API_URL: 'http://localhost:3000',
	},
	writable: true,
});

describe('CancelSubscription Component', () => {
	describe('Basic Functionality', () => {
		it('renders the component', async () => {
			render(<CancelSubscription />);
			await waitFor(() => {
				expect(screen.getByText('Cancel Subscription')).toBeInTheDocument();
			});
		});

		it('renders container with proper styling', async () => {
			render(<CancelSubscription />);
			const container = screen.getByText('Cancel Subscription').closest('.container');
			await waitFor(() => {
				expect(container).toHaveClass('container');
				expect(container).toHaveStyle({ maxWidth: '480px', margin: '0 auto', paddingTop: '60px' });
			});
		});

		it('renders title', async () => {
			render(<CancelSubscription />);
			const title = screen.getByText('Cancel Subscription');
			await waitFor(() => {
				expect(title).toBeInTheDocument();
				expect(title).toHaveClass('text-center', 'mb-4');
			});
		});
	});

	describe('User Authentication States', () => {
		it('renders sign in prompt when user is not authenticated', async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: null,
				isLoaded: true,
			});

			render(<CancelSubscription />);

			await waitFor(() => {
				expect(screen.getByText('No active subscription')).toBeInTheDocument();
				expect(screen.getByText('Sign In to Account')).toBeInTheDocument();
			});
		});

		it('renders sign in button with proper styling', async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: null,
				isLoaded: true,
			});

			render(<CancelSubscription />);

			const signInButton = screen.getByText('Sign In to Account');
			await waitFor(() => {
				expect(signInButton).toHaveClass('btn', 'btn-primary', 'ms-2');
			});
		});

		it('calls redirectToSignIn when sign in button is clicked', async () => {
			const { useUser, useClerk } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: null,
				isLoaded: true,
			});

			const mockRedirectToSignIn = vi.fn();
			vi.mocked(useClerk).mockReturnValue({
				redirectToSignIn: mockRedirectToSignIn,
			});

			render(<CancelSubscription />);

			const signInButton = screen.getByText('Sign In to Account');
			fireEvent.click(signInButton);

			await waitFor(() => {
				expect(mockRedirectToSignIn).toHaveBeenCalledTimes(1);
			});
		});

		it('renders alert with proper styling when user is not authenticated', async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: null,
				isLoaded: true,
			});

			render(<CancelSubscription />);

			const alert = screen.getByText('No active subscription').closest('.alert');
			await waitFor(() => {
				expect(alert).toHaveClass('alert', 'alert-info', 'text-center');
				expect(alert).toHaveStyle({ background: '#d1f3fa' });
			});
		});
	});

	describe('Edge Cases', () => {
		it('handles component mounting and unmounting', async () => {
			const { unmount } = render(<CancelSubscription />);
			
			await waitFor(() => {
				expect(screen.getByText('Cancel Subscription')).toBeInTheDocument();
			});
			
			unmount();
		});

		it('handles user loading state', async () => {
			const { useUser } = await import('@clerk/clerk-react');
			vi.mocked(useUser).mockReturnValue({
				user: null,
				isLoaded: false,
			});

			render(<CancelSubscription />);

			await waitFor(() => {
				expect(screen.getByText('Cancel Subscription')).toBeInTheDocument();
			});
		});

		it('handles missing user data gracefully', async () => {
			const axios = await import('axios');
			vi.mocked(axios.default.get).mockResolvedValue({
				data: {
					// Missing isPremium and isAutoRenewal
				},
			});

			render(<CancelSubscription />);

			await waitFor(() => {
				expect(screen.getByText('Cancel Subscription')).toBeInTheDocument();
			});
		});
	});

	describe('Accessibility', () => {
		it('renders semantic button elements', async () => {
			render(<CancelSubscription />);

			const buttons = screen.getAllByRole('button');
			await waitFor(() => {
				expect(buttons.length).toBeGreaterThan(0);
			});
		});

		it('maintains proper text content', async () => {
			render(<CancelSubscription />);

			await waitFor(() => {
				expect(screen.getByText('Cancel Subscription')).toBeInTheDocument();
			});
		});

		it('provides meaningful button labels', async () => {
			render(<CancelSubscription />);

			const cancelButton = screen.getByText('Cancel Subscription');
			await waitFor(() => {
				expect(cancelButton).toBeInTheDocument();
			});
		});
	});
});