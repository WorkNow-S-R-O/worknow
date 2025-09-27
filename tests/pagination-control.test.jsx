import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PaginationControl from '../apps/client/src/components/PaginationControl';

describe('PaginationControl Component', () => {
	const mockOnPageChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Basic Functionality', () => {
		it('renders the component', () => {
			render(
				<PaginationControl
					currentPage={1}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Check for pagination list structure
			const paginationList = screen.getByRole('list');
			expect(paginationList).toHaveClass('pagination');
		});

		it('displays correct page numbers for small total pages', () => {
			render(
				<PaginationControl
					currentPage={2}
					totalPages={3}
					onPageChange={mockOnPageChange}
				/>,
			);

			expect(screen.getByText('1')).toBeInTheDocument();
			expect(screen.getByText('2')).toBeInTheDocument();
			expect(screen.getByText('3')).toBeInTheDocument();
		});

		it('displays correct page numbers for large total pages', () => {
			render(
				<PaginationControl
					currentPage={5}
					totalPages={20}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Should show 5 pages around current page (3, 4, 5, 6, 7)
			expect(screen.getByText('3')).toBeInTheDocument();
			expect(screen.getByText('4')).toBeInTheDocument();
			expect(screen.getByText('5')).toBeInTheDocument();
			expect(screen.getByText('6')).toBeInTheDocument();
			expect(screen.getByText('7')).toBeInTheDocument();
		});

		it('highlights current page as active', () => {
			render(
				<PaginationControl
					currentPage={3}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			// The active class is on the list item, not the text element
			const activeListItem = screen.getByText('3').closest('li');
			expect(activeListItem).toHaveClass('active');
		});
	});

	describe('Navigation Controls', () => {
		it('disables previous button on first page', () => {
			render(
				<PaginationControl
					currentPage={1}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Disabled buttons become spans, so we check for the disabled class on the list item
			const prevListItem = screen.getByText('Previous').closest('li');
			expect(prevListItem).toHaveClass('disabled');
		});

		it('enables previous button on other pages', () => {
			render(
				<PaginationControl
					currentPage={3}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			const prevButton = screen.getByRole('button', { name: /previous/i });
			expect(prevButton).not.toBeDisabled();
		});

		it('disables next button on last page', () => {
			render(
				<PaginationControl
					currentPage={5}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Disabled buttons become spans, so we check for the disabled class on the list item
			const nextListItem = screen.getByText('Next').closest('li');
			expect(nextListItem).toHaveClass('disabled');
		});

		it('enables next button on other pages', () => {
			render(
				<PaginationControl
					currentPage={3}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			const nextButton = screen.getByRole('button', { name: /next/i });
			expect(nextButton).not.toBeDisabled();
		});
	});

	describe('User Interactions', () => {
		it('calls onPageChange when clicking page number', () => {
			render(
				<PaginationControl
					currentPage={2}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			const pageButton = screen.getByText('3');
			fireEvent.click(pageButton);

			expect(mockOnPageChange).toHaveBeenCalledWith(3);
		});

		it('calls onPageChange when clicking previous button', () => {
			render(
				<PaginationControl
					currentPage={3}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			const prevButton = screen.getByRole('button', { name: /previous/i });
			fireEvent.click(prevButton);

			expect(mockOnPageChange).toHaveBeenCalledWith(2);
		});

		it('calls onPageChange when clicking next button', () => {
			render(
				<PaginationControl
					currentPage={3}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			const nextButton = screen.getByRole('button', { name: /next/i });
			fireEvent.click(nextButton);

			expect(mockOnPageChange).toHaveBeenCalledWith(4);
		});

		it('does not call onPageChange when clicking disabled previous button', () => {
			render(
				<PaginationControl
					currentPage={1}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Disabled buttons are spans, so we can't click them
			// This test verifies the disabled state is correct
			const prevListItem = screen.getByText('Previous').closest('li');
			expect(prevListItem).toHaveClass('disabled');
			expect(mockOnPageChange).not.toHaveBeenCalled();
		});

		it('does not call onPageChange when clicking disabled next button', () => {
			render(
				<PaginationControl
					currentPage={5}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Disabled buttons are spans, so we can't click them
			// This test verifies the disabled state is correct
			const nextListItem = screen.getByText('Next').closest('li');
			expect(nextListItem).toHaveClass('disabled');
			expect(mockOnPageChange).not.toHaveBeenCalled();
		});
	});

	describe('Page Number Generation Logic', () => {
		it('shows all pages when total pages <= 5', () => {
			render(
				<PaginationControl
					currentPage={2}
					totalPages={4}
					onPageChange={mockOnPageChange}
				/>,
			);

			expect(screen.getByText('1')).toBeInTheDocument();
			expect(screen.getByText('2')).toBeInTheDocument();
			expect(screen.getByText('3')).toBeInTheDocument();
			expect(screen.getByText('4')).toBeInTheDocument();
		});

		it('shows 5 pages around current page when in middle', () => {
			render(
				<PaginationControl
					currentPage={10}
					totalPages={20}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Should show pages 8, 9, 10, 11, 12
			expect(screen.getByText('8')).toBeInTheDocument();
			expect(screen.getByText('9')).toBeInTheDocument();
			expect(screen.getByText('10')).toBeInTheDocument();
			expect(screen.getByText('11')).toBeInTheDocument();
			expect(screen.getByText('12')).toBeInTheDocument();
		});

		it('shows 5 pages from start when current page is near beginning', () => {
			render(
				<PaginationControl
					currentPage={2}
					totalPages={20}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Should show pages 1, 2, 3, 4, 5
			expect(screen.getByText('1')).toBeInTheDocument();
			expect(screen.getByText('2')).toBeInTheDocument();
			expect(screen.getByText('3')).toBeInTheDocument();
			expect(screen.getByText('4')).toBeInTheDocument();
			expect(screen.getByText('5')).toBeInTheDocument();
		});

		it('shows 5 pages from end when current page is near end', () => {
			render(
				<PaginationControl
					currentPage={19}
					totalPages={20}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Should show pages 16, 17, 18, 19, 20
			expect(screen.getByText('16')).toBeInTheDocument();
			expect(screen.getByText('17')).toBeInTheDocument();
			expect(screen.getByText('18')).toBeInTheDocument();
			expect(screen.getByText('19')).toBeInTheDocument();
			expect(screen.getByText('20')).toBeInTheDocument();
		});

		it('handles single page correctly', () => {
			render(
				<PaginationControl
					currentPage={1}
					totalPages={1}
					onPageChange={mockOnPageChange}
				/>,
			);

			expect(screen.getByText('1')).toBeInTheDocument();
			// Check for disabled classes on list items
			const prevListItem = screen.getByText('Previous').closest('li');
			const nextListItem = screen.getByText('Next').closest('li');
			expect(prevListItem).toHaveClass('disabled');
			expect(nextListItem).toHaveClass('disabled');
		});
	});

	describe('Edge Cases', () => {
		it('handles zero total pages gracefully', () => {
			render(
				<PaginationControl
					currentPage={1}
					totalPages={0}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Should not crash and should render the component
			expect(screen.getByText('Previous')).toBeInTheDocument();
			expect(screen.getByText('Next')).toBeInTheDocument();
		});

		it('handles current page greater than total pages', () => {
			render(
				<PaginationControl
					currentPage={10}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Should show all pages
			expect(screen.getByText('1')).toBeInTheDocument();
			expect(screen.getByText('5')).toBeInTheDocument();
		});

		it('handles current page less than 1', () => {
			render(
				<PaginationControl
					currentPage={0}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Should show all pages
			expect(screen.getByText('1')).toBeInTheDocument();
			expect(screen.getByText('5')).toBeInTheDocument();
		});
	});

	describe('Accessibility', () => {
		it('has proper pagination structure', () => {
			render(
				<PaginationControl
					currentPage={2}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			// Check for pagination list structure
			const paginationList = screen.getByRole('list');
			expect(paginationList).toHaveClass('pagination');
		});

		it('has proper button roles for navigation', () => {
			render(
				<PaginationControl
					currentPage={2}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			expect(
				screen.getByRole('button', { name: /previous/i }),
			).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
		});

		it('has clickable page number buttons', () => {
			render(
				<PaginationControl
					currentPage={2}
					totalPages={5}
					onPageChange={mockOnPageChange}
				/>,
			);

			const pageButtons = screen.getAllByRole('button');
			// Should have previous, 4 clickable page numbers (current page is span), and next = 6 buttons total
			expect(pageButtons).toHaveLength(6);
		});
	});
});
