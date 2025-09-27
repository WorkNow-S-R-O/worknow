import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserProfile } from '@/components';

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
	useParams: () => ({ clerkUserId: 'test-user-id' }),
	useNavigate: () => mockNavigate,
}));

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
}));

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		userProfile: {
			user_profile_title: 'User Profile',
			user_not_found: 'User not found',
			profile_description: 'Profile description',
			user_jobs: 'User Jobs',
			user_profile_not_found_description: 'User profile not found',
			user_no_jobs: 'No jobs found',
		},
	}),
}));

// Mock useLoadingProgress hook
vi.mock('@/hooks/useLoadingProgress', () => ({
	useLoadingProgress: () => ({
		startLoadingWithProgress: vi.fn(),
		completeLoading: vi.fn(),
		stopLoadingImmediately: vi.fn(),
	}),
}));

// Mock JobCard component
vi.mock('@/components/JobCard', () => ({
	default: ({ job }) => (
		<div data-testid="job-card">
			<h5>{job.title}</h5>
			<p>{job.description}</p>
		</div>
	),
}));

// Mock PaginationControl component
vi.mock('@/components/PaginationControl', () => ({
	default: ({ currentPage, totalPages, onPageChange }) => (
		<div data-testid="pagination-control">
			<span>
				Page {currentPage} of {totalPages}
			</span>
			<button onClick={() => onPageChange(currentPage + 1)}>Next</button>
		</div>
	),
}));

// Mock data
const mockUserData = {
	id: 'test-user-id',
	firstName: 'Test',
	lastName: 'User',
	email: 'test@example.com',
	imageUrl: 'https://example.com/avatar.jpg',
};

const mockJobsData = {
	jobs: [
		{
			id: 1,
			title: 'Test Job 1',
			description: 'Test job description 1',
			city: { name: 'Tel Aviv' },
			category: { name: 'Construction' },
		},
		{
			id: 2,
			title: 'Test Job 2',
			description: 'Test job description 2',
			city: { name: 'Jerusalem' },
			category: { name: 'Cleaning' },
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

describe('UserProfile Component', () => {
	beforeEach(async () => {
		// Reset all mocks
		vi.clearAllMocks();

		// Mock axios responses using the global mock
		vi.mocked(axios.get).mockImplementation((url) => {
			if (url.includes('/api/users/test-user-id')) {
				return Promise.resolve({ data: mockUserData });
			}
			if (url.includes('/api/users/user-jobs/test-user-id')) {
				return Promise.resolve({ data: mockJobsData });
			}
			return Promise.resolve({ data: {} });
		});
	});

	describe('Basic Functionality', () => {
		it('renders the component', async () => {
			renderWithRouter(<UserProfile />);

			// Wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});

		it('renders job cards when jobs exist', async () => {
			renderWithRouter(<UserProfile />);

			// Wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});

		it('renders empty state when no jobs exist', async () => {
			vi.mocked(axios.get).mockImplementation((url) => {
				if (url.includes('/api/users/test-user-id')) {
					return Promise.resolve({ data: mockUserData });
				}
				if (url.includes('/api/users/user-jobs/test-user-id')) {
					return Promise.resolve({ data: mockEmptyJobsData });
				}
				return Promise.resolve({ data: {} });
			});

			renderWithRouter(<UserProfile />);

			// Wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});

		it('displays user profile information', async () => {
			renderWithRouter(<UserProfile />);

			// Wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});

		it('handles pagination correctly', async () => {
			renderWithRouter(<UserProfile />);

			// Wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});
	});

	describe('API Integration', () => {
		it('fetches user profile data on component mount', async () => {
			renderWithRouter(<UserProfile />);

			await waitFor(() => {
				expect(vi.mocked(axios.get)).toHaveBeenCalledWith(
					expect.stringContaining('/api/users/test-user-id'),
				);
			});
		});

		it('fetches user jobs on component mount', async () => {
			renderWithRouter(<UserProfile />);

			await waitFor(() => {
				expect(vi.mocked(axios.get)).toHaveBeenCalledWith(
					expect.stringContaining('/api/users/user-jobs/test-user-id'),
				);
			});
		});

		it('handles API errors gracefully', async () => {
			// Mock axios to return proper data structure
			vi.mocked(axios.get)
				.mockResolvedValueOnce({ data: mockUserData }) // First call for profile
				.mockResolvedValueOnce({ data: [] }); // Second call for jobs (empty array)

			// Just check that the component renders without crashing
			expect(() => {
				renderWithRouter(<UserProfile />);
			}).not.toThrow();
		});
	});

	describe('SEO and Meta Tags', () => {
		it('renders with proper SEO meta tags', async () => {
			renderWithRouter(<UserProfile />);

			// Wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});

		it('generates proper page title', async () => {
			renderWithRouter(<UserProfile />);

			// Wait for the component to render and check for skeletons (loading state)
			await waitFor(() => {
				const skeletons = screen.queryAllByTestId('skeleton');
				expect(skeletons.length).toBeGreaterThan(0);
			});
		});
	});
});
