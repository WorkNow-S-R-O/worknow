import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UserAuth from '../apps/client/src/components/ui/UserAuth';

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		signIn: { value: 'Sign In' },
	}),
}));

// Mock Clerk components
vi.mock('@clerk/clerk-react', () => ({
	SignedIn: ({ children }) => <div data-testid="signed-in">{children}</div>,
	SignedOut: ({ children }) => <div data-testid="signed-out">{children}</div>,
	SignInButton: ({ children }) => (
		<button data-testid="sign-in-button">{children}</button>
	),
	UserButton: () => <div data-testid="user-button">User Button</div>,
}));

describe('UserAuth Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Basic Functionality', () => {
		it('renders the component', () => {
			render(<UserAuth />);

			expect(screen.getByTestId('signed-out')).toBeInTheDocument();
			expect(screen.getByTestId('signed-in')).toBeInTheDocument();
		});

		it('renders sign in button', () => {
			render(<UserAuth />);

			const signInButton = screen.getByTestId('sign-in-button');
			expect(signInButton).toBeInTheDocument();
		});

		it('renders user button', () => {
			render(<UserAuth />);

			const userButton = screen.getByTestId('user-button');
			expect(userButton).toBeInTheDocument();
		});

		it('displays sign in text', () => {
			render(<UserAuth />);

			expect(screen.getByText('Sign In')).toBeInTheDocument();
		});

		it('renders person icon', () => {
			render(<UserAuth />);

			const icon = screen
				.getByText('Sign In')
				.closest('span')
				.querySelector('i');
			expect(icon).toHaveClass('bi', 'bi-person-circle', 'me-2');
		});
	});

	describe('Desktop vs Mobile Styling', () => {
		it('applies desktop styling by default', () => {
			render(<UserAuth />);

			const container = screen.getByTestId('signed-out').parentElement;
			expect(container).toHaveClass('d-flex', 'ml-5');

			const signInSpan = screen.getByText('Sign In').closest('span');
			expect(signInSpan).toHaveClass(
				'btn',
				'btn-primary',
				'd-flex',
				'align-items-center',
			);
			expect(signInSpan).not.toHaveClass('justify-content-center');
		});

		it('applies mobile styling when isMobile is true', () => {
			render(<UserAuth isMobile={true} />);

			const container = screen.getByTestId('signed-out').parentElement;
			expect(container).not.toHaveClass('d-flex', 'ml-5');

			const signInSpan = screen.getByText('Sign In').closest('span');
			expect(signInSpan).toHaveClass(
				'btn',
				'btn-primary',
				'd-flex',
				'align-items-center',
				'justify-content-center',
			);
		});

		it('handles isMobile prop correctly', () => {
			const { rerender } = render(<UserAuth isMobile={false} />);

			let container = screen.getByTestId('signed-out').parentElement;
			expect(container).toHaveClass('d-flex', 'ml-5');

			rerender(<UserAuth isMobile={true} />);

			container = screen.getByTestId('signed-out').parentElement;
			expect(container).not.toHaveClass('d-flex', 'ml-5');
		});
	});

	describe('Component Structure', () => {
		it('has proper container structure for desktop', () => {
			render(<UserAuth />);

			const container = screen.getByTestId('signed-out').parentElement;
			expect(container).toHaveClass('d-flex', 'ml-5');
		});

		it('has proper container structure for mobile', () => {
			render(<UserAuth isMobile={true} />);

			const container = screen.getByTestId('signed-out').parentElement;
			expect(container).not.toHaveClass('d-flex', 'ml-5');
		});

		it('renders both SignedIn and SignedOut components', () => {
			render(<UserAuth />);

			expect(screen.getByTestId('signed-in')).toBeInTheDocument();
			expect(screen.getByTestId('signed-out')).toBeInTheDocument();
		});
	});

	describe('Sign In Button', () => {
		it('has proper button styling for desktop', () => {
			render(<UserAuth />);

			const signInSpan = screen.getByText('Sign In').closest('span');
			expect(signInSpan).toHaveClass(
				'btn',
				'btn-primary',
				'd-flex',
				'align-items-center',
			);
		});

		it('has proper button styling for mobile', () => {
			render(<UserAuth isMobile={true} />);

			const signInSpan = screen.getByText('Sign In').closest('span');
			expect(signInSpan).toHaveClass(
				'btn',
				'btn-primary',
				'd-flex',
				'align-items-center',
				'justify-content-center',
			);
		});

		it('contains person icon', () => {
			render(<UserAuth />);

			const icon = screen
				.getByText('Sign In')
				.closest('span')
				.querySelector('i');
			expect(icon).toHaveClass('bi-person-circle');
		});

		it('contains sign in text', () => {
			render(<UserAuth />);

			expect(screen.getByText('Sign In')).toBeInTheDocument();
		});
	});

	describe('User Button', () => {
		it('renders user button component', () => {
			render(<UserAuth />);

			const userButton = screen.getByTestId('user-button');
			expect(userButton).toBeInTheDocument();
			expect(userButton).toHaveTextContent('User Button');
		});

		it('is wrapped in SignedIn component', () => {
			render(<UserAuth />);

			const signedInWrapper = screen.getByTestId('signed-in');
			const userButton = screen.getByTestId('user-button');

			expect(signedInWrapper).toContainElement(userButton);
		});
	});

	describe('Internationalization', () => {
		it('uses useIntlayer for sign in text', () => {
			render(<UserAuth />);

			expect(screen.getByText('Sign In')).toBeInTheDocument();
		});
	});

	describe('Props Handling', () => {
		it('defaults isMobile to false', () => {
			render(<UserAuth />);

			const container = screen.getByTestId('signed-out').parentElement;
			expect(container).toHaveClass('d-flex', 'ml-5');
		});

		it('accepts isMobile prop', () => {
			render(<UserAuth isMobile={true} />);

			const container = screen.getByTestId('signed-out').parentElement;
			expect(container).not.toHaveClass('d-flex', 'ml-5');
		});

		it('handles undefined isMobile prop', () => {
			render(<UserAuth isMobile={undefined} />);

			const container = screen.getByTestId('signed-out').parentElement;
			expect(container).toHaveClass('d-flex', 'ml-5');
		});

		it('handles null isMobile prop', () => {
			render(<UserAuth isMobile={null} />);

			const container = screen.getByTestId('signed-out').parentElement;
			expect(container).toHaveClass('d-flex', 'ml-5');
		});
	});

	describe('Styling Classes', () => {
		it('applies correct Bootstrap classes', () => {
			render(<UserAuth />);

			const signInSpan = screen.getByText('Sign In').closest('span');
			expect(signInSpan).toHaveClass('btn', 'btn-primary');
		});

		it('applies flexbox classes', () => {
			render(<UserAuth />);

			const signInSpan = screen.getByText('Sign In').closest('span');
			expect(signInSpan).toHaveClass('d-flex', 'align-items-center');
		});

		it('applies mobile-specific justify-content-center', () => {
			render(<UserAuth isMobile={true} />);

			const signInSpan = screen.getByText('Sign In').closest('span');
			expect(signInSpan).toHaveClass('justify-content-center');
		});

		it('applies icon margin classes', () => {
			render(<UserAuth />);

			const icon = screen
				.getByText('Sign In')
				.closest('span')
				.querySelector('i');
			expect(icon).toHaveClass('me-2');
		});
	});

	describe('Component Integration', () => {
		it('integrates with Clerk components', () => {
			render(<UserAuth />);

			expect(screen.getByTestId('signed-in')).toBeInTheDocument();
			expect(screen.getByTestId('signed-out')).toBeInTheDocument();
			expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
			expect(screen.getByTestId('user-button')).toBeInTheDocument();
		});

		it('renders all child components', () => {
			render(<UserAuth />);

			expect(screen.getByTestId('signed-out')).toBeInTheDocument();
			expect(screen.getByTestId('sign-in-button')).toBeInTheDocument();
			expect(screen.getByTestId('signed-in')).toBeInTheDocument();
			expect(screen.getByTestId('user-button')).toBeInTheDocument();
		});
	});

	describe('Edge Cases', () => {
		it('handles component mounting and unmounting', () => {
			const { unmount } = render(<UserAuth />);

			expect(screen.getByTestId('signed-out')).toBeInTheDocument();

			unmount();

			expect(screen.queryByTestId('signed-out')).not.toBeInTheDocument();
		});

		it('handles boolean isMobile values', () => {
			const { rerender } = render(<UserAuth isMobile={false} />);

			let container = screen.getByTestId('signed-out').parentElement;
			expect(container).toHaveClass('d-flex', 'ml-5');

			rerender(<UserAuth isMobile={true} />);

			container = screen.getByTestId('signed-out').parentElement;
			expect(container).not.toHaveClass('d-flex', 'ml-5');
		});
	});

	describe('Accessibility', () => {
		it('renders semantic button elements', () => {
			render(<UserAuth />);

			const signInButton = screen.getByTestId('sign-in-button');
			expect(signInButton).toBeInTheDocument();
		});

		it('has proper icon structure', () => {
			render(<UserAuth />);

			const icon = screen
				.getByText('Sign In')
				.closest('span')
				.querySelector('i');
			expect(icon).toHaveClass('bi-person-circle');
		});

		it('maintains proper text content', () => {
			render(<UserAuth />);

			expect(screen.getByText('Sign In')).toBeInTheDocument();
		});
	});
});
