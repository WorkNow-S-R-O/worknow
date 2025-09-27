import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import Cancel from '../apps/client/src/pages/Cancel.jsx';
import { cancelPageContent } from '@mocks/pagesContent.js';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock('react-intlayer', () => ({
	useIntlayer: (key) => {
		if (key === 'cancelPage') {
			return cancelPageContent;
		}
		return {};
	},
}));

vi.mock('axios');

describe('Cancel page', () => {
	const originalLocation = window.location;

	beforeAll(() => {
		Object.defineProperty(window, 'location', {
			configurable: true,
			value: { href: '' },
		});
	});

	afterAll(() => {
		Object.defineProperty(window, 'location', {
			configurable: true,
			value: originalLocation,
		});
	});

	beforeEach(() => {
		vi.clearAllMocks();
		mockNavigate.mockClear();
		window.location.href = '';
	});

	it('redirects back home after timeout', () => {
		vi.useFakeTimers();
		render(<Cancel />);

		vi.advanceTimersByTime(8000);

		expect(mockNavigate).toHaveBeenCalledWith('/');
		vi.useRealTimers();
	});

	it('starts a new checkout session when user tries again', async () => {
		const user = userEvent.setup();
		axios.post.mockResolvedValueOnce({ data: { url: 'https://checkout.example.com' } });

		render(<Cancel />);

		await user.click(screen.getByRole('button', { name: cancelPageContent.try_again }));

		expect(axios.post).toHaveBeenCalledWith(
			'http://localhost:3001/api/payments/create-checkout-session',
			{ clerkUserId: 'test-user-id' },
		);
		expect(window.location.href).toBe('https://checkout.example.com');
	});

	it('shows an error toast when checkout creation fails', async () => {
		const user = userEvent.setup();
		axios.post.mockRejectedValueOnce(new Error('network'));

		render(<Cancel />);

		await user.click(screen.getByRole('button', { name: cancelPageContent.try_again }));

		expect(toast.error).toHaveBeenCalledWith(cancelPageContent.payment_transaction_error);
	});
});
