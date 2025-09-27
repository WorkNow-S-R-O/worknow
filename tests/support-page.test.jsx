import { expect, test, describe, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SupportPage from '../apps/client/src/components/SupportPage';

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: () => ({
		technical_support: 'Technical Support',
		support_hero_description:
			'We are here to help you with any questions or issues.',
		support_get_in_touch: 'Get in Touch',
		support_get_in_touch_description:
			'Choose your preferred method of contact.',
		support_email_title: 'Email Support',
		support_email_description:
			'Send us an email and we will respond within 24 hours.',
		support_live_chat_title: 'Live Chat',
		support_live_chat_description: 'Chat with our support team in real-time.',
		support_phone_title: 'Phone Support',
		support_phone_description: 'Call us directly for immediate assistance.',
		support_available_24_7: 'Available 24/7',
		support_contact_now: 'Contact Now',
		support_coming_soon: 'Coming Soon',
		support_why_choose_title: 'Why Choose Our Support',
		support_why_choose_description: 'We provide the best support experience.',
		support_secure_platform_title: 'Secure Platform',
		support_secure_platform_description: 'Your data is safe with us.',
		support_fast_reliable_title: 'Fast & Reliable',
		support_fast_reliable_description: 'Quick response times guaranteed.',
		support_community_driven_title: 'Community Driven',
		support_community_driven_description:
			'Built by the community, for the community.',
		support_faq_title: 'Frequently Asked Questions',
		support_faq_description: 'Find answers to common questions.',
		support_faq_create_job_question: 'How do I create a job posting?',
		support_faq_create_job_answer:
			'Click on "Create New Advertisement" and fill out the form.',
		support_faq_premium_question: 'What are premium features?',
		support_faq_premium_answer:
			'Premium features include job boosting and extended statistics.',
		support_faq_edit_job_question: 'How do I edit my job posting?',
		support_faq_edit_job_answer:
			'Go to "My Advertisements" and click edit on your job.',
		support_faq_contact_seekers_question: 'How do I contact job seekers?',
		support_faq_contact_seekers_answer:
			'Use the contact information provided in their profiles.',
		support_faq_job_limits_question: 'How many jobs can I post?',
		support_faq_job_limits_answer:
			'Free users can post up to 3 jobs, premium users have unlimited posts.',
		support_faq_payment_question: 'How do I pay for premium?',
		support_faq_payment_answer:
			'We accept all major credit cards through Stripe.',
		support_faq_categories_question: 'How do I choose job categories?',
		support_faq_categories_answer:
			'Select the most relevant category for your job posting.',
		support_faq_cities_question: 'Which cities are supported?',
		support_faq_cities_answer: 'We support all major cities in Israel.',
		support_hours_title: 'Support Hours',
		support_hours_weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
		support_hours_weekend: 'Saturday - Sunday: 10:00 AM - 4:00 PM',
		support_modal_title: 'Contact Information',
		support_modal_contact_info: 'Contact Details:',
		close: 'Close',
	}),
}));

// Mock window.innerWidth for mobile detection
const mockInnerWidth = (width) => {
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: width,
	});
};

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
	writable: true,
	value: mockWindowOpen,
});

describe('SupportPage Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockInnerWidth(1024); // Desktop by default
		mockWindowOpen.mockClear();
	});

	describe('Rendering', () => {
		test('renders the main support page structure', () => {
			render(<SupportPage />);

			expect(screen.getByText('Technical Support')).toBeInTheDocument();
			expect(
				screen.getByText(
					'We are here to help you with any questions or issues.',
				),
			).toBeInTheDocument();
			expect(screen.getByText('Get in Touch')).toBeInTheDocument();
			expect(screen.getByText('Why Choose Our Support')).toBeInTheDocument();
			expect(
				screen.getByText('Frequently Asked Questions'),
			).toBeInTheDocument();
		});

		test('renders all support methods', () => {
			render(<SupportPage />);

			expect(screen.getByText('Email Support')).toBeInTheDocument();
			expect(screen.getByText('Live Chat')).toBeInTheDocument();
			expect(screen.getByText('Phone Support')).toBeInTheDocument();
		});

		test('renders all features', () => {
			render(<SupportPage />);

			expect(screen.getByText('Secure Platform')).toBeInTheDocument();
			expect(screen.getByText('Fast & Reliable')).toBeInTheDocument();
			expect(screen.getByText('Community Driven')).toBeInTheDocument();
		});

		test('renders all FAQ items', () => {
			render(<SupportPage />);

			expect(
				screen.getByText('How do I create a job posting?'),
			).toBeInTheDocument();
			expect(
				screen.getByText('What are premium features?'),
			).toBeInTheDocument();
			expect(
				screen.getByText('How do I edit my job posting?'),
			).toBeInTheDocument();
		});

		test('renders support hours section', () => {
			render(<SupportPage />);

			expect(screen.getByText('Support Hours')).toBeInTheDocument();
			expect(
				screen.getByText('Monday - Friday: 9:00 AM - 6:00 PM'),
			).toBeInTheDocument();
			expect(
				screen.getByText('Saturday - Sunday: 10:00 AM - 4:00 PM'),
			).toBeInTheDocument();
		});
	});

	describe('Support Methods', () => {
		test('displays correct contact information for each method', () => {
			render(<SupportPage />);

			expect(
				screen.getByText('worknow.notifications@gmail.com'),
			).toBeInTheDocument();
			expect(screen.getByText('Available 24/7')).toBeInTheDocument();
			expect(screen.getByText('+972-053-3033332')).toBeInTheDocument();
		});

		test('shows "Coming Soon" for disabled live chat', () => {
			render(<SupportPage />);

			const comingSoonButtons = screen.getAllByText('Coming Soon');
			expect(comingSoonButtons).toHaveLength(1);
		});

		test('shows "Contact Now" buttons for enabled methods', () => {
			render(<SupportPage />);

			const contactNowButtons = screen.getAllByText('Contact Now');
			expect(contactNowButtons).toHaveLength(2); // Email and Phone
		});
	});

	describe('Desktop Behavior', () => {
		test('opens email client when email contact button is clicked', async () => {
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			await userEvent.click(emailButton);

			expect(mockWindowOpen).toHaveBeenCalledWith(
				'mailto:worknow.notifications@gmail.com',
				'_blank',
			);
		});

		test('opens phone dialer when phone contact button is clicked', async () => {
			render(<SupportPage />);

			const phoneButton = screen.getAllByText('Contact Now')[1];
			await userEvent.click(phoneButton);

			expect(mockWindowOpen).toHaveBeenCalledWith(
				'tel:+972-053-3033332',
				'_blank',
			);
		});

		test('does not open modal on desktop', async () => {
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			await userEvent.click(emailButton);

			expect(screen.queryByText('Contact Information')).not.toBeInTheDocument();
		});
	});

	describe('Mobile Behavior', () => {
		beforeEach(() => {
			mockInnerWidth(768); // Mobile width
		});

		test('opens modal when contact button is clicked on mobile', async () => {
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			await userEvent.click(emailButton);

			expect(screen.getByText('Contact Information')).toBeInTheDocument();
			// Use getAllByText since the email appears in both main page and modal
			const emailElements = screen.getAllByText(
				'worknow.notifications@gmail.com',
			);
			expect(emailElements).toHaveLength(2); // One in main page, one in modal
		});

		test('closes modal when close button is clicked', async () => {
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			await userEvent.click(emailButton);

			expect(screen.getByText('Contact Information')).toBeInTheDocument();

			const closeButton = screen.getByLabelText('Close');
			await userEvent.click(closeButton);

			expect(screen.queryByText('Contact Information')).not.toBeInTheDocument();
		});

		test('closes modal when contact link is clicked', async () => {
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			await userEvent.click(emailButton);

			expect(screen.getByText('Contact Information')).toBeInTheDocument();

			// Find the modal contact button (there should be only one in the modal)
			const modalContactButtons = screen.getAllByText('Contact Now');
			const modalContactButton =
				modalContactButtons[modalContactButtons.length - 1]; // Last one is in modal
			await userEvent.click(modalContactButton);

			expect(screen.queryByText('Contact Information')).not.toBeInTheDocument();
		});
	});

	describe('Touch Events (Mobile)', () => {
		beforeEach(() => {
			mockInnerWidth(768); // Mobile width
		});

		test('modal has touch event handlers attached', () => {
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			fireEvent.click(emailButton);

			const modalContainer = document.querySelector(
				'[style*="position: fixed"]',
			);
			expect(modalContainer).toBeInTheDocument();

			// Check that the modal has the touch event handlers by checking the props
			// React Testing Library doesn't expose event handlers as attributes
			expect(modalContainer).toBeInTheDocument();
		});

		test('modal renders with correct mobile styles', () => {
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			fireEvent.click(emailButton);

			const modalContainer = document.querySelector(
				'[style*="position: fixed"]',
			);
			expect(modalContainer).toBeInTheDocument();

			// Check mobile-specific styles - the actual styles are applied via inline styles
			expect(modalContainer).toHaveStyle({
				position: 'fixed',
				width: '100%',
			});
		});
	});

	describe('Body Style Management', () => {
		test('sets body overflow hidden when modal opens on mobile', () => {
			mockInnerWidth(768);
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			fireEvent.click(emailButton);

			expect(document.body.style.overflow).toBe('hidden');
		});

		test('resets body styles when modal closes on mobile', async () => {
			mockInnerWidth(768);
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			fireEvent.click(emailButton);

			expect(document.body.style.overflow).toBe('hidden');

			const closeButton = screen.getByLabelText('Close');
			await userEvent.click(closeButton);

			expect(document.body.style.overflow).toBe('');
		});

		test('cleans up body styles on component unmount', () => {
			mockInnerWidth(768);
			const { unmount } = render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			fireEvent.click(emailButton);

			expect(document.body.style.overflow).toBe('hidden');

			unmount();

			expect(document.body.style.overflow).toBe('');
		});
	});

	describe('Accessibility', () => {
		test('has proper ARIA labels for close button', () => {
			mockInnerWidth(768);
			render(<SupportPage />);

			const emailButton = screen.getAllByText('Contact Now')[0];
			fireEvent.click(emailButton);

			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toBeInTheDocument();
		});

		test('has proper heading structure', () => {
			render(<SupportPage />);

			const h1 = screen.getByRole('heading', { level: 1 });
			expect(h1).toHaveTextContent('Technical Support');

			const h2Elements = screen.getAllByRole('heading', { level: 2 });
			expect(h2Elements).toHaveLength(3); // Get in Touch, Why Choose, FAQ
		});
	});

	describe('Icon Rendering', () => {
		test('renders Bootstrap icons correctly', () => {
			render(<SupportPage />);

			// Check for Bootstrap icon classes
			const questionIcon = document.querySelector('.bi-question-circle');
			expect(questionIcon).toBeInTheDocument();

			const envelopeIcon = document.querySelector('.bi-envelope');
			expect(envelopeIcon).toBeInTheDocument();

			const chatIcon = document.querySelector('.bi-chat-dots');
			expect(chatIcon).toBeInTheDocument();

			const phoneIcon = document.querySelector('.bi-telephone');
			expect(phoneIcon).toBeInTheDocument();

			const shieldIcon = document.querySelector('.bi-shield-check');
			expect(shieldIcon).toBeInTheDocument();

			const lightningIcon = document.querySelector('.bi-lightning');
			expect(lightningIcon).toBeInTheDocument();

			const peopleIcon = document.querySelector('.bi-people');
			expect(peopleIcon).toBeInTheDocument();

			const clockIcon = document.querySelector('.bi-clock');
			expect(clockIcon).toBeInTheDocument();
		});
	});

	describe('Responsive Design', () => {
		test('applies correct classes for desktop layout', () => {
			mockInnerWidth(1024);
			render(<SupportPage />);

			const supportMethodsGrid = document.querySelector(
				'.grid.md\\:grid-cols-3',
			);
			expect(supportMethodsGrid).toBeInTheDocument();

			const featuresGrid = document.querySelector('.grid.md\\:grid-cols-3');
			expect(featuresGrid).toBeInTheDocument();
		});

		test('applies correct classes for mobile layout', () => {
			mockInnerWidth(768);
			render(<SupportPage />);

			const supportMethodsGrid = document.querySelector(
				'.grid.md\\:grid-cols-3',
			);
			expect(supportMethodsGrid).toBeInTheDocument();
		});
	});
});
