import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import VerificationModal from '../apps/client/src/components/ui/VerificationModal';

// Mock axios
vi.mock('axios', () => ({
	default: {
		post: vi.fn(() => Promise.resolve({ data: {} })),
	},
}));

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		verificationTitle: { value: 'Email Verification' },
		verificationSent: { value: 'Verification code sent!' },
		verificationSentTo: { value: 'Code sent to email:' },
		verificationDescription: { value: 'Enter the 6-digit code sent to your email' },
		verificationCodeLabel: { value: 'Verification Code *' },
		verificationCodePlaceholder: { value: 'Enter 6-digit code' },
		verificationCodeRequired: { value: 'Please enter verification code' },
		verificationSuccess: { value: 'Email verified successfully!' },
		verificationError: { value: 'Verification failed' },
		verificationCodeResent: { value: 'Code resent successfully' },
		resendError: { value: 'Failed to resend code' },
		verificationTimeLeft: { value: 'Time remaining:' },
		verificationCodeExpired: { value: 'Code expired' },
		verificationResend: { value: 'Resend Code' },
		verificationResendWait: { value: 'Resend available in' },
		verificationVerifying: { value: 'Verifying...' },
		verificationVerify: { value: 'Verify' },
		cancel: { value: 'Cancel' },
	}),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
	value: {
		VITE_API_URL: 'http://localhost:3000',
	},
	writable: true,
});

// Mock window.innerWidth
const mockWindowWidth = (width) => {
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: width,
	});
};

describe('VerificationModal Component', () => {
	const defaultProps = {
		open: true,
		onClose: vi.fn(),
		email: 'test@example.com',
		subscriptionData: { plan: 'premium' },
		onVerificationSuccess: vi.fn(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
		mockWindowWidth(1024); // Desktop by default
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('Basic Functionality', () => {
		it('renders the component when open', () => {
			render(<VerificationModal {...defaultProps} />);
			
			expect(screen.getByText('Email Verification')).toBeInTheDocument();
			expect(screen.getByText('Verification code sent!')).toBeInTheDocument();
			expect(screen.getByText('test@example.com')).toBeInTheDocument();
		});

		it('does not render when closed', () => {
			render(<VerificationModal {...defaultProps} open={false} />);
			
			expect(screen.queryByText('Email Verification')).not.toBeInTheDocument();
		});

		it('renders with proper email display', () => {
			render(<VerificationModal {...defaultProps} email="user@test.com" />);
			
			expect(screen.getByText('user@test.com')).toBeInTheDocument();
		});

		it('renders verification input field', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const input = screen.getByPlaceholderText('Enter 6-digit code');
			expect(input).toBeInTheDocument();
			expect(input).toHaveAttribute('type', 'text');
			expect(input).toHaveAttribute('maxLength', '6');
		});
	});

	describe('User Interactions', () => {
		it('handles verification code input', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const input = screen.getByPlaceholderText('Enter 6-digit code');
			fireEvent.change(input, { target: { value: '123456' } });
			
			expect(input.value).toBe('123456');
		});

		it('filters non-numeric characters from input', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const input = screen.getByPlaceholderText('Enter 6-digit code');
			fireEvent.change(input, { target: { value: 'abc123def456' } });
			
			expect(input.value).toBe('123456');
		});

		it('limits input to 6 characters', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const input = screen.getByPlaceholderText('Enter 6-digit code');
			fireEvent.change(input, { target: { value: '123456789' } });
			
			expect(input.value).toBe('123456');
		});

		it('calls onClose when close button is clicked', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const closeButton = screen.getByLabelText('Close');
			fireEvent.click(closeButton);
			
			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});

		it('calls onClose when cancel button is clicked', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const cancelButton = screen.getByText('Cancel');
			fireEvent.click(cancelButton);
			
			expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
		});
	});

	describe('Timer Functionality', () => {
		it('displays initial timer countdown', () => {
			render(<VerificationModal {...defaultProps} />);
			
			expect(screen.getByText('Time remaining:')).toBeInTheDocument();
			expect(screen.getByText('10:00')).toBeInTheDocument();
		});

		it('updates timer countdown', () => {
			render(<VerificationModal {...defaultProps} />);
			
			act(() => {
				vi.advanceTimersByTime(1000);
			});
			
			expect(screen.getByText('9:59')).toBeInTheDocument();
		});

		it('shows expired message when timer reaches zero', () => {
			render(<VerificationModal {...defaultProps} />);
			
			act(() => {
				vi.advanceTimersByTime(600000); // 10 minutes
			});
			
			expect(screen.getByText('Code expired')).toBeInTheDocument();
		});

		it('disables verify button when timer expires', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const input = screen.getByPlaceholderText('Enter 6-digit code');
			const verifyButton = screen.getByText('Verify');
			
			fireEvent.change(input, { target: { value: '123456' } });
			
			act(() => {
				vi.advanceTimersByTime(600000); // 10 minutes
			});
			
			expect(verifyButton).toBeDisabled();
		});
	});

	describe('Resend Functionality', () => {
		it('shows resend button with cooldown initially', () => {
			render(<VerificationModal {...defaultProps} />);
			
			// Check for the button text that includes both parts
			expect(screen.getByText(/Resend available in/)).toBeInTheDocument();
		});

		it('enables resend button after cooldown', () => {
			render(<VerificationModal {...defaultProps} />);
			
			act(() => {
				vi.advanceTimersByTime(60000); // 1 minute
			});
			
			expect(screen.getByText('Resend Code')).toBeInTheDocument();
		});
	});

	describe('API Integration', () => {
		it('shows loading state during verification', async () => {
			const axios = await import('axios');
			
			vi.mocked(axios.default.post).mockImplementation(() => 
				new Promise(resolve => setTimeout(resolve, 1000))
			);

			render(<VerificationModal {...defaultProps} />);
			
			const input = screen.getByPlaceholderText('Enter 6-digit code');
			const verifyButton = screen.getByText('Verify');
			
			fireEvent.change(input, { target: { value: '123456' } });
			fireEvent.click(verifyButton);
			
			expect(screen.getByText('Verifying...')).toBeInTheDocument();
			expect(verifyButton).toBeDisabled();
		});
	});

	describe('Responsive Design', () => {
		it('renders desktop layout for wide screens', () => {
			mockWindowWidth(1024);
			render(<VerificationModal {...defaultProps} />);
			
			// Check for desktop-specific elements
			const title = screen.getByText('Email Verification');
			expect(title).toHaveClass('mb-4', 'font-size-10');
		});

		it('renders mobile layout for narrow screens', () => {
			mockWindowWidth(768);
			render(<VerificationModal {...defaultProps} />);
			
			// Check for mobile-specific elements
			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toHaveStyle({ fontSize: '24px' });
		});

		it('shows mobile-specific close button', () => {
			mockWindowWidth(768);
			render(<VerificationModal {...defaultProps} />);
			
			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toHaveStyle({ fontSize: '24px' });
		});
	});

	describe('Edge Cases', () => {
		it('handles component unmounting during timer', () => {
			const { unmount } = render(<VerificationModal {...defaultProps} />);
			
			act(() => {
				vi.advanceTimersByTime(1000);
			});
			
			unmount();
			
			// Should not throw errors
			act(() => {
				vi.advanceTimersByTime(1000);
			});
		});

		it('disables buttons during verification', async () => {
			const axios = await import('axios');
			
			vi.mocked(axios.default.post).mockImplementation(() => 
				new Promise(resolve => setTimeout(resolve, 1000))
			);

			render(<VerificationModal {...defaultProps} />);
			
			const input = screen.getByPlaceholderText('Enter 6-digit code');
			const verifyButton = screen.getByText('Verify');
			const cancelButton = screen.getByText('Cancel');
			
			fireEvent.change(input, { target: { value: '123456' } });
			fireEvent.click(verifyButton);
			
			expect(verifyButton).toBeDisabled();
			expect(cancelButton).toBeDisabled();
			expect(input).toBeDisabled();
		});
	});

	describe('Accessibility', () => {
		it('has proper ARIA labels', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toBeInTheDocument();
		});

		it('has proper form labels', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const input = screen.getByPlaceholderText('Enter 6-digit code');
			expect(input).toHaveAttribute('required');
		});

		it('has proper button roles', () => {
			render(<VerificationModal {...defaultProps} />);
			
			const buttons = screen.getAllByRole('button');
			expect(buttons.length).toBeGreaterThan(0);
		});
	});
});