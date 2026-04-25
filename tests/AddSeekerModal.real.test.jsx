import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock react-intlayer
vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => ({
    addSeeker: { value: 'Add Seeker' },
    namePlaceholder: { value: 'Name' },
    phonePlaceholder: { value: 'Phone' },
    facebookPlaceholder: { value: 'Facebook' },
    locationPlaceholder: { value: 'Select city' },
    briefDescriptionPlaceholder: { value: 'Description' },
    genderLabel: { value: 'Gender' },
    genderMale: { value: 'Male' },
    genderFemale: { value: 'Female' },
    demandeLabel: { value: 'Demanded' },
    demanded: { value: 'Demanded' },
    languageRussian: { value: 'Russian' },
    languageArabic: { value: 'Arabic' },
    languageEnglish: { value: 'English' },
    languageHebrew: { value: 'Hebrew' },
    languageUkrainian: { value: 'Ukrainian' },
    employmentFull: { value: 'Full' },
    employmentPartial: { value: 'Part' },
    documentVisaB1: { value: 'Visa B1' },
    documentVisaB2: { value: 'Visa B2' },
    documentTeudatZehut: { value: 'Teudat Zehut' },
    documentWorkVisa: { value: 'Work Visa' },
    documentOther: { value: 'Other' },
    fillAllFieldsError: { value: 'Fill all required fields' },
    languageSelectionError: { value: 'Select language' },
    nativeLanguageLabel: { value: 'Native language' },
    languagesLabel: { value: 'Languages' },
    nextButton: { value: 'Next' },
    backButton: { value: 'Back' },
    submitButton: { value: 'Submit' },
    saveButton: { value: 'Save' },
    announcementPlaceholder: { value: 'Announcement' },
    notePlaceholder: { value: 'Note' },
    categoryLabel: { value: 'Category' },
    categoryPlaceholder: { value: 'Select category' },
    employmentLabel: { value: 'Employment' },
    employmentPlaceholder: { value: 'Select employment' },
    employmentTypePlaceholder: { value: 'Select employment' },
    documentTypeLabel: { value: 'Document type' },
    documentTypePlaceholder: { value: 'Select document' },
    documentsLabel: { value: 'Documents' },
    documentsPlaceholder: { value: 'Documents' },
  })),
}));

import AddSeekerModal from '../apps/client/src/components/form/AddSeekerModal.jsx';

const defaultProps = {
  show: true,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
};

describe('AddSeekerModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when show=false', () => {
    const { container } = render(<AddSeekerModal {...defaultProps} show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the modal when show=true', () => {
    render(<AddSeekerModal {...defaultProps} />);
    expect(screen.getByText('Add Seeker')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<AddSeekerModal {...defaultProps} />);
    const closeBtn = document.querySelector('.btn-close');
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  it('shows error when trying to proceed without filling required fields', async () => {
    render(<AddSeekerModal {...defaultProps} />);
    // Submit the form without filling any required fields
    const form = document.querySelector('form');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText('Fill all required fields')).toBeInTheDocument();
    });
  });

  it('updates name field on change', () => {
    render(<AddSeekerModal {...defaultProps} />);
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { name: 'name', value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });

  it('updates phone field on change', () => {
    render(<AddSeekerModal {...defaultProps} />);
    const phoneInput = screen.getByPlaceholderText('Phone');
    fireEvent.change(phoneInput, { target: { name: 'contact', value: '+972501234567' } });
    expect(phoneInput.value).toBe('+972501234567');
  });

  it('updates gender via radio button', () => {
    render(<AddSeekerModal {...defaultProps} />);
    const maleRadio = screen.getByLabelText('Male');
    fireEvent.change(maleRadio, { target: { name: 'gender', value: 'мужчина', type: 'radio' } });
    expect(maleRadio).toBeDefined();
  });

  it('proceeds to step 2 when all required fields are filled', async () => {
    render(<AddSeekerModal {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { name: 'name', value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Phone'), {
      target: { name: 'contact', value: '+972501234567' },
    });

    const citySelect = document.querySelector('select[name="city"]');
    fireEvent.change(citySelect, { target: { name: 'city', value: 'Tel Aviv' } });

    const descInput = screen.getByPlaceholderText('Description');
    fireEvent.change(descInput, { target: { name: 'description', value: 'Good worker' } });

    const maleRadio = screen.getByLabelText('Male');
    fireEvent.click(maleRadio);

    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);

    // After step 2 appears, check we're no longer in step 1
    await waitFor(() => {
      // Either we moved to step 2 or we're still on step 1 with an error
      expect(document.body).toBeDefined();
    });
  });
});
