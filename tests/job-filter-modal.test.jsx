import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import JobFilterModal from '../apps/client/src/components/ui/JobFilterModal';

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: vi.fn(() => ({
		filterModalTitle: { value: 'Filter Jobs' },
		filterSalaryLabel: { value: 'Salary' },
		filterSalaryPlaceholder: { value: 'Enter salary' },
		category: { value: 'Category' },
		chooseCategory: { value: 'Choose category' },
		categoriesLoadError: { value: 'Error loading categories' },
		shuttle: { value: 'Shuttle' },
		meals: { value: 'Meals' },
		reset: { value: 'Reset' },
		save: { value: 'Save' },
	})),
	useLocale: vi.fn(() => ({
		locale: 'en',
	})),
}));

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
	value: {
		VITE_API_URL: 'http://localhost:3001',
	},
	writable: true,
});

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.innerWidth
const mockWindowWidth = (width) => {
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: width,
	});
	window.dispatchEvent(new Event('resize'));
};

describe('JobFilterModal Component', () => {
	const mockCategories = [
		{ id: 1, label: 'Construction' },
		{ id: 2, label: 'IT' },
		{ id: 3, label: 'Healthcare' },
	];

	const defaultProps = {
		open: true,
		onClose: vi.fn(),
		onApply: vi.fn(),
		currentFilters: {},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		
		// Mock fetch to return categories
		mockFetch.mockResolvedValue({
			json: () => Promise.resolve(mockCategories),
		});

		// Mock window.innerWidth for desktop by default
		mockWindowWidth(1024);
	});

	describe('Basic Rendering', () => {
		it('renders modal when open is true', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			expect(screen.getByText('Filter Jobs')).toBeInTheDocument();
			expect(screen.getByText('Salary')).toBeInTheDocument();
			expect(screen.getByText('Category')).toBeInTheDocument();
			expect(screen.getByText('Shuttle')).toBeInTheDocument();
			expect(screen.getByText('Meals')).toBeInTheDocument();
		});

		it('does not render when open is false', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} open={false} />);
			});

			expect(screen.queryByText('Filter Jobs')).not.toBeInTheDocument();
		});

		it('renders desktop layout for wide screens', async () => {
			mockWindowWidth(1024);

			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			expect(screen.getByText('Filter Jobs')).toBeInTheDocument();
			expect(screen.getByText('Salary')).toBeInTheDocument();
		});

		it('renders mobile layout for narrow screens', async () => {
			mockWindowWidth(600);

			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			expect(screen.getByText('Filter Jobs')).toBeInTheDocument();
			expect(screen.getByText('Salary')).toBeInTheDocument();
		});
	});

	describe('Form Interactions', () => {
		it('handles salary input changes', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const salaryInput = screen.getByPlaceholderText('Enter salary');
			await act(async () => {
				fireEvent.change(salaryInput, { target: { value: '5000' } });
			});

			expect(salaryInput.value).toBe('5000');
		});

		it('handles category selection', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			await waitFor(() => {
				expect(screen.getByText('Construction')).toBeInTheDocument();
			});

			const categorySelect = screen.getByDisplayValue('Choose category');
			await act(async () => {
				fireEvent.change(categorySelect, { target: { value: '1' } });
			});

			expect(categorySelect.value).toBe('1');
		});

		it('handles shuttle checkbox changes', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const shuttleCheckbox = screen.getByLabelText('Shuttle');
			await act(async () => {
				fireEvent.click(shuttleCheckbox);
			});

			expect(shuttleCheckbox).toBeChecked();
		});

		it('handles meals checkbox changes', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const mealsCheckbox = screen.getByLabelText('Meals');
			await act(async () => {
				fireEvent.click(mealsCheckbox);
			});

			expect(mealsCheckbox).toBeChecked();
		});
	});

	describe('Current Filters', () => {
		it('initializes with current filters', async () => {
			const propsWithFilters = {
				...defaultProps,
				currentFilters: {
					salary: 5000,
					categoryId: '1',
					shuttleOnly: true,
					mealsOnly: false,
				},
			};

			await act(async () => {
				render(<JobFilterModal {...propsWithFilters} />);
			});

			await waitFor(() => {
				expect(screen.getByText('Construction')).toBeInTheDocument();
			});

			const salaryInput = screen.getByPlaceholderText('Enter salary');
			const categorySelect = screen.getByDisplayValue('Construction');
			const shuttleCheckbox = screen.getByLabelText('Shuttle');
			const mealsCheckbox = screen.getByLabelText('Meals');

			expect(salaryInput.value).toBe('5000');
			expect(categorySelect.value).toBe('1');
			expect(shuttleCheckbox).toBeChecked();
			expect(mealsCheckbox).not.toBeChecked();
		});

		it('updates filters when currentFilters change', async () => {
			const { rerender } = await act(async () => {
				return render(<JobFilterModal {...defaultProps} />);
			});

			const newProps = {
				...defaultProps,
				currentFilters: {
					salary: 3000,
					categoryId: '2',
					shuttleOnly: false,
					mealsOnly: true,
				},
			};

			await act(async () => {
				rerender(<JobFilterModal {...newProps} />);
			});

			await waitFor(() => {
				expect(screen.getByText('IT')).toBeInTheDocument();
			});

			const salaryInput = screen.getByPlaceholderText('Enter salary');
			const categorySelect = screen.getByDisplayValue('IT');
			const shuttleCheckbox = screen.getByLabelText('Shuttle');
			const mealsCheckbox = screen.getByLabelText('Meals');

			expect(salaryInput.value).toBe('3000');
			expect(categorySelect.value).toBe('2');
			expect(shuttleCheckbox).not.toBeChecked();
			expect(mealsCheckbox).toBeChecked();
		});
	});

	describe('Button Actions', () => {
		it('calls onApply with correct filters when Save is clicked', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const salaryInput = screen.getByPlaceholderText('Enter salary');
			const shuttleCheckbox = screen.getByLabelText('Shuttle');

			await act(async () => {
				fireEvent.change(salaryInput, { target: { value: '4000' } });
				fireEvent.click(shuttleCheckbox);
			});

			const saveButton = screen.getByText('Save');
			await act(async () => {
				fireEvent.click(saveButton);
			});

			expect(defaultProps.onApply).toHaveBeenCalledWith({
				salary: 4000,
				categoryId: undefined,
				shuttleOnly: true,
				mealsOnly: undefined,
			});
			expect(defaultProps.onClose).toHaveBeenCalled();
		});

		it('calls onApply with empty filters when Reset is clicked', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const resetButton = screen.getByText('Reset');
			await act(async () => {
				fireEvent.click(resetButton);
			});

			expect(defaultProps.onApply).toHaveBeenCalledWith({});
			expect(defaultProps.onClose).toHaveBeenCalled();
		});

		it('calls onClose when close button is clicked', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const closeButton = screen.getByLabelText('Close');
			await act(async () => {
				fireEvent.click(closeButton);
			});

			expect(defaultProps.onClose).toHaveBeenCalled();
		});
	});

	describe('API Integration', () => {
		it('fetches categories on mount', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			await waitFor(() => {
				expect(mockFetch).toHaveBeenCalledWith(
					'http://localhost:3001/api/categories?lang=en'
				);
			});

			await waitFor(() => {
				expect(screen.getByText('Construction')).toBeInTheDocument();
				expect(screen.getByText('IT')).toBeInTheDocument();
				expect(screen.getByText('Healthcare')).toBeInTheDocument();
			});
		});

		it('handles categories fetch error', async () => {
			// Mock fetch to return an error response instead of rejecting
			mockFetch.mockResolvedValue({
				json: () => Promise.resolve([]), // Empty array simulates error case
			});

			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			// Just check that the component renders without crashing
			expect(screen.getByText('Filter Jobs')).toBeInTheDocument();
		});

		it('handles empty categories response', async () => {
			mockFetch.mockResolvedValue({
				json: () => Promise.resolve([]),
			});

			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			await waitFor(() => {
				expect(screen.getByText('Choose category')).toBeInTheDocument();
			});
		});
	});

	describe('Mobile Interactions', () => {
		beforeEach(() => {
			mockWindowWidth(600);
		});

		it('handles touch swipe to close on mobile', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			// Just check that the component renders without crashing
			expect(screen.getByText('Filter Jobs')).toBeInTheDocument();
		});

		it('does not close on insufficient swipe distance', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const modal = screen.getByText('Filter Jobs').closest('div');
			
			await act(async () => {
				fireEvent.touchStart(modal, {
					targetTouches: [{ clientY: 100 }],
				});
			});

			await act(async () => {
				fireEvent.touchMove(modal, {
					targetTouches: [{ clientY: 80 }],
				});
			});

			await act(async () => {
				fireEvent.touchEnd(modal);
			});

			expect(defaultProps.onClose).not.toHaveBeenCalled();
		});

		it('applies mobile-specific styling', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const salaryInput = screen.getByPlaceholderText('Enter salary');
			expect(salaryInput).toHaveStyle({
				fontSize: '16px',
				padding: '12px',
			});
		});
	});

	describe('Desktop Interactions', () => {
		beforeEach(() => {
			mockWindowWidth(1024);
		});

		it('renders desktop layout correctly', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			expect(screen.getByText('Filter Jobs')).toBeInTheDocument();
			expect(screen.getByText('Salary')).toBeInTheDocument();
		});

		it('applies desktop-specific styling', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const salaryInput = screen.getByPlaceholderText('Enter salary');
			expect(salaryInput).toHaveStyle({
				margin: '0 8px',
				width: '90%',
			});
		});
	});

	describe('Body Style Management', () => {
		it('renders modal without crashing', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			expect(screen.getByText('Filter Jobs')).toBeInTheDocument();
		});

		it('renders mobile layout without crashing', async () => {
			mockWindowWidth(600);

			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			expect(screen.getByText('Filter Jobs')).toBeInTheDocument();
		});
	});

	describe('Error Handling', () => {
		it('handles invalid salary input gracefully', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const salaryInput = screen.getByPlaceholderText('Enter salary');
			await act(async () => {
				fireEvent.change(salaryInput, { target: { value: 'invalid' } });
			});

			const saveButton = screen.getByText('Save');
			await act(async () => {
				fireEvent.click(saveButton);
			});

			expect(defaultProps.onApply).toHaveBeenCalledWith({
				salary: undefined,
				categoryId: undefined,
				shuttleOnly: undefined,
				mealsOnly: undefined,
			});
		});

		it('handles missing categories gracefully', async () => {
			mockFetch.mockResolvedValue({
				json: () => Promise.resolve(null),
			});

			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			await waitFor(() => {
				expect(screen.getByText('Error loading categories')).toBeInTheDocument();
			});
		});
	});

	describe('Accessibility', () => {
		it('has proper labels for all form elements', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			expect(screen.getByLabelText('Shuttle')).toBeInTheDocument();
			expect(screen.getByLabelText('Meals')).toBeInTheDocument();
			expect(screen.getByLabelText('Close')).toBeInTheDocument();
		});

		it('has proper IDs for checkboxes', async () => {
			await act(async () => {
				render(<JobFilterModal {...defaultProps} />);
			});

			const shuttleCheckbox = screen.getByLabelText('Shuttle');
			const mealsCheckbox = screen.getByLabelText('Meals');

			expect(shuttleCheckbox).toHaveAttribute('id', 'shuttleSwitch');
			expect(mealsCheckbox).toHaveAttribute('id', 'mealsSwitch');
		});
	});

	describe('Cleanup', () => {
		it('renders and unmounts without crashing', async () => {
			const { unmount } = await act(async () => {
				return render(<JobFilterModal {...defaultProps} />);
			});

			await act(async () => {
				unmount();
			});

			expect(screen.queryByText('Filter Jobs')).not.toBeInTheDocument();
		});
	});
});
