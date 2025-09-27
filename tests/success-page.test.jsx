import { render, waitFor } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import { successPageContent } from '@mocks/pagesContent.js';
import Success from '../apps/client/src/pages/Success.jsx';

const mockNavigate = vi.fn();
let searchParamsMock = new URLSearchParams();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useSearchParams: () => [searchParamsMock, vi.fn()],
		useNavigate: () => mockNavigate,
	};
});

vi.mock('react-intlayer', () => ({
	useIntlayer: (key) => {
		if (key === 'successPage') {
			return successPageContent;
		}
		return {};
	},
}));

vi.mock('axios');

describe('Success page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockNavigate.mockClear();
		searchParamsMock = new URLSearchParams();
	});

	it('activates premium and redirects when session id is present', async () => {
		searchParamsMock = new URLSearchParams({ session_id: 'sess_123' });
		axios.post.mockResolvedValueOnce({ data: { success: true } });

		render(<Success />);

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(
				'http://localhost:3001/api/payments/activate-premium',
				{ sessionId: 'sess_123', clerkUserId: 'test-user-id' },
			);
		});

		expect(toast.success).toHaveBeenCalledWith(
			successPageContent.premiumActivated.value,
		);
		expect(mockNavigate).toHaveBeenCalledWith('/premium?fromSuccess=true');
	});

	it('shows error toast when activation fails', async () => {
		searchParamsMock = new URLSearchParams({ session_id: 'sess_456' });
		axios.post.mockRejectedValueOnce(new Error('activation failed'));

		render(<Success />);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				successPageContent.activationError.value,
			);
		});
	});

	it('does not call API when session id is missing', async () => {
		searchParamsMock = new URLSearchParams();

		render(<Success />);

		expect(axios.post).not.toHaveBeenCalled();
		expect(mockNavigate).not.toHaveBeenCalled();
	});
});
