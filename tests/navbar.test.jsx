import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { Navbar } from '@/components';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
		useLocation: () => ({
			pathname: '/',
			search: '',
			hash: '',
			state: null,
			key: 'default',
		}),
		useNavigate: () => mockNavigate,
	};
});

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		vacancies: { value: 'Vacancies' },
		seekers: { value: 'Seekers' },
		jobs: { value: 'My Jobs' },
		support: { value: 'Support' },
		rules: { value: 'Rules' },
		technicalSupport: { value: 'Technical Support' },
		billing: { value: 'Billing' },
		signIn: { value: 'Sign In' },
	}),
}));

// Mock useLanguageManager hook
vi.mock('@/hooks/useLanguageManager', () => ({
	useLanguageManager: () => ({
		clearLanguagePreference: vi.fn(),
		changeLanguage: vi.fn(),
		isLoading: false,
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

// Mock UI components
vi.mock('@/components/ui/premium-button', () => ({
	default: () => <div data-testid="premium-button">Premium Button</div>,
}));

vi.mock('@/components/ui/LanguageSelector', () => ({
	default: () => <div data-testid="language-selector">Language Selector</div>,
}));

vi.mock('@/components/ui/UserAuth', () => ({
	default: () => <div data-testid="user-auth">User Auth</div>,
}));

vi.mock('@/components/ui/MobileNavbarHeader', () => ({
	default: ({ isExpanded, setIsExpanded }) => (
		<div data-testid="mobile-navbar-header">
			<div data-testid="mobile-expanded">
				{isExpanded ? 'expanded' : 'collapsed'}
			</div>
			<button
				data-testid="mobile-toggle"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				Toggle Mobile
			</button>
		</div>
	),
}));

vi.mock('../apps/client/src/components/ui/Logo', () => ({
	default: () => <div data-testid="logo">Logo</div>,
}));

vi.mock('../apps/client/src/components/ui/MailDropdown', () => ({
	default: () => <div data-testid="mail-dropdown">Mail Dropdown</div>,
}));

// Mock Bootstrap
vi.mock('bootstrap/dist/js/bootstrap.bundle.min.js', () => ({}));

const renderWithRouter = (component) => {
	return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Clear window object
		delete window.resetLanguageDetection;
	});

	describe('Basic Functionality', () => {
		it('renders the component', () => {
			renderWithRouter(<Navbar />);

			expect(screen.getByTestId('logo')).toBeInTheDocument();
			expect(screen.getByTestId('language-selector')).toBeInTheDocument();
			expect(screen.getByTestId('premium-button')).toBeInTheDocument();
			expect(screen.getByTestId('user-auth')).toBeInTheDocument();
		});

		it('renders desktop navigation links', () => {
			renderWithRouter(<Navbar />);

			expect(screen.getByText('Vacancies')).toBeInTheDocument();
			expect(screen.getByText('Seekers')).toBeInTheDocument();
			expect(screen.getByText('My Jobs')).toBeInTheDocument();
			expect(screen.getByText('Support')).toBeInTheDocument();
		});

		it('renders mobile navbar header', () => {
			renderWithRouter(<Navbar />);

			expect(screen.getByTestId('mobile-navbar-header')).toBeInTheDocument();
		});

		it('has proper navigation structure', () => {
			renderWithRouter(<Navbar />);

			// Check for navigation links
			const vacanciesLink = screen.getByRole('link', { name: 'Vacancies' });
			const seekersLink = screen.getByRole('link', { name: 'Seekers' });
			const jobsLink = screen.getByRole('link', { name: 'My Jobs' });

			expect(vacanciesLink).toHaveAttribute('href', '/');
			expect(seekersLink).toHaveAttribute('href', '/seekers');
			expect(jobsLink).toHaveAttribute('href', '/my-advertisements');
		});
	});

	describe('Support Dropdown', () => {
		it('renders support dropdown button', () => {
			renderWithRouter(<Navbar />);

			const supportButton = screen.getByRole('button', { name: 'Support' });
			expect(supportButton).toBeInTheDocument();
			expect(supportButton).toHaveAttribute('data-bs-toggle', 'dropdown');
		});

		it('renders support dropdown menu items', () => {
			renderWithRouter(<Navbar />);

			expect(screen.getByText('Rules')).toBeInTheDocument();
			expect(screen.getByText('Technical Support')).toBeInTheDocument();
			expect(screen.getByText('Billing')).toBeInTheDocument();
		});

		it('has proper support links', () => {
			renderWithRouter(<Navbar />);

			const rulesLink = screen.getByRole('link', { name: 'Rules' });
			const supportLink = screen.getByRole('link', {
				name: 'Technical Support',
			});
			const billingLink = screen.getByRole('link', { name: 'Billing' });

			expect(rulesLink).toHaveAttribute(
				'href',
				'https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca',
			);
			expect(rulesLink).toHaveAttribute('target', '_blank');
			expect(supportLink).toHaveAttribute('href', '/support');
			expect(billingLink).toHaveAttribute('href', '/billing');
		});
	});

	describe('Component Integration', () => {
		it('renders all UI components', () => {
			renderWithRouter(<Navbar />);

			expect(screen.getByTestId('logo')).toBeInTheDocument();
			expect(screen.getByTestId('language-selector')).toBeInTheDocument();
			expect(screen.getByTestId('premium-button')).toBeInTheDocument();
			expect(screen.getByTestId('user-auth')).toBeInTheDocument();
			expect(screen.getByTestId('mail-dropdown')).toBeInTheDocument();
			expect(screen.getByTestId('mobile-navbar-header')).toBeInTheDocument();
		});

		it('renders signed-in components', () => {
			renderWithRouter(<Navbar />);

			expect(screen.getByTestId('signed-in')).toBeInTheDocument();
			expect(screen.getByTestId('mail-dropdown')).toBeInTheDocument();
		});
	});

	describe('Mobile Navigation', () => {
		it('passes correct props to MobileNavbarHeader', () => {
			renderWithRouter(<Navbar />);

			const mobileHeader = screen.getByTestId('mobile-navbar-header');
			expect(mobileHeader).toBeInTheDocument();
		});

		it('handles mobile toggle functionality', () => {
			renderWithRouter(<Navbar />);

			const mobileToggle = screen.getByTestId('mobile-toggle');
			const expandedState = screen.getByTestId('mobile-expanded');

			// Initially collapsed
			expect(expandedState).toHaveTextContent('collapsed');

			// Click to expand
			fireEvent.click(mobileToggle);
			expect(expandedState).toHaveTextContent('expanded');

			// Click to collapse
			fireEvent.click(mobileToggle);
			expect(expandedState).toHaveTextContent('collapsed');
		});
	});

	describe('State Management', () => {
		it('initializes with collapsed mobile menu', () => {
			renderWithRouter(<Navbar />);

			const expandedState = screen.getByTestId('mobile-expanded');
			expect(expandedState).toHaveTextContent('collapsed');
		});

		it('exposes window functions for testing', () => {
			renderWithRouter(<Navbar />);

			expect(window.resetLanguageDetection).toBeDefined();
			expect(typeof window.resetLanguageDetection).toBe('function');
		});
	});

	describe('Styling and Layout', () => {
		it('has proper desktop layout classes', () => {
			renderWithRouter(<Navbar />);

			// Find the desktop container by looking for the background div
			const desktopContainer = screen.getByText('Vacancies').closest('.d-none');
			expect(desktopContainer).toHaveClass('d-none', 'd-lg-block', 'mb-10');
		});

		it('has proper navigation styling', () => {
			renderWithRouter(<Navbar />);

			const navList = screen.getByText('Vacancies').closest('ul');
			expect(navList).toHaveClass('flex', 'justify-center', 'items-center');
		});

		it('has proper link styling', () => {
			renderWithRouter(<Navbar />);

			const vacanciesLink = screen.getByRole('link', { name: 'Vacancies' });
			expect(vacanciesLink).toHaveClass('nav-link', 'text-base', 'font-normal');
		});
	});

	describe('Accessibility', () => {
		it('has proper ARIA attributes', () => {
			renderWithRouter(<Navbar />);

			const supportButton = screen.getByRole('button', { name: 'Support' });
			expect(supportButton).toHaveAttribute('aria-expanded', 'false');
			expect(supportButton).toHaveAttribute('id', 'supportDropdown');
		});

		it('has proper link accessibility', () => {
			renderWithRouter(<Navbar />);

			const vacanciesLink = screen.getByRole('link', { name: 'Vacancies' });
			expect(vacanciesLink).toHaveAttribute('id', 'vacancies');
		});

		it('has proper external link attributes', () => {
			renderWithRouter(<Navbar />);

			const rulesLink = screen.getByRole('link', { name: 'Rules' });
			expect(rulesLink).toHaveAttribute('target', '_blank');
			expect(rulesLink).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});

	describe('Edge Cases', () => {
		it('handles component mounting and unmounting', () => {
			const { unmount } = renderWithRouter(<Navbar />);

			expect(screen.getByTestId('logo')).toBeInTheDocument();

			unmount();

			// Should clean up properly
			expect(screen.queryByTestId('logo')).not.toBeInTheDocument();
		});
	});

	describe('Integration with Router', () => {
		it('works with BrowserRouter', () => {
			renderWithRouter(<Navbar />);

			// All navigation links should be present
			expect(
				screen.getByRole('link', { name: 'Vacancies' }),
			).toBeInTheDocument();
			expect(screen.getByRole('link', { name: 'Seekers' })).toBeInTheDocument();
			expect(screen.getByRole('link', { name: 'My Jobs' })).toBeInTheDocument();
		});

		it('handles navigation state', () => {
			renderWithRouter(<Navbar />);

			// Component should render without navigation errors
			expect(screen.getByTestId('logo')).toBeInTheDocument();
		});
	});
});
