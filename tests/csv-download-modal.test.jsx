import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CSVDownloadModal from '../apps/client/src/components/CSVDownloadModal';

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		csvModalTitle: { value: 'Download Candidates CSV' },
		downloadAllCandidates: { value: 'Download All Candidates' },
		downloadAllDescription: { value: 'Download all candidates from the database' },
		downloadLastDays: { value: 'Download Last Days' },
		daysLabel: { value: 'days' },
		downloadLastDaysDescription: { value: 'Download candidates added in the last X days' },
		csvFormat: { value: 'CSV Format:' },
		csvFields: { value: 'Name, Contact, City, Description, Languages, Employment Type, Category, Documents, Gender, Status, Created Date' },
		cancelButton: { value: 'Cancel' },
		downloadButton: { value: 'Download CSV' },
	}),
}));

describe('CSVDownloadModal Component', () => {
	const mockOnClose = vi.fn();
	const mockOnDownload = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders modal when open', () => {
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		expect(screen.getByText('Download Candidates CSV')).toBeInTheDocument();
		expect(screen.getByText('Download All Candidates')).toBeInTheDocument();
		expect(screen.getByText('Download Last Days')).toBeInTheDocument();
	});

	test('does not render when closed', () => {
		render(
			<CSVDownloadModal
				isOpen={false}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		expect(screen.queryByText('Download Candidates CSV')).not.toBeInTheDocument();
	});

	test('shows date input when download all is unchecked', () => {
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const daysInput = screen.getByLabelText('Download Last Days');
		expect(daysInput).toBeInTheDocument();
		expect(daysInput).toHaveValue(7);
	});

	test('hides date input when download all is checked', async () => {
		const user = userEvent.setup();
		
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const downloadAllCheckbox = screen.getByLabelText('Download All Candidates');
		await user.click(downloadAllCheckbox);

		const daysInput = screen.queryByLabelText('Download Last Days');
		expect(daysInput).not.toBeInTheDocument();
	});

	test('calls onClose when cancel button is clicked', async () => {
		const user = userEvent.setup();
		
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const cancelButton = screen.getByText('Cancel');
		await user.click(cancelButton);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	test('calls onDownload with correct parameters when download button is clicked', async () => {
		const user = userEvent.setup();
		
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const downloadButton = screen.getByText('Download CSV');
		await user.click(downloadButton);

		expect(mockOnDownload).toHaveBeenCalledWith({
			days: 7,
			downloadAll: false
		});
	});

	test('calls onDownload with default value when input is empty', async () => {
		const user = userEvent.setup();
		
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const daysInput = screen.getByLabelText('Download Last Days');
		fireEvent.change(daysInput, { target: { value: '' } });

		const downloadButton = screen.getByText('Download CSV');
		await user.click(downloadButton);

		expect(mockOnDownload).toHaveBeenCalledWith({
			days: 7, // Should default to 7 when empty
			downloadAll: false
		});
	});

	test('calls onDownload with downloadAll true when checkbox is checked', async () => {
		const user = userEvent.setup();
		
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const downloadAllCheckbox = screen.getByLabelText('Download All Candidates');
		await user.click(downloadAllCheckbox);

		const downloadButton = screen.getByText('Download CSV');
		await user.click(downloadButton);

		expect(mockOnDownload).toHaveBeenCalledWith({
			days: null,
			downloadAll: true
		});
	});

	test('updates days value when input changes', async () => {
		const user = userEvent.setup();
		
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const daysInput = screen.getByLabelText('Download Last Days');
		await user.clear(daysInput);
		await user.type(daysInput, '14');

		expect(daysInput).toHaveValue(14);
	});

	test('allows clearing the input field', async () => {
		const user = userEvent.setup();
		
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const daysInput = screen.getByLabelText('Download Last Days');
		
		// Clear the input field
		await user.clear(daysInput);

		// HTML number inputs return null when empty
		expect(daysInput).toHaveValue(null);
	});

	test('handles valid input correctly', async () => {
		const user = userEvent.setup();
		
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const daysInput = screen.getByLabelText('Download Last Days');
		
		// Test valid input
		await user.clear(daysInput);
		await user.type(daysInput, '30');
		expect(daysInput).toHaveValue(30);

		// Test download with valid input
		const downloadButton = screen.getByText('Download CSV');
		await user.click(downloadButton);

		expect(mockOnDownload).toHaveBeenCalledWith({
			days: 30,
			downloadAll: false
		});
	});

	test('handles empty input with default value', async () => {
		const user = userEvent.setup();
		
		render(
			<CSVDownloadModal
				isOpen={true}
				onClose={mockOnClose}
				onDownload={mockOnDownload}
			/>
		);

		const daysInput = screen.getByLabelText('Download Last Days');
		
		// Clear the input
		await user.clear(daysInput);
		expect(daysInput).toHaveValue(null);

		// Test download with empty input (should default to 7)
		const downloadButton = screen.getByText('Download CSV');
		await user.click(downloadButton);

		expect(mockOnDownload).toHaveBeenCalledWith({
			days: 7, // Should default to 7 when empty
			downloadAll: false
		});
	});
});
