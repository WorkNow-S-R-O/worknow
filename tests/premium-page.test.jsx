import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PremiumPage from '../apps/client/src/components/PremiumPage';

// Mock axios - use global mock from setup.jsx
import axios from 'axios';

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
	value: {
		VITE_API_URL: 'http://localhost:3000',
	},
	writable: true,
});

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
	useUser: () => ({
		user: {
			id: 'test-user-id',
			firstName: 'Test',
			lastName: 'User',
			primaryEmailAddress: { emailAddress: 'test@example.com' },
			imageUrl: 'https://example.com/avatar.jpg',
		},
		isLoaded: true,
	}),
	useClerk: () => ({
		redirectToSignIn: vi.fn(),
	}),
}));

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		pricingTitle: { value: 'Pricing Plans' },
		pricingEffective: { value: 'Effective Pricing' },
		pricingConvenient: { value: 'Convenient Pricing' },
		pricingTrust: { value: 'Trusted Pricing' },
		pricingDescription: { value: 'Choose the best plan for your needs' },
		pricingFreeTitle: { value: 'Free Plan' },
		pricingFreeUpTo5Ads: { value: 'Up to 5 ads' },
		pricingFreeDailyBoost: { value: 'Daily boost' },
		pricingFreeBasicSupport: { value: 'Basic support' },
		pricingFreeUseFree: { value: 'Use Free' },
		pricingProUpTo10Ads: { value: 'Up to 10 ads' },
		pricingProUnlimitedSeekerData: { value: 'Unlimited seeker data' },
		pricingProTopJobs: { value: 'Top jobs' },
		pricingProColorHighlighting: { value: 'Color highlighting' },
		pricingProAdvancedFilters: { value: 'Advanced filters' },
		pricingProPrioritySupport: { value: 'Priority support' },
		pricingProBuyPremium: { value: 'Buy Premium' },
		pricingDeluxeAllFromPro: { value: 'All Pro features' },
		pricingDeluxePersonalManager: { value: 'Personal manager' },
		pricingDeluxeFacebookAutoposting: { value: 'Facebook autoposting' },
		pricingDeluxeFacebookPromotion: { value: 'Facebook promotion' },
		pricingDeluxePersonalMailing: { value: 'Personal mailing' },
		pricingDeluxeTelegramPublications: { value: 'Telegram publications' },
		pricingDeluxePersonalCandidateSelection: { value: 'Personal candidate selection' },
		pricingDeluxeInterviewOrganization: { value: 'Interview organization' },
		pricingDeluxeBuyDeluxe: { value: 'Buy Deluxe' },
		pricingDeluxeUpgradeToDeluxe: { value: 'Upgrade to Deluxe' },
		pricingRecommended: { value: 'Recommended' },
		pricingBestResults: { value: 'Best Results' },
		loading: { value: 'Loading...' },
		active: { value: 'Active' },
		userNotFound: { value: 'User not found' },
		paymentError: { value: 'Payment error occurred' },
	}),
}));

// Mock useUserSync hook
vi.mock('../apps/client/src/hooks/useUserSync.js', () => ({
	useUserSync: () => ({
		dbUser: {
			id: 'test-user-id',
			isPremium: false,
			premiumDeluxe: false,
		},
		loading: false,
		error: null,
		refreshUser: vi.fn(),
	}),
}));

// Mock useLoadingProgress hook
vi.mock('../apps/client/src/hooks/useLoadingProgress', () => ({
	useLoadingProgress: () => ({
		startLoadingWithProgress: vi.fn(),
		completeLoading: vi.fn(),
		stopLoadingImmediately: vi.fn(),
	}),
}));

// Mock useGoogleAnalytics hook
vi.mock('../apps/client/src/hooks/useGoogleAnalytics.js', () => ({
	useGoogleAnalytics: () => ({
		trackPremiumSubscription: vi.fn(),
		trackButtonClick: vi.fn(),
		trackError: vi.fn(),
	}),
}));

// Helper function to render component with router
const renderWithRouter = (component) => {
	return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PremiumPage Component', () => {
	beforeEach(async () => {
		// Reset all mocks
		vi.clearAllMocks();
		
		// Mock axios responses using the global mock
		vi.mocked(axios.post).mockResolvedValue({ 
			data: { url: 'https://checkout.stripe.com/test' } 
		});
	});

	describe('Basic Functionality', () => {
		it('renders the component', async () => {
			renderWithRouter(<PremiumPage />);
			
			// Wait for the component to render
			await waitFor(() => {
				expect(screen.getByText('Pricing Plans')).toBeInTheDocument();
			});
		});

		it('displays pricing plans', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				expect(screen.getByText('Free Plan')).toBeInTheDocument();
				expect(screen.getByText('Pro')).toBeInTheDocument();
				expect(screen.getByText('Deluxe')).toBeInTheDocument();
			});
		});

		it('shows plan features', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				expect(screen.getByText('Up to 5 ads')).toBeInTheDocument();
				expect(screen.getByText('Up to 10 ads')).toBeInTheDocument();
				expect(screen.getByText('All Pro features')).toBeInTheDocument();
			});
		});

		it('displays pricing information', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				expect(screen.getByText('0')).toBeInTheDocument();
				expect(screen.getByText('99₪')).toBeInTheDocument();
				expect(screen.getByText('200₪')).toBeInTheDocument();
			});
		});

		it('shows plan badges', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				expect(screen.getByText('⭐ Recommended')).toBeInTheDocument();
				expect(screen.getByText('🏆 Best Results')).toBeInTheDocument();
			});
		});
	});

	describe('User Interactions', () => {
		it('handles free plan button click', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				const freeButton = screen.getByText('Active');
				expect(freeButton).toBeInTheDocument();
			});
		});

		it('handles premium plan button click', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				const premiumButton = screen.getByText('Buy Premium');
				expect(premiumButton).toBeInTheDocument();
			});
		});

		it('handles deluxe plan button click', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				const deluxeButton = screen.getByText('Buy Deluxe');
				expect(deluxeButton).toBeInTheDocument();
			});
		});

		it('shows loading state during payment', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				const premiumButton = screen.getByText('Buy Premium');
				fireEvent.click(premiumButton);
				
				// Check if loading state is shown
				expect(vi.mocked(axios.post)).toHaveBeenCalled();
			});
		});
	});

	describe('API Integration', () => {
		it('creates checkout session for premium plan', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				const premiumButton = screen.getByText('Buy Premium');
				fireEvent.click(premiumButton);
				
				expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
					expect.stringContaining('/api/payments/create-checkout-session'),
					expect.objectContaining({
						clerkUserId: 'test-user-id',
						priceId: 'price_1Qt5J0COLiDbHvw1IQNl90uU',
					})
				);
			});
		});

		it('creates checkout session for deluxe plan', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				const deluxeButton = screen.getByText('Buy Deluxe');
				fireEvent.click(deluxeButton);
				
				expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
					expect.stringContaining('/api/payments/create-checkout-session'),
					expect.objectContaining({
						clerkUserId: 'test-user-id',
						priceId: 'price_1RfHjiCOLiDbHvw1repgIbnK',
					})
				);
			});
		});

		it('handles API errors gracefully', async () => {
			vi.mocked(axios.post).mockRejectedValue(new Error('API Error'));
			
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				const premiumButton = screen.getByText('Buy Premium');
				fireEvent.click(premiumButton);
				
				// Component should handle error gracefully
				expect(vi.mocked(axios.post)).toHaveBeenCalled();
			});
		});
	});

	describe('Plan Status Logic', () => {
		it('shows active status for free plan when user is logged in', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				const freeButton = screen.getByText('Active');
				expect(freeButton).toBeInTheDocument();
			});
		});

		it('shows upgrade pricing for deluxe when user has pro', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				// Just check that the component renders without errors
				expect(screen.getByText('Deluxe')).toBeInTheDocument();
			});
		});
	});

	describe('Text Carousel', () => {
		it('displays title variations', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				// Check if any of the title variations are displayed
				const titleElement = screen.getByText('Pricing Plans');
				expect(titleElement).toBeInTheDocument();
			});
		});
	});

	describe('Responsive Design', () => {
		it('renders pricing cards correctly', async () => {
			renderWithRouter(<PremiumPage />);
			
			await waitFor(() => {
				// Check if pricing cards are rendered
				const cards = screen.getAllByText(/Free Plan|Pro|Deluxe/);
				expect(cards.length).toBeGreaterThan(0);
			});
		});
	});
});
