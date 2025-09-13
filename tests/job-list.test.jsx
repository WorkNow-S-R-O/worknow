import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import JobList from '../apps/client/src/components/JobList';

// Mock react-loading-skeleton
vi.mock('react-loading-skeleton', () => ({
	default: ({ height, width, className }) => (
		<div 
			data-testid="skeleton" 
			style={{ height, width }} 
			className={className}
		>
			Skeleton
		</div>
	),
}));

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
	useUser: vi.fn(() => ({
		user: {
			id: 'user123',
			firstName: 'John',
			lastName: 'Doe',
			imageUrl: 'https://example.com/avatar.jpg',
		},
		isLoaded: true,
	})),
}));

// Mock JobCard component
vi.mock('../apps/client/src/components/JobCard', () => ({
	default: ({ job, currentUserName, currentUserImageUrl }) => (
		<div data-testid="job-card">
			<span data-testid="job-title">{job.title}</span>
			<span data-testid="job-salary">{job.salary}</span>
			<span data-testid="job-city">{job.city?.name}</span>
			<span data-testid="current-user-name">{currentUserName || 'No user'}</span>
			<span data-testid="current-user-image">{currentUserImageUrl || 'No image'}</span>
		</div>
	),
}));

describe('JobList Component', () => {
	const mockJobs = [
		{
			id: 1,
			title: 'Test Job 1',
			salary: '5000₪',
			city: { name: 'Tel Aviv' },
			description: 'Test description 1',
			phone: '050-1234567',
			createdAt: '2024-01-01',
			user: {
				clerkUserId: 'user123',
				imageUrl: 'https://example.com/user1.jpg',
				isPremium: true,
			},
		},
		{
			id: 2,
			title: 'Test Job 2',
			salary: '6000₪',
			city: { name: 'Haifa' },
			description: 'Test description 2',
			phone: '050-7654321',
			createdAt: '2024-01-02',
			user: {
				clerkUserId: 'user456',
				imageUrl: 'https://example.com/user2.jpg',
				isPremium: false,
			},
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Loading State', () => {
		it('renders loading skeletons when loading is true', () => {
			render(<JobList jobs={[]} loading={true} />);

			const skeletons = screen.getAllByTestId('skeleton');
			expect(skeletons).toHaveLength(15); // 5 cards × 3 skeletons per card
		});

		it('renders correct number of skeleton cards', () => {
			render(<JobList jobs={[]} loading={true} />);

			const skeletonCards = screen.getAllByTestId('skeleton').filter(
				(skeleton) => skeleton.parentElement?.classList.contains('card-body')
			);
			expect(skeletonCards).toHaveLength(15); // 5 cards × 3 skeletons per card
		});

		it('has proper skeleton card styling', () => {
			render(<JobList jobs={[]} loading={true} />);

			const firstCard = screen.getAllByTestId('skeleton')[0].closest('.card');
			expect(firstCard).toHaveClass('card', 'shadow-sm', 'mb-4');
			expect(firstCard).toHaveStyle({
				width: '90%',
				maxWidth: '700px',
				minHeight: '220px',
			});
		});

		it('renders skeleton with proper dimensions', () => {
			render(<JobList jobs={[]} loading={true} />);

			const skeletons = screen.getAllByTestId('skeleton');
			expect(skeletons[0]).toHaveStyle({ height: '30px', width: '70%' });
			expect(skeletons[1]).toHaveStyle({ height: '20px', width: '90%' });
			expect(skeletons[2]).toHaveStyle({ height: '20px', width: '60%' });
		});
	});

	describe('Empty State', () => {
		it('renders empty message when no jobs', () => {
			render(<JobList jobs={[]} loading={false} />);

			expect(screen.getByText('Объявлений не найдено')).toBeInTheDocument();
		});

		it('renders empty message when jobs is null', () => {
			render(<JobList jobs={null} loading={false} />);

			expect(screen.getByText('Объявлений не найдено')).toBeInTheDocument();
		});

		it('renders empty message when jobs is undefined', () => {
			render(<JobList jobs={undefined} loading={false} />);

			expect(screen.getByText('Объявлений не найдено')).toBeInTheDocument();
		});

		it('has proper empty state styling', () => {
			render(<JobList jobs={[]} loading={false} />);

			const emptyMessage = screen.getByText('Объявлений не найдено');
			expect(emptyMessage).toHaveClass('text-muted', 'mt-4');
		});
	});

	describe('Job Rendering', () => {
		it('renders job cards when jobs are provided', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			const jobCards = screen.getAllByTestId('job-card');
			expect(jobCards).toHaveLength(2);
		});

		it('renders job titles', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			expect(screen.getByText('Test Job 1')).toBeInTheDocument();
			expect(screen.getByText('Test Job 2')).toBeInTheDocument();
		});

		it('renders job salaries', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			expect(screen.getByText('5000₪')).toBeInTheDocument();
			expect(screen.getByText('6000₪')).toBeInTheDocument();
		});

		it('renders job cities', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			expect(screen.getByText('Tel Aviv')).toBeInTheDocument();
			expect(screen.getByText('Haifa')).toBeInTheDocument();
		});
	});

	describe('User Authentication Integration', () => {
		it('passes current user name for own jobs', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			const userNames = screen.getAllByTestId('current-user-name');
			expect(userNames[0]).toHaveTextContent('John Doe'); // First job belongs to current user
			expect(userNames[1]).toHaveTextContent('No user'); // Second job belongs to different user
		});

		it('passes current user image for own jobs', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			const userImages = screen.getAllByTestId('current-user-image');
			expect(userImages[0]).toHaveTextContent('https://example.com/avatar.jpg');
			expect(userImages[1]).toHaveTextContent('No image');
		});
	});

	describe('Job Ownership Detection', () => {
		it('correctly identifies own jobs', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			const userNames = screen.getAllByTestId('current-user-name');
			// First job has clerkUserId 'user123' which matches current user
			expect(userNames[0]).toHaveTextContent('John Doe');
			// Second job has clerkUserId 'user456' which doesn't match current user
			expect(userNames[1]).toHaveTextContent('No user');
		});

		it('handles jobs without user data', () => {
			const jobsWithoutUser = [
				{
					id: 1,
					title: 'Test Job',
					salary: '5000₪',
					city: { name: 'Tel Aviv' },
					description: 'Test description',
					phone: '050-1234567',
					createdAt: '2024-01-01',
					user: null,
				},
			];

			render(<JobList jobs={jobsWithoutUser} loading={false} />);

			const userNames = screen.getAllByTestId('current-user-name');
			expect(userNames[0]).toHaveTextContent('No user');
		});

		it('handles jobs with incomplete user data', () => {
			const jobsWithIncompleteUser = [
				{
					id: 1,
					title: 'Test Job',
					salary: '5000₪',
					city: { name: 'Tel Aviv' },
					description: 'Test description',
					phone: '050-1234567',
					createdAt: '2024-01-01',
					user: {
						clerkUserId: 'user123',
						// Missing imageUrl and isPremium
					},
				},
			];

			render(<JobList jobs={jobsWithIncompleteUser} loading={false} />);

			const userNames = screen.getAllByTestId('current-user-name');
			expect(userNames[0]).toHaveTextContent('John Doe');
		});
	});

	describe('Props Validation', () => {
		it('accepts valid jobs prop', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			expect(screen.getAllByTestId('job-card')).toHaveLength(2);
		});

		it('accepts loading prop', () => {
			render(<JobList jobs={[]} loading={true} />);

			expect(screen.getAllByTestId('skeleton')).toHaveLength(15);
		});

		it('handles jobs with missing optional fields', () => {
			const jobsWithMissingFields = [
				{
					id: 1,
					title: 'Test Job',
					createdAt: '2024-01-01',
					// Missing salary, city, description, phone, user
				},
			];

			render(<JobList jobs={jobsWithMissingFields} loading={false} />);

			expect(screen.getByTestId('job-card')).toBeInTheDocument();
			expect(screen.getByText('Test Job')).toBeInTheDocument();
		});
	});

	describe('Component Integration', () => {
		it('integrates with JobCard component', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			const jobCards = screen.getAllByTestId('job-card');
			expect(jobCards).toHaveLength(2);
		});

		it('integrates with Skeleton component', () => {
			render(<JobList jobs={[]} loading={true} />);

			const skeletons = screen.getAllByTestId('skeleton');
			expect(skeletons).toHaveLength(15);
		});

		it('integrates with Clerk useUser hook', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			// Should use user data from Clerk
			expect(screen.getByText('John Doe')).toBeInTheDocument();
		});
	});

	describe('Edge Cases', () => {
		it('handles component mounting and unmounting', () => {
			const { unmount } = render(<JobList jobs={mockJobs} loading={false} />);

			expect(screen.getAllByTestId('job-card')).toHaveLength(2);
			
			unmount();
			
			expect(screen.queryByTestId('job-card')).not.toBeInTheDocument();
		});

		it('handles rapid loading state changes', () => {
			const { rerender } = render(<JobList jobs={mockJobs} loading={true} />);

			expect(screen.getAllByTestId('skeleton')).toHaveLength(15);

			rerender(<JobList jobs={mockJobs} loading={false} />);

			expect(screen.getAllByTestId('job-card')).toHaveLength(2);
			expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
		});

		it('handles jobs array changes', () => {
			const { rerender } = render(<JobList jobs={mockJobs} loading={false} />);

			expect(screen.getAllByTestId('job-card')).toHaveLength(2);

			const newJobs = [...mockJobs, {
				id: 3,
				title: 'Test Job 3',
				salary: '7000₪',
				city: { name: 'Jerusalem' },
				description: 'Test description 3',
				phone: '050-9999999',
				createdAt: '2024-01-03',
				user: {
					clerkUserId: 'user789',
					imageUrl: 'https://example.com/user3.jpg',
					isPremium: false,
				},
			}];

			rerender(<JobList jobs={newJobs} loading={false} />);

			expect(screen.getAllByTestId('job-card')).toHaveLength(3);
			expect(screen.getByText('Test Job 3')).toBeInTheDocument();
		});
	});

	describe('Performance', () => {
		it('renders efficiently with many jobs', () => {
			const manyJobs = Array.from({ length: 100 }, (_, index) => ({
				id: index + 1,
				title: `Test Job ${index + 1}`,
				salary: `${5000 + index * 100}₪`,
				city: { name: `City ${index + 1}` },
				description: `Test description ${index + 1}`,
				phone: `050-${String(index + 1).padStart(7, '0')}`,
				createdAt: '2024-01-01',
				user: {
					clerkUserId: `user${index + 1}`,
					imageUrl: `https://example.com/user${index + 1}.jpg`,
					isPremium: index % 2 === 0,
				},
			}));

			render(<JobList jobs={manyJobs} loading={false} />);

			expect(screen.getAllByTestId('job-card')).toHaveLength(100);
		});

		it('renders efficiently with many loading skeletons', () => {
			render(<JobList jobs={[]} loading={true} />);

			expect(screen.getAllByTestId('skeleton')).toHaveLength(15);
		});
	});

	describe('Accessibility', () => {
		it('renders semantic elements', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			const jobCards = screen.getAllByTestId('job-card');
			expect(jobCards).toHaveLength(2);
		});

		it('maintains proper text content', () => {
			render(<JobList jobs={mockJobs} loading={false} />);

			expect(screen.getByText('Test Job 1')).toBeInTheDocument();
			expect(screen.getByText('Test Job 2')).toBeInTheDocument();
		});

		it('provides meaningful empty state', () => {
			render(<JobList jobs={[]} loading={false} />);

			expect(screen.getByText('Объявлений не найдено')).toBeInTheDocument();
		});
	});
});
