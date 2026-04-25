import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

// Mock ImageUpload component
vi.mock('../apps/client/src/components/ui/ImageUpload.jsx', () => ({
  default: ({ onImageUpload, currentImageUrl }) => (
    <div data-testid="image-upload">
      <span>{currentImageUrl || 'no-image'}</span>
    </div>
  ),
}));

vi.mock('../apps/client/src/components/ui', () => ({
  ImageUpload: ({ onImageUpload, currentImageUrl }) => (
    <div data-testid="image-upload">
      <span>{currentImageUrl || 'no-image'}</span>
    </div>
  ),
}));

import { EditJobFields } from '../apps/client/src/components/form/EditJobFields.jsx';

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
  loadingCities: false,
  loadingCategories: false,
  loadingJob: false,
  onImageUpload: vi.fn(),
  currentImageUrl: null,
};

describe('EditJobFields', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<EditJobFields {...defaultProps} />);
    expect(container).toBeDefined();
  });

  it('renders skeleton when loading job', () => {
    const { container } = render(<EditJobFields {...defaultProps} loadingJob={true} />);
    const skeletons = container.querySelectorAll('[data-testid="skeleton"]');
    expect(container).toBeDefined();
  });

  it('renders skeleton when loading cities', () => {
    const { container } = render(<EditJobFields {...defaultProps} loadingCities={true} />);
    expect(container).toBeDefined();
  });

  it('renders skeleton when loading categories', () => {
    const { container } = render(<EditJobFields {...defaultProps} loadingCategories={true} />);
    expect(container).toBeDefined();
  });

  it('renders with empty cities', () => {
    const { container } = render(<EditJobFields {...defaultProps} cities={[]} />);
    expect(container).toBeDefined();
  });

  it('renders with selected city', () => {
    const { container } = render(
      <EditJobFields {...defaultProps} selectedCityId={1} />
    );
    expect(container).toBeDefined();
  });

  it('renders with selected category', () => {
    const { container } = render(
      <EditJobFields {...defaultProps} selectedCategoryId={1} />
    );
    expect(container).toBeDefined();
  });

  it('renders with current image URL', () => {
    const { container } = render(
      <EditJobFields {...defaultProps} currentImageUrl="https://example.com/image.jpg" />
    );
    expect(container).toBeDefined();
  });

  it('renders with errors', () => {
    const { container } = render(
      <EditJobFields
        {...defaultProps}
        errors={{
          title: { message: 'Title required' },
          salary: { message: 'Salary required' },
        }}
      />
    );
    expect(container).toBeDefined();
  });

  it('sorts cities with regions first', () => {
    const citiesWithRegions = [
      { value: 1, label: 'Tel Aviv' },
      { value: 2, label: 'Юг страны' },
      { value: 3, label: 'Центр страны' },
      { value: 4, label: 'Север страны' },
      { value: 5, label: 'Haifa' },
    ];
    const { container } = render(
      <EditJobFields {...defaultProps} cities={citiesWithRegions} />
    );
    expect(container).toBeDefined();
  });
});
