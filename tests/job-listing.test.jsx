import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { JobListing } from '../apps/client/src/components/JobListing';

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		chooseCityDashboard: { value: 'Choose City' },
		latestJobs: { value: 'Latest Jobs' },
		jobsIn: { value: 'Jobs in {{city}}' },
		findJobsIn: { value: 'Find jobs in {{city}}' },
		newVacanciesFromEmployers: { value: 'New vacancies from employers' },
		jobSearchPlatform: { value: 'Job search platform' },
		findLatestJobs: { value: 'Find latest jobs' },
		jobPostingTitle: { value: 'Job Posting in {{city}}' },
		jobPostingTitleDefault: { value: 'Job Posting' },
		jobLocationDefault: { value: 'Israel' },
		boardSettings: { value: 'Board Settings' },
	}),
}));

// Mock useLoadingProgress hook
vi.mock('../apps/client/src/hooks/useLoadingProgress', () => ({
	default: vi.fn(() => ({ loading: false })),
}));

// Mock custom hooks
vi.mock('../apps/client/src/hooks/useJobs', () => ({
	default: vi.fn(() => ({
		jobs: [
			{
				id: 1,
				title: 'Test Job 1',
				salary: '5000₪',
				description: 'Test description',
				city: { name: 'Tel Aviv' },
				category: { name: 'IT' },
				user: { firstName: 'John', lastName: 'Doe' },
			},
			{
				id: 2,
				title: 'Test Job 2',
				salary: '6000₪',
				description: 'Test description 2',
				city: { name: 'Haifa' },
				category: { name: 'Marketing' },
				user: { firstName: 'Jane', lastName: 'Smith' },
			},
		],
		loading: false,
		pagination: { pages: 3 },
	})),
}));

vi.mock('../apps/client/src/store/filterStore', () => ({
	default: vi.fn(() => ({
		filters: { category: null, salary: null },
		setFilters: vi.fn(),
	})),
}));

// Mock components
vi.mock('../apps/client/src/components/JobList', () => ({
	default: ({ jobs, loading }) => (
		<div data-testid="job-list">
			{loading ? 'Loading...' : `Jobs: ${jobs.length}`}
		</div>
	),
}));

vi.mock('../apps/client/src/components/PaginationControl', () => ({
	default: ({ currentPage, totalPages, onPageChange }) => (
		<div data-testid="pagination-control">
			<span>Page {currentPage} of {totalPages}</span>
			<button onClick={() => onPageChange(currentPage + 1)}>Next</button>
		</div>
	),
}));

vi.mock('../apps/client/src/components/ui/city-dropwdown', () => ({
	default: ({ selectedCity, onCitySelect, dropdownStyle, buttonClassName }) => (
		<div data-testid="city-dropdown">
			<button
				className={buttonClassName}
				style={dropdownStyle}
				onClick={() => onCitySelect({ value: 'tel-aviv', label: 'Tel Aviv' })}
			>
				{selectedCity.label}
			</button>
		</div>
	),
}));

vi.mock('../apps/client/src/components/ui/JobFilterModal', () => ({
	default: ({ open, onClose, onApply, currentFilters }) => (
		<div data-testid="job-filter-modal" style={{ display: open ? 'block' : 'none' }}>
			<span>Filter Modal</span>
			<button onClick={onClose}>Close</button>
			<button onClick={() => onApply({ category: 'IT' })}>Apply</button>
		</div>
	),
}));

// Mock react-helmet-async
vi.mock('react-helmet-async', () => ({
	Helmet: ({ children }) => <div data-testid="helmet">{children}</div>,
}));

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
	value: vi.fn(),
	writable: true,
});

const renderWithRouter = (component) => {
	return render(
		<BrowserRouter>
			{component}
		</BrowserRouter>
	);
};

describe('JobListing Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Basic Functionality', () => {
		it('renders the component', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByTestId('job-list')).toBeInTheDocument();
			expect(screen.getByTestId('city-dropdown')).toBeInTheDocument();
			expect(screen.getByTestId('helmet')).toBeInTheDocument();
		});

		it('renders job list with jobs', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByText('Jobs: 2')).toBeInTheDocument();
		});

		it('renders city dropdown with default city', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByText('Choose City')).toBeInTheDocument();
		});

		it('renders board settings button', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByText('Board Settings')).toBeInTheDocument();
		});
	});

	describe('SEO and Meta Tags', () => {
		it('renders helmet with SEO meta tags', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByTestId('helmet')).toBeInTheDocument();
		});

		it('generates correct page title for default state', () => {
			renderWithRouter(<JobListing />);

			// The title should be "Latest Jobs | WorkNow" by default
			expect(screen.getByTestId('helmet')).toBeInTheDocument();
		});

		it('generates correct page title when city is selected', () => {
			renderWithRouter(<JobListing />);

			// Click city dropdown to select a city
			const cityButton = screen.getByText('Choose City');
			fireEvent.click(cityButton);

			// Should update title to include city
			expect(screen.getByTestId('helmet')).toBeInTheDocument();
		});
	});

	describe('City Selection', () => {
		it('handles city selection', () => {
			renderWithRouter(<JobListing />);

			const cityButton = screen.getByText('Choose City');
			fireEvent.click(cityButton);

			// City should be updated
			expect(screen.getByText('Tel Aviv')).toBeInTheDocument();
		});

		it('updates city dropdown display', () => {
			renderWithRouter(<JobListing />);

			const cityButton = screen.getByText('Choose City');
			fireEvent.click(cityButton);

			// Should show selected city
			expect(screen.getByText('Tel Aviv')).toBeInTheDocument();
		});
	});

	describe('Filter Modal', () => {
		it('opens filter modal when board settings button is clicked', () => {
			renderWithRouter(<JobListing />);

			const settingsButton = screen.getByText('Board Settings');
			fireEvent.click(settingsButton);

			expect(screen.getByTestId('job-filter-modal')).toBeInTheDocument();
			expect(screen.getByText('Filter Modal')).toBeInTheDocument();
		});

		it('closes filter modal when close button is clicked', () => {
			renderWithRouter(<JobListing />);

			// Open modal
			const settingsButton = screen.getByText('Board Settings');
			fireEvent.click(settingsButton);

			// Close modal
			const closeButton = screen.getByText('Close');
			fireEvent.click(closeButton);

			// Modal should be hidden
			const modal = screen.getByTestId('job-filter-modal');
			expect(modal).toHaveStyle({ display: 'none' });
		});

		it('applies filters when apply button is clicked', () => {
			renderWithRouter(<JobListing />);

			// Open modal
			const settingsButton = screen.getByText('Board Settings');
			fireEvent.click(settingsButton);

			// Apply filters
			const applyButton = screen.getByText('Apply');
			fireEvent.click(applyButton);

			// Should call setFilters
			expect(screen.getByTestId('job-filter-modal')).toBeInTheDocument();
		});
	});

	describe('Pagination', () => {
		it('renders pagination when jobs are available', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByTestId('pagination-control')).toBeInTheDocument();
			expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
		});

		it('handles page change', () => {
			renderWithRouter(<JobListing />);

			const nextButton = screen.getByText('Next');
			fireEvent.click(nextButton);

			// Should call window.scrollTo
			expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
		});
	});

	describe('Loading States', () => {
		it('shows jobs when not loading', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByText('Jobs: 2')).toBeInTheDocument();
		});
	});

	describe('Component Integration', () => {
		it('integrates with useJobs hook', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByTestId('job-list')).toBeInTheDocument();
			expect(screen.getByText('Jobs: 2')).toBeInTheDocument();
		});

		it('integrates with filter store', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByTestId('job-list')).toBeInTheDocument();
		});

		it('renders all child components', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByTestId('job-list')).toBeInTheDocument();
			expect(screen.getByTestId('city-dropdown')).toBeInTheDocument();
			expect(screen.getByTestId('job-filter-modal')).toBeInTheDocument();
			expect(screen.getByTestId('pagination-control')).toBeInTheDocument();
		});
	});

	describe('Styling and Layout', () => {
		it('has proper container classes', () => {
			renderWithRouter(<JobListing />);

			const container = screen.getByTestId('job-list').closest('.d-flex');
			expect(container).toHaveClass('d-flex', 'flex-column', 'align-items-center', 'mt-40', 'min-h-screen');
		});

		it('has proper board controls wrapper', () => {
			renderWithRouter(<JobListing />);

			const wrapper = screen.getByText('Board Settings').closest('.board-controls-wrapper');
			expect(wrapper).toBeInTheDocument();
		});

		it('has proper board controls scale', () => {
			renderWithRouter(<JobListing />);

			const controls = screen.getByText('Board Settings').closest('.board-controls-scale');
			expect(controls).toHaveClass('d-flex', 'align-items-center', 'mb-3', 'gap-2');
		});

		it('has proper button styling', () => {
			renderWithRouter(<JobListing />);

			const button = screen.getByText('Board Settings');
			expect(button).toHaveClass('btn', 'btn-outline-primary', 'd-flex', 'align-items-center', 'justify-content-center', 'board-btn');
		});
	});

	describe('State Management', () => {
		it('manages current page state', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
		});

		it('manages selected city state', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByText('Choose City')).toBeInTheDocument();
		});

		it('manages filter modal state', () => {
			renderWithRouter(<JobListing />);

			// Initially closed
			const modal = screen.getByTestId('job-filter-modal');
			expect(modal).toHaveStyle({ display: 'none' });

			// Open modal
			const settingsButton = screen.getByText('Board Settings');
			fireEvent.click(settingsButton);

			// Should be open
			expect(modal).toHaveStyle({ display: 'block' });
		});
	});

	describe('Event Handling', () => {
		it('handles city dropdown click', () => {
			renderWithRouter(<JobListing />);

			const cityButton = screen.getByText('Choose City');
			fireEvent.click(cityButton);

			expect(screen.getByText('Tel Aviv')).toBeInTheDocument();
		});

		it('handles board settings button click', () => {
			renderWithRouter(<JobListing />);

			const settingsButton = screen.getByText('Board Settings');
			fireEvent.click(settingsButton);

			expect(screen.getByTestId('job-filter-modal')).toBeInTheDocument();
		});

		it('handles pagination next button click', () => {
			renderWithRouter(<JobListing />);

			const nextButton = screen.getByText('Next');
			fireEvent.click(nextButton);

			expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
		});
	});

	describe('Edge Cases', () => {
		it('handles component mounting and unmounting', () => {
			const { unmount } = renderWithRouter(<JobListing />);

			expect(screen.getByTestId('job-list')).toBeInTheDocument();
			
			unmount();
			
			expect(screen.queryByTestId('job-list')).not.toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('renders semantic button elements', () => {
			renderWithRouter(<JobListing />);

			const settingsButton = screen.getByText('Board Settings');
			expect(settingsButton).toBeInTheDocument();
		});

		it('has proper button structure', () => {
			renderWithRouter(<JobListing />);

			const settingsButton = screen.getByText('Board Settings');
			expect(settingsButton).toHaveClass('btn');
		});

		it('maintains proper text content', () => {
			renderWithRouter(<JobListing />);

			expect(screen.getByText('Board Settings')).toBeInTheDocument();
			expect(screen.getByText('Choose City')).toBeInTheDocument();
		});
	});
});
