import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import NewsletterFilters from '../apps/client/src/components/ui/NewsletterFilters';

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
	useIntlayer: vi.fn(() => ({
		languageRussian: { value: 'Russian' },
		languageUkrainian: { value: 'Ukrainian' },
		languageEnglish: { value: 'English' },
		languageHebrew: { value: 'Hebrew' },
		employmentFull: { value: 'Full-time' },
		employmentPartial: { value: 'Part-time' },
		documentVisaB1: { value: 'Visa B1' },
		documentVisaB2: { value: 'Visa B2' },
		documentTeudatZehut: { value: 'Teudat Zehut' },
		documentWorkVisa: { value: 'Work Visa' },
		documentOther: { value: 'Other' },
		genderMale: { value: 'Male' },
		genderFemale: { value: 'Female' },
		demanded: { value: 'Only demanded' },
		city: { value: 'City' },
		category: { value: 'Category' },
		employment: { value: 'Employment' },
		documentType: { value: 'Document Type' },
		languages: { value: 'Languages' },
		gender: { value: 'Gender' },
	})),
}));

describe('NewsletterFilters Component', () => {
	const mockCities = [
		{ id: 1, name: 'Tel Aviv', label: 'Tel Aviv' },
		{ id: 2, name: 'Jerusalem', label: 'Jerusalem' },
		{ id: 3, name: 'Haifa', label: 'Haifa' },
	];

	const mockCategories = [
		{ id: 1, name: 'Construction', label: 'Construction' },
		{ id: 2, name: 'IT', label: 'IT' },
		{ id: 3, name: 'Healthcare', label: 'Healthcare' },
	];

	const defaultProps = {
		cities: mockCities,
		categories: mockCategories,
		selectedCities: [],
		selectedCategories: [],
		selectedEmployment: [],
		selectedDocumentTypes: [],
		selectedLanguages: [],
		selectedGender: [],
		onlyDemanded: false,
		onCityChange: vi.fn(),
		onCategoryChange: vi.fn(),
		onEmploymentChange: vi.fn(),
		onDocumentTypeChange: vi.fn(),
		onLanguageChange: vi.fn(),
		onGenderChange: vi.fn(),
		onOnlyDemandedChange: vi.fn(),
		isSubscribing: false,
		isUnsubscribing: false,
		isMobile: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Basic Rendering', () => {
		it('renders all filter sections', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			expect(screen.getByText('City')).toBeInTheDocument();
			expect(screen.getByText('Category')).toBeInTheDocument();
			expect(screen.getByText('Employment')).toBeInTheDocument();
			expect(screen.getByText('Document Type')).toBeInTheDocument();
			expect(screen.getByText('Gender')).toBeInTheDocument();
			expect(screen.getByText('Languages')).toBeInTheDocument();
		});

		it('renders city checkboxes', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			expect(screen.getByLabelText('Tel Aviv')).toBeInTheDocument();
			expect(screen.getByLabelText('Jerusalem')).toBeInTheDocument();
			expect(screen.getByLabelText('Haifa')).toBeInTheDocument();
		});

		it('renders category checkboxes', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			expect(screen.getByLabelText('Construction')).toBeInTheDocument();
			expect(screen.getByLabelText('IT')).toBeInTheDocument();
			expect(screen.getByLabelText('Healthcare')).toBeInTheDocument();
		});

		it('renders employment type checkboxes', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			expect(screen.getByLabelText('Full-time')).toBeInTheDocument();
			expect(screen.getByLabelText('Part-time')).toBeInTheDocument();
		});

		it('renders document type checkboxes', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			expect(screen.getByLabelText('Visa B1')).toBeInTheDocument();
			expect(screen.getByLabelText('Visa B2')).toBeInTheDocument();
			expect(screen.getByLabelText('Teudat Zehut')).toBeInTheDocument();
			expect(screen.getByLabelText('Work Visa')).toBeInTheDocument();
			expect(screen.getByLabelText('Other')).toBeInTheDocument();
		});

		it('renders gender checkboxes', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			expect(screen.getByLabelText('Male')).toBeInTheDocument();
			expect(screen.getByLabelText('Female')).toBeInTheDocument();
		});

		it('renders language checkboxes', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			expect(screen.getByLabelText('Russian')).toBeInTheDocument();
			expect(screen.getByLabelText('Ukrainian')).toBeInTheDocument();
			expect(screen.getByLabelText('English')).toBeInTheDocument();
			expect(screen.getByLabelText('Hebrew')).toBeInTheDocument();
		});

		it('renders only demanded checkbox', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			expect(screen.getByLabelText('Only demanded')).toBeInTheDocument();
		});
	});

	describe('Checkbox Interactions', () => {
		it('handles city selection', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			const telAvivCheckbox = screen.getByLabelText('Tel Aviv');
			await act(async () => {
				fireEvent.click(telAvivCheckbox);
			});

			expect(defaultProps.onCityChange).toHaveBeenCalledWith(
				{ id: 1, name: 'Tel Aviv', label: 'Tel Aviv' },
				true,
			);
		});

		it('handles category selection', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			const constructionCheckbox = screen.getByLabelText('Construction');
			await act(async () => {
				fireEvent.click(constructionCheckbox);
			});

			expect(defaultProps.onCategoryChange).toHaveBeenCalledWith(
				{ id: 1, name: 'Construction', label: 'Construction' },
				true,
			);
		});

		it('handles employment type selection', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			const fullTimeCheckbox = screen.getByLabelText('Full-time');
			await act(async () => {
				fireEvent.click(fullTimeCheckbox);
			});

			expect(defaultProps.onEmploymentChange).toHaveBeenCalledWith(
				{ value: 'полная', label: 'Full-time' },
				true,
			);
		});

		it('handles document type selection', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			const visaB1Checkbox = screen.getByLabelText('Visa B1');
			await act(async () => {
				fireEvent.click(visaB1Checkbox);
			});

			expect(defaultProps.onDocumentTypeChange).toHaveBeenCalledWith(
				{ value: 'Виза Б1', label: 'Visa B1' },
				true,
			);
		});

		it('handles gender selection', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			const maleCheckbox = screen.getByLabelText('Male');
			await act(async () => {
				fireEvent.click(maleCheckbox);
			});

			expect(defaultProps.onGenderChange).toHaveBeenCalledWith('мужчина', true);
		});

		it('handles language selection', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			const russianCheckbox = screen.getByLabelText('Russian');
			await act(async () => {
				fireEvent.click(russianCheckbox);
			});

			expect(defaultProps.onLanguageChange).toHaveBeenCalledWith(
				'русский',
				true,
			);
		});

		it('handles only demanded checkbox', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			const onlyDemandedCheckbox = screen.getByLabelText('Only demanded');
			await act(async () => {
				fireEvent.click(onlyDemandedCheckbox);
			});

			expect(defaultProps.onOnlyDemandedChange).toHaveBeenCalledWith(true);
		});
	});

	describe('Selected State Display', () => {
		it('shows selected cities as checked', async () => {
			const propsWithSelectedCities = {
				...defaultProps,
				selectedCities: ['Tel Aviv', 'Jerusalem'],
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWithSelectedCities} />);
			});

			expect(screen.getByLabelText('Tel Aviv')).toBeChecked();
			expect(screen.getByLabelText('Jerusalem')).toBeChecked();
			expect(screen.getByLabelText('Haifa')).not.toBeChecked();
		});

		it('shows selected categories as checked', async () => {
			const propsWithSelectedCategories = {
				...defaultProps,
				selectedCategories: ['Construction', 'IT'],
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWithSelectedCategories} />);
			});

			expect(screen.getByLabelText('Construction')).toBeChecked();
			expect(screen.getByLabelText('IT')).toBeChecked();
			expect(screen.getByLabelText('Healthcare')).not.toBeChecked();
		});

		it('shows selected employment types as checked', async () => {
			const propsWithSelectedEmployment = {
				...defaultProps,
				selectedEmployment: ['Full-time'],
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWithSelectedEmployment} />);
			});

			expect(screen.getByLabelText('Full-time')).toBeChecked();
			expect(screen.getByLabelText('Part-time')).not.toBeChecked();
		});

		it('shows selected document types as checked', async () => {
			const propsWithSelectedDocuments = {
				...defaultProps,
				selectedDocumentTypes: ['Visa B1', 'Work Visa'],
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWithSelectedDocuments} />);
			});

			expect(screen.getByLabelText('Visa B1')).toBeChecked();
			expect(screen.getByLabelText('Work Visa')).toBeChecked();
			expect(screen.getByLabelText('Visa B2')).not.toBeChecked();
		});

		it('shows selected languages as checked', async () => {
			const propsWithSelectedLanguages = {
				...defaultProps,
				selectedLanguages: ['русский', 'английский'],
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWithSelectedLanguages} />);
			});

			expect(screen.getByLabelText('Russian')).toBeChecked();
			expect(screen.getByLabelText('English')).toBeChecked();
			expect(screen.getByLabelText('Ukrainian')).not.toBeChecked();
		});

		it('shows selected gender as checked', async () => {
			const propsWithSelectedGender = {
				...defaultProps,
				selectedGender: ['мужчина'],
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWithSelectedGender} />);
			});

			expect(screen.getByLabelText('Male')).toBeChecked();
			expect(screen.getByLabelText('Female')).not.toBeChecked();
		});

		it('shows only demanded as checked when true', async () => {
			const propsWithOnlyDemanded = {
				...defaultProps,
				onlyDemanded: true,
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWithOnlyDemanded} />);
			});

			expect(screen.getByLabelText('Only demanded')).toBeChecked();
		});
	});

	describe('Disabled State', () => {
		it('disables all checkboxes when subscribing', async () => {
			const propsWhileSubscribing = {
				...defaultProps,
				isSubscribing: true,
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWhileSubscribing} />);
			});

			expect(screen.getByLabelText('Tel Aviv')).toBeDisabled();
			expect(screen.getByLabelText('Construction')).toBeDisabled();
			expect(screen.getByLabelText('Full-time')).toBeDisabled();
			expect(screen.getByLabelText('Visa B1')).toBeDisabled();
			expect(screen.getByLabelText('Male')).toBeDisabled();
			expect(screen.getByLabelText('Russian')).toBeDisabled();
			expect(screen.getByLabelText('Only demanded')).toBeDisabled();
		});

		it('disables all checkboxes when unsubscribing', async () => {
			const propsWhileUnsubscribing = {
				...defaultProps,
				isUnsubscribing: true,
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWhileUnsubscribing} />);
			});

			expect(screen.getByLabelText('Tel Aviv')).toBeDisabled();
			expect(screen.getByLabelText('Construction')).toBeDisabled();
			expect(screen.getByLabelText('Full-time')).toBeDisabled();
			expect(screen.getByLabelText('Visa B1')).toBeDisabled();
			expect(screen.getByLabelText('Male')).toBeDisabled();
			expect(screen.getByLabelText('Russian')).toBeDisabled();
			expect(screen.getByLabelText('Only demanded')).toBeDisabled();
		});

		it('enables all checkboxes when not subscribing or unsubscribing', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			expect(screen.getByLabelText('Tel Aviv')).not.toBeDisabled();
			expect(screen.getByLabelText('Construction')).not.toBeDisabled();
			expect(screen.getByLabelText('Full-time')).not.toBeDisabled();
			expect(screen.getByLabelText('Visa B1')).not.toBeDisabled();
			expect(screen.getByLabelText('Male')).not.toBeDisabled();
			expect(screen.getByLabelText('Russian')).not.toBeDisabled();
			expect(screen.getByLabelText('Only demanded')).not.toBeDisabled();
		});
	});

	describe('Responsive Layout', () => {
		it('renders desktop layout when isMobile is false', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			// Check that all sections are rendered (desktop uses two columns)
			expect(screen.getByText('City')).toBeInTheDocument();
			expect(screen.getByText('Category')).toBeInTheDocument();
			expect(screen.getByText('Employment')).toBeInTheDocument();
			expect(screen.getByText('Document Type')).toBeInTheDocument();
			expect(screen.getByText('Gender')).toBeInTheDocument();
			expect(screen.getByText('Languages')).toBeInTheDocument();
		});

		it('renders mobile layout when isMobile is true', async () => {
			const mobileProps = {
				...defaultProps,
				isMobile: true,
			};

			await act(async () => {
				render(<NewsletterFilters {...mobileProps} />);
			});

			// Check that all sections are rendered (mobile uses single column)
			expect(screen.getByText('City')).toBeInTheDocument();
			expect(screen.getByText('Category')).toBeInTheDocument();
			expect(screen.getByText('Employment')).toBeInTheDocument();
			expect(screen.getByText('Document Type')).toBeInTheDocument();
			expect(screen.getByText('Gender')).toBeInTheDocument();
			expect(screen.getByText('Languages')).toBeInTheDocument();
		});

		it('applies mobile-specific styling when isMobile is true', async () => {
			const mobileProps = {
				...defaultProps,
				isMobile: true,
			};

			await act(async () => {
				render(<NewsletterFilters {...mobileProps} />);
			});

			// Check that labels have mobile font size
			const cityLabel = screen.getByText('City');
			expect(cityLabel).toHaveStyle({
				fontSize: '16px',
			});
		});

		it('applies desktop-specific styling when isMobile is false', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			// Check that labels have desktop font size
			const cityLabel = screen.getByText('City');
			expect(cityLabel).toHaveStyle({
				fontSize: '14px',
			});
		});
	});

	describe('Edge Cases', () => {
		it('handles empty cities array', async () => {
			const propsWithEmptyCities = {
				...defaultProps,
				cities: [],
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWithEmptyCities} />);
			});

			expect(screen.getByText('City')).toBeInTheDocument();
			// Should not crash and still render other sections
			expect(screen.getByText('Category')).toBeInTheDocument();
		});

		it('handles empty categories array', async () => {
			const propsWithEmptyCategories = {
				...defaultProps,
				categories: [],
			};

			await act(async () => {
				render(<NewsletterFilters {...propsWithEmptyCategories} />);
			});

			expect(screen.getByText('Category')).toBeInTheDocument();
			// Should not crash and still render other sections
			expect(screen.getByText('City')).toBeInTheDocument();
		});
	});

	describe('Checkbox Styling', () => {
		it('applies correct styling to checkboxes', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			const telAvivCheckbox = screen.getByLabelText('Tel Aviv');
			expect(telAvivCheckbox).toHaveStyle({
				transform: 'scale(1.2)',
				zIndex: '10',
				position: 'relative',
			});
		});

		it('applies mobile-specific checkbox styling', async () => {
			const mobileProps = {
				...defaultProps,
				isMobile: true,
			};

			await act(async () => {
				render(<NewsletterFilters {...mobileProps} />);
			});

			const telAvivLabel = screen.getByText('Tel Aviv');
			expect(telAvivLabel).toHaveStyle({
				fontSize: '16px',
			});
		});

		it('applies desktop-specific checkbox styling', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			const telAvivLabel = screen.getByText('Tel Aviv');
			expect(telAvivLabel).toHaveStyle({
				fontSize: '14px',
			});
		});
	});

	describe('Accessibility', () => {
		it('has proper labels for all checkboxes', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			// Check that all checkboxes have associated labels
			expect(screen.getByLabelText('Tel Aviv')).toBeInTheDocument();
			expect(screen.getByLabelText('Construction')).toBeInTheDocument();
			expect(screen.getByLabelText('Full-time')).toBeInTheDocument();
			expect(screen.getByLabelText('Visa B1')).toBeInTheDocument();
			expect(screen.getByLabelText('Male')).toBeInTheDocument();
			expect(screen.getByLabelText('Russian')).toBeInTheDocument();
			expect(screen.getByLabelText('Only demanded')).toBeInTheDocument();
		});

		it('has proper IDs for all checkboxes', async () => {
			await act(async () => {
				render(<NewsletterFilters {...defaultProps} />);
			});

			// Check that checkboxes have proper IDs
			expect(screen.getByLabelText('Tel Aviv')).toHaveAttribute('id', 'city-1');
			expect(screen.getByLabelText('Construction')).toHaveAttribute(
				'id',
				'cat-1',
			);
			expect(screen.getByLabelText('Full-time')).toHaveAttribute(
				'id',
				'emp-полная',
			);
			expect(screen.getByLabelText('Visa B1')).toHaveAttribute(
				'id',
				'doc-Виза Б1',
			);
			expect(screen.getByLabelText('Male')).toHaveAttribute(
				'id',
				'gender-мужчина',
			);
			expect(screen.getByLabelText('Russian')).toHaveAttribute(
				'id',
				'lang-русский',
			);
			expect(screen.getByLabelText('Only demanded')).toHaveAttribute(
				'id',
				'onlyDemanded',
			);
		});
	});
});
