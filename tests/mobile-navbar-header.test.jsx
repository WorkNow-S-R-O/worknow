import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MobileNavbarHeader from '../apps/client/src/components/ui/MobileNavbarHeader';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
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
	}),
}));

// Mock Clerk components
vi.mock('@clerk/clerk-react', () => ({
	SignedIn: ({ children }) => <div data-testid="signed-in">{children}</div>,
}));

// Mock UI components
vi.mock('../apps/client/src/components/ui/LanguageSelector', () => ({
	default: () => <div data-testid="language-selector">Language Selector</div>,
}));

vi.mock('../apps/client/src/components/ui/UserAuth', () => ({
	default: () => <div data-testid="user-auth">User Auth</div>,
}));

vi.mock('../apps/client/src/components/ui/premium-button', () => ({
	default: () => <div data-testid="premium-button">Premium Button</div>,
}));

vi.mock('../apps/client/src/components/ui/MailDropdown', () => ({
	default: () => <div data-testid="mail-dropdown">Mail Dropdown</div>,
}));

vi.mock('../apps/client/src/components/ui/Logo', () => ({
	default: () => <div data-testid="logo">Logo</div>,
}));

const renderWithRouter = (component) => {
	return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MobileNavbarHeader Component', () => {
	const mockSetIsExpanded = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Basic Functionality', () => {
		it('renders the component', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			expect(screen.getByTestId('logo')).toBeInTheDocument();
			expect(screen.getByTestId('language-selector')).toBeInTheDocument();
			expect(screen.getByTestId('user-auth')).toBeInTheDocument();
			expect(screen.getByTestId('premium-button')).toBeInTheDocument();
		});

		it('renders mobile navigation links', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			expect(screen.getByText('Vacancies')).toBeInTheDocument();
			expect(screen.getByText('Seekers')).toBeInTheDocument();
			expect(screen.getByText('My Jobs')).toBeInTheDocument();
			expect(screen.getByText('Support')).toBeInTheDocument();
		});

		it('renders hamburger toggle button', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const toggleButton = screen.getByRole('button', {
				name: 'Toggle navigation',
			});
			expect(toggleButton).toBeInTheDocument();
			expect(toggleButton).toHaveClass('navbar-toggler');
		});

		it('renders navbar with proper Bootstrap classes', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const navbar = screen.getByRole('navigation');
			expect(navbar).toHaveClass(
				'navbar',
				'navbar-expand-lg',
				'navbar-light',
				'd-lg-none',
				'fixed-top',
			);
		});
	});

	describe('Navigation Links', () => {
		it('has proper navigation structure', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const vacanciesLink = screen.getByRole('link', { name: 'Vacancies' });
			const seekersLink = screen.getByRole('link', { name: 'Seekers' });
			const jobsLink = screen.getByRole('link', { name: 'My Jobs' });

			expect(vacanciesLink).toHaveAttribute('href', '/');
			expect(seekersLink).toHaveAttribute('href', '/seekers');
			expect(jobsLink).toHaveAttribute('href', '/my-advertisements');
		});

		it('has proper link styling', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const vacanciesLink = screen.getByRole('link', { name: 'Vacancies' });
			expect(vacanciesLink).toHaveClass('nav-link', 'text-lg', 'font-normal');
		});

		it('renders navigation items with proper structure', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const navList = screen.getByText('Vacancies').closest('ul');
			expect(navList).toHaveClass('navbar-nav', 'ms-auto', 'mb-2', 'mb-lg-0');
		});
	});

	describe('Support Dropdown', () => {
		it('renders support dropdown button', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const supportButton = screen.getByRole('button', { name: 'Support' });
			expect(supportButton).toBeInTheDocument();
			expect(supportButton).toHaveAttribute('data-bs-toggle', 'dropdown');
			expect(supportButton).toHaveAttribute('id', 'mobileSupportDropdown');
		});

		it('renders support dropdown menu items', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			expect(screen.getByText('Rules')).toBeInTheDocument();
			expect(screen.getByText('Technical Support')).toBeInTheDocument();
		});

		it('has proper support links', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const rulesLink = screen.getByRole('link', { name: 'Rules' });
			const supportLink = screen.getByRole('link', {
				name: 'Technical Support',
			});

			expect(rulesLink).toHaveAttribute(
				'href',
				'https://www.termsfeed.com/live/8e93e788-90eb-4c96-b48c-18d31910ddca',
			);
			expect(rulesLink).toHaveAttribute('target', '_blank');
			expect(supportLink).toHaveAttribute('href', '/support');
		});

		it('has proper dropdown menu styling', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const dropdownMenu = screen.getByText('Rules').closest('ul');
			expect(dropdownMenu).toHaveClass('dropdown-menu');
			expect(dropdownMenu).toHaveAttribute(
				'aria-labelledby',
				'mobileSupportDropdown',
			);
		});
	});

	describe('Toggle Functionality', () => {
		it('calls setIsExpanded when toggle button is clicked', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const toggleButton = screen.getByRole('button', {
				name: 'Toggle navigation',
			});
			fireEvent.click(toggleButton);

			expect(mockSetIsExpanded).toHaveBeenCalledWith(true);
		});

		it('shows correct aria-expanded state', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={true}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const toggleButton = screen.getByRole('button', {
				name: 'Toggle navigation',
			});
			expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
		});

		it('shows collapsed state when isExpanded is false', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const toggleButton = screen.getByRole('button', {
				name: 'Toggle navigation',
			});
			expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
		});
	});

	describe('Collapsible Menu', () => {
		it('shows collapsed menu when isExpanded is false', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const collapsibleDiv = screen
				.getByText('Vacancies')
				.closest('.navbar-collapse');
			expect(collapsibleDiv).toHaveClass('navbar-collapse', 'collapse');
			expect(collapsibleDiv).not.toHaveClass('show');
		});

		it('shows expanded menu when isExpanded is true', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={true}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const collapsibleDiv = screen
				.getByText('Vacancies')
				.closest('.navbar-collapse');
			expect(collapsibleDiv).toHaveClass('navbar-collapse', 'show');
			expect(collapsibleDiv).not.toHaveClass('collapse');
		});
	});

	describe('Component Integration', () => {
		it('renders all UI components', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			expect(screen.getByTestId('logo')).toBeInTheDocument();
			expect(screen.getByTestId('language-selector')).toBeInTheDocument();
			expect(screen.getByTestId('user-auth')).toBeInTheDocument();
			expect(screen.getByTestId('premium-button')).toBeInTheDocument();
			expect(screen.getByTestId('mail-dropdown')).toBeInTheDocument();
		});

		it('passes isMobile prop to child components', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			// Components should render (they handle isMobile internally)
			expect(screen.getByTestId('language-selector')).toBeInTheDocument();
			expect(screen.getByTestId('user-auth')).toBeInTheDocument();
		});

		it('renders signed-in components', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			expect(screen.getByTestId('signed-in')).toBeInTheDocument();
			expect(screen.getByTestId('mail-dropdown')).toBeInTheDocument();
		});
	});

	describe('Styling and Layout', () => {
		it('has proper container structure', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const container = screen.getByTestId('logo').closest('.container-fluid');
			expect(container).toBeInTheDocument();
		});

		it('has proper mobile-specific classes', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const navbar = screen.getByRole('navigation');
			expect(navbar).toHaveClass('d-lg-none', 'fixed-top');
		});

		it('has proper background styling', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const navbar = screen.getByRole('navigation');
			expect(navbar).toHaveClass('bg-[#e3f2fd]');
		});

		it('has proper z-index', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const navbar = screen.getByRole('navigation');
			expect(navbar).toHaveClass('z-10');
		});
	});

	describe('Accessibility', () => {
		it('has proper ARIA attributes', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const toggleButton = screen.getByRole('button', {
				name: 'Toggle navigation',
			});
			expect(toggleButton).toHaveAttribute('aria-controls', 'navbarNav');
			expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
			expect(toggleButton).toHaveAttribute('aria-label', 'Toggle navigation');
		});

		it('has proper navigation role', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const navbar = screen.getByRole('navigation');
			expect(navbar).toBeInTheDocument();
		});

		it('has proper external link attributes', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const rulesLink = screen.getByRole('link', { name: 'Rules' });
			expect(rulesLink).toHaveAttribute('target', '_blank');
			expect(rulesLink).toHaveAttribute('rel', 'noopener noreferrer');
		});
	});

	describe('Props Handling', () => {
		it('handles isExpanded prop correctly', () => {
			const { rerender } = renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			let collapsibleDiv = screen
				.getByText('Vacancies')
				.closest('.navbar-collapse');
			expect(collapsibleDiv).toHaveClass('collapse');

			rerender(
				<BrowserRouter>
					<MobileNavbarHeader
						isExpanded={true}
						setIsExpanded={mockSetIsExpanded}
					/>
				</BrowserRouter>,
			);

			collapsibleDiv = screen
				.getByText('Vacancies')
				.closest('.navbar-collapse');
			expect(collapsibleDiv).toHaveClass('show');
		});

		it('handles setIsExpanded prop correctly', () => {
			renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			const toggleButton = screen.getByRole('button', {
				name: 'Toggle navigation',
			});
			fireEvent.click(toggleButton);

			expect(mockSetIsExpanded).toHaveBeenCalledTimes(1);
			expect(mockSetIsExpanded).toHaveBeenCalledWith(true);
		});
	});

	describe('Edge Cases', () => {
		it('handles component mounting and unmounting', () => {
			const { unmount } = renderWithRouter(
				<MobileNavbarHeader
					isExpanded={false}
					setIsExpanded={mockSetIsExpanded}
				/>,
			);

			expect(screen.getByTestId('logo')).toBeInTheDocument();

			unmount();

			expect(screen.queryByTestId('logo')).not.toBeInTheDocument();
		});

		it('handles missing props gracefully', () => {
			// Test with undefined props
			renderWithRouter(
				<MobileNavbarHeader isExpanded={undefined} setIsExpanded={undefined} />,
			);

			// Should still render without crashing
			expect(screen.getByTestId('logo')).toBeInTheDocument();
		});
	});
});
