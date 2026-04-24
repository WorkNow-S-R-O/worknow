import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('react-intlayer', () => ({
  useIntlayer: () => ({
    filterModalTitle: { value: 'Filter Seekers' },
    city: { value: 'City' },
    chooseCity: { value: 'Choose City' },
    category: { value: 'Category' },
    chooseCategory: { value: 'Choose Category' },
    employment: { value: 'Employment' },
    chooseEmployment: { value: 'Choose Employment' },
    employmentFull: { value: 'Full Time' },
    employmentPartial: { value: 'Part Time' },
    documentType: { value: 'Document Type' },
    chooseDocumentType: { value: 'Choose Document Type' },
    documentVisaB1: { value: 'Visa B1' },
    documentVisaB2: { value: 'Visa B2' },
    documentTeudatZehut: { value: 'Teudat Zeut' },
    documentWorkVisa: { value: 'Work Visa' },
    documentOther: { value: 'Other' },
    gender: { value: 'Gender' },
    chooseGender: { value: 'Choose Gender' },
    genderMale: { value: 'Male' },
    genderFemale: { value: 'Female' },
    languages: { value: 'Languages' },
    languageRussian: { value: 'Russian' },
    languageArabic: { value: 'Arabic' },
    languageEnglish: { value: 'English' },
    languageHebrew: { value: 'Hebrew' },
    languageUkrainian: { value: 'Ukrainian' },
    demanded: { value: 'In Demand' },
    reset: { value: 'Reset' },
    save: { value: 'Apply' },
  }),
  useLocale: () => ({ locale: 'ru' }),
}));

import SeekerFilterModal from '../apps/client/src/components/ui/SeekerFilterModal';

describe('SeekerFilterModal Component', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onApply: vi.fn(),
    currentFilters: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fetch to return empty arrays for cities/categories
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    });
    // Set desktop width so desktop layout renders
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('renders the component when open', () => {
    render(<SeekerFilterModal {...defaultProps} />);
    expect(screen.getByText('Filter Seekers')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SeekerFilterModal {...defaultProps} open={false} />);
    expect(screen.queryByText('Filter Seekers')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<SeekerFilterModal {...defaultProps} />);
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onApply with empty filters on reset', () => {
    render(<SeekerFilterModal {...defaultProps} />);
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    expect(defaultProps.onApply).toHaveBeenCalledWith({});
  });

  it('calls onApply and onClose when Apply is clicked', () => {
    render(<SeekerFilterModal {...defaultProps} />);
    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);
    expect(defaultProps.onApply).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders with current filters', () => {
    const propsWithFilters = {
      ...defaultProps,
      currentFilters: {
        city: 'Tel Aviv',
        category: 'IT',
        employment: 'полная',
        documentType: 'Виза Б1',
        languages: ['русский'],
        gender: 'мужчина',
        isDemanded: true,
      },
    };
    render(<SeekerFilterModal {...propsWithFilters} />);
    expect(screen.getByText('Filter Seekers')).toBeInTheDocument();
  });

  it('renders employment options', () => {
    render(<SeekerFilterModal {...defaultProps} />);
    expect(screen.getByText('Choose Employment')).toBeInTheDocument();
  });

  it('renders language checkboxes', () => {
    render(<SeekerFilterModal {...defaultProps} />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
  });
});
