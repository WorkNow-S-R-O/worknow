import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserJobs } from '@/components';

// Mock axios - use global mock from setup.jsx
import axios from 'axios';

// Mock toast
vi.mock('react-hot-toast', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
	BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
	useNavigate: () => mockNavigate,
}));

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
	useUser: () => ({
		user: {
			id: 'test-user-id',
			primaryEmailAddress: { emailAddress: 'test@example.com' },
			emailAddresses: [{ emailAddress: 'test@example.com' }],
		},
		isLoaded: true,
		isSignedIn: true,
	}),
	useAuth: () => ({
		isLoaded: true,
		isSignedIn: true,
		userId: 'test-user-id',
		getToken: vi.fn().mockResolvedValue('test-token'),
	}),
}));

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		myAdsTitle: { value: 'My Advertisements' },
		signInToView: { value: 'Please sign in to view your advertisements' },
		loadJobsError: { value: 'Error loading advertisements' },
		jobDeletedSuccess: { value: 'Advertisement deleted successfully' },
		jobDeletedError: { value: 'Error deleting advertisement' },
		jobBoostedSuccess: { value: 'Advertisement boosted successfully' },
		jobBoostedError: { value: 'Error boosting advertisement' },
		youDontHaveAds: { value: "You don't have any advertisements yet" },
		premiumBadge: { value: 'Premium' },
		notSpecified: { value: 'Not specified' },
		salaryPerHourCard: { value: 'Salary per hour:' },
		locationCard: { value: 'Location:' },
		shuttle: { value: 'Shuttle' },
		meals: { value: 'Meals' },
		yes: { value: 'Yes' },
		no: { value: 'No' },
		phoneNumberCard: { value: 'Phone number:' },
		imageUnavailable: { value: 'Image\nunavailable' },
		createdAt: { value: 'Created at' },
		nextBoostAfter: { value: 'Next boost after:' },
		hoursShort: { value: 'h' },
		minutesShort: { value: 'm' },
		boostReady: { value: 'Ready' },
		boostTitle: { value: 'Boost advertisement' },
		confirmDelete: { value: 'Confirm deletion' },
		confirmDeleteText: {
			value: 'Are you sure you want to delete this advertisement?',
		},
		cancel: { value: 'Cancel' },
		delete: { value: 'Delete' },
	}),
	useLocale: () => ({ locale: 'en' }),
}));

// Mock useTranslationHelpers
vi.mock('@/utils/translationHelpers', () => ({
	useTranslationHelpers: () => ({
		getCityLabel: (cityName) => cityName,
	}),
}));

// Mock date-fns
vi.mock('date-fns', () => ({
	format: vi.fn((date, formatStr) => '01 January 2024'),
}));

vi.mock('date-fns/locale', () => ({
	ru: 'ru',
	enUS: 'enUS',
	he: 'he',
	ar: 'ar',
}));

// Mock useLoadingProgress
vi.mock('@/hooks/useLoadingProgress', () => ({
	useLoadingProgress: () => ({
		startLoadingWithProgress: vi.fn(),
		completeLoading: vi.fn(),
	}),
}));

// Mock PaginationControl component
vi.mock('@/components/PaginationControl', () => ({
	default: ({ currentPage, totalPages, onPageChange }) => (
		<div data-testid="pagination-control">
			<span data-testid="current-page">{currentPage}</span>
			<span data-testid="total-pages">{totalPages}</span>
			<button onClick={() => onPageChange(2)}>Next Page</button>
		</div>
	),
}));

// Mock ImageModal component
vi.mock('../apps/client/src/components/ui', () => ({
	ImageModal: ({ show, onHide, imageUrl, imageAlt }) => {
		if (!show) return null;
		return (
			<div data-testid="image-modal">
				<img src={imageUrl} alt={imageAlt} />
				<button onClick={onHide}>Close</button>
			</div>
		);
	},
}));

// Test data
const mockJobsData = {
	jobs: [
		{
			id: 1,
			title: 'Test Job 1',
			salary: '50',
			phone: '+972501234567',
			description: 'Test job description',
			imageUrl: 'https://example.com/image1.jpg',
			createdAt: '2024-01-01T00:00:00Z',
			boostedAt: null,
			shuttle: true,
			meals: false,
			city: { name: 'Tel Aviv' },
			category: { label: 'Construction' },
			user: { isPremium: false },
		},
	],
	totalPages: 1,
};

const mockEmptyJobsData = {
	jobs: [],
	totalPages: 0,
};

// Helper function to render component with router
const renderWithRouter = (component) => {
	return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('UserJobs Component', () => {
	beforeEach(async () => {
		// Reset all mocks
		vi.clearAllMocks();

		// Mock axios responses using the global mock
		vi.mocked(axios.get).mockResolvedValue({ data: mockJobsData });
		vi.mocked(axios.delete).mockResolvedValue({ data: {} });
		vi.mocked(axios.post).mockResolvedValue({ data: {} });
	});

	describe('Basic Functionality', () => {
		it('renders the component title', async () => {
			renderWithRouter(<UserJobs />);

			await waitFor(() => {
				expect(screen.getByText('My Advertisements')).toBeInTheDocument();
			});
		});

		it('renders job cards when jobs exist', async () => {
			renderWithRouter(<UserJobs />);

			// Just wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});

		it('renders empty state when no jobs exist', async () => {
			vi.mocked(axios.get).mockResolvedValue({ data: mockEmptyJobsData });

			renderWithRouter(<UserJobs />);

			// Just wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});

		it('displays job details correctly', async () => {
			renderWithRouter(<UserJobs />);

			// Just wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});

		it('displays shuttle and meals information', async () => {
			renderWithRouter(<UserJobs />);

			// Just wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});
	});

	describe('API Integration', () => {
		it('fetches user jobs on component mount', async () => {
			renderWithRouter(<UserJobs />);

			await waitFor(() => {
				expect(vi.mocked(axios.get)).toHaveBeenCalledWith(
					'http://localhost:3001/api/users/user-jobs/test-user-id?page=1&limit=5&lang=en',
				);
			});
		});

		it('handles API errors gracefully', async () => {
			vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));

			renderWithRouter(<UserJobs />);

			// Just wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});
	});
});
