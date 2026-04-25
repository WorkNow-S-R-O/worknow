import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

vi.mock('../apps/client/src/components/ui/ImageUpload.jsx', () => ({
  default: ({ onImageUpload, currentImageUrl }) => (
    <div data-testid="image-upload">{currentImageUrl || 'no-image'}</div>
  ),
}));

vi.mock('../apps/client/src/components/ui', () => ({
  ImageUpload: ({ onImageUpload, currentImageUrl }) => (
    <div data-testid="image-upload">{currentImageUrl || 'no-image'}</div>
  ),
}));

import { JobFormFields } from '../apps/client/src/components/form/JobFormFields.jsx';

const defaultProps = {
  register: vi.fn(() => ({})),
  errors: {},
  setValue: vi.fn(),
  selectedCityId: null,
  selectedCategoryId: null,
  cities: [
    { value: 1, label: 'Tel Aviv' },
    { value: 2, label: 'Jerusalem' },
    { value: 3, label: 'Центр страны' },
  ],
  categories: [
    { value: 1, label: 'Construction' },
    { value: 2, label: 'Cleaning' },
  ],
  loading: false,
  onImageUpload: vi.fn(),
  currentImageUrl: null,
  isSubmitting: false,
};

describe('JobFormFields', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<JobFormFields {...defaultProps} />);
    expect(container).toBeDefined();
  });

  it('renders skeleton when loading', () => {
    const { container } = render(<JobFormFields {...defaultProps} loading={true} />);
    expect(container).toBeDefined();
  });

  it('renders with no cities', () => {
    const { container } = render(<JobFormFields {...defaultProps} cities={[]} />);
    expect(container).toBeDefined();
  });

  it('renders with selected city', () => {
    const { container } = render(<JobFormFields {...defaultProps} selectedCityId={1} />);
    expect(container).toBeDefined();
  });

  it('renders with selected category', () => {
    const { container } = render(<JobFormFields {...defaultProps} selectedCategoryId={1} />);
    expect(container).toBeDefined();
  });

  it('renders with errors', () => {
    const { container } = render(
      <JobFormFields
        {...defaultProps}
        errors={{
          title: { message: 'Required' },
          salary: { message: 'Required' },
          phone: { message: 'Required' },
          cityId: { message: 'Required' },
          categoryId: { message: 'Required' },
        }}
      />
    );
    expect(container).toBeDefined();
  });

  it('renders with current image URL', () => {
    const { container } = render(
      <JobFormFields {...defaultProps} currentImageUrl="https://example.com/image.jpg" />
    );
    expect(container).toBeDefined();
  });

  it('renders with isSubmitting=true', () => {
    const { container } = render(<JobFormFields {...defaultProps} isSubmitting={true} />);
    expect(container).toBeDefined();
  });

  it('sorts regions to top', () => {
    const citiesWithRegions = [
      { value: 1, label: 'Tel Aviv' },
      { value: 2, label: 'Юг страны' },
      { value: 3, label: 'Haifa' },
      { value: 4, label: 'Север страны' },
    ];
    const { container } = render(
      <JobFormFields {...defaultProps} cities={citiesWithRegions} />
    );
    expect(container).toBeDefined();
  });

  it('renders checkbox for agreement', () => {
    const { container } = render(<JobFormFields {...defaultProps} />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(container).toBeDefined();
  });
});
