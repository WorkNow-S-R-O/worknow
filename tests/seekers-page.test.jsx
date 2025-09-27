import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { downloadSeekersCSV } from '@/utils';

import Seekers from '../apps/client/src/pages/Seekers.jsx';

const useSeekersMock = vi.fn();
const loadingProgressMocks = {
	startLoadingWithProgress: vi.fn(),
	completeLoading: vi.fn(),
};
const setFiltersMock = vi.fn();

const filterModalProps = { current: null };
const csvModalProps = { current: null };
const addModalProps = { current: null };
const paginationProps = { current: null };

vi.mock('@/hooks', () => ({
	useSeekers: (...args) => useSeekersMock(...args),
	useLoadingProgress: () => loadingProgressMocks,
}));

vi.mock('@/store', () => ({
	useSeekerFilterStore: () => ({
		filters: {},
		setFilters: setFiltersMock,
	}),
}));

vi.mock('@/components', () => ({
	CSVDownloadModal: (props) => {
		csvModalProps.current = props;
		return props.isOpen ? <div data-testid="csv-modal" /> : null;
	},
	PaginationControl: (props) => {
		paginationProps.current = props;
		return <div data-testid="pagination">Page {props.page}</div>;
	},
}));

vi.mock('@/components/form', () => ({
	AddSeekerModal: (props) => {
		addModalProps.current = props;
		return props.isOpen ? <div data-testid="add-modal" /> : null;
	},
}));

vi.mock('@/components/ui', () => ({
	SeekerFilterModal: (props) => {
		filterModalProps.current = props;
		return props.isOpen ? <div data-testid="filter-modal" /> : null;
	},
}));

vi.mock('@/utils', () => ({
	downloadSeekersCSV: vi.fn(),
}));

vi.mock('react-intlayer', () => ({
	useIntlayer: (key) => {
		if (key === 'seekers') {
			return new Proxy(
				{},
				{
					get: (_, prop) => ({ value: String(prop) }),
				},
			);
		}
		return {};
	},
}));

vi.mock('axios');

describe('Seekers page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
		axios.get.mockReset();
		downloadSeekersCSV.mockReset();
	});

	function setupSeekers({ isPremiumUser }) {
		useSeekersMock.mockReturnValue({
			seekers: [
				{
					id: '1',
					name: 'Alice Candidate',
					employment: 'full',
					category: 'Care',
					languages: ['English'],
					documents: 'Passport',
					city: 'Tel Aviv',
					description: 'A caring person',
					contact: '050-0000, facebook.com/alice',
					facebook: null,
					createdAt: new Date().toISOString(),
				},
			],
			loading: false,
			error: null,
			pagination: { page: 1, pages: 1, totalCount: 1 },
		});

		axios.get.mockImplementation((url) => {
			if (url.includes('/api/newsletter/check-subscription')) {
				return Promise.resolve({ data: { isSubscribed: false } });
			}
			return Promise.resolve({ data: { isPremium: isPremiumUser } });
		});

		render(
			<MemoryRouter>
				<Seekers />
			</MemoryRouter>,
		);
	}

	it('shows full contact details for premium users', async () => {
		setupSeekers({ isPremiumUser: true });

		await waitFor(() => {
			expect(screen.getByText('Alice Candidate')).toBeInTheDocument();
		});

		const contactLink = screen.getByRole('link', { name: '050-0000' });
		expect(contactLink).toHaveAttribute('href', '/seekers/1');

		const facebookIcon = screen.getByTestId('facebook-icon');
		const facebookLink = facebookIcon.closest('a');
		expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/alice');
	});

	it('obfuscates contact details for non-premium users', async () => {
		setupSeekers({ isPremiumUser: false });

		await waitFor(() => {
			expect(screen.getByText('Alice Candidate')).toBeInTheDocument();
		});

		expect(screen.getAllByText('****')[0]).toBeInTheDocument();
	});

	it('applies filters via the modal', async () => {
		setupSeekers({ isPremiumUser: true });

		await waitFor(() => {
			expect(filterModalProps.current).toBeTruthy();
		});

		await act(async () => {
			filterModalProps.current.onApply({ city: 'Tel Aviv' });
		});

		expect(setFiltersMock).toHaveBeenCalledWith({ city: 'Tel Aviv' });
		expect(toast.success).toHaveBeenCalledWith('filtersApplied');
	});

	it('delegates CSV generation to the utility helper', async () => {
		setupSeekers({ isPremiumUser: true });

		await waitFor(() => {
			expect(csvModalProps.current).toBeTruthy();
		});

		await act(async () => {
			await csvModalProps.current.onDownload({ downloadAll: true });
		});

		expect(downloadSeekersCSV).toHaveBeenCalledWith(
			expect.objectContaining({
				isPremium: true,
				filters: {},
				seekers: expect.any(Array),
			}),
		);
	});
});
