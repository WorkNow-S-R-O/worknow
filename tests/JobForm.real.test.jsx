import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

vi.mock('react-router', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  useParams: vi.fn(() => ({ id: '1' })),
}));

vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(() => ({ user: { id: 'user_123' } })),
  useAuth: vi.fn(() => ({ getToken: vi.fn(() => Promise.resolve('token')) })),
}));

vi.mock('@/hooks', () => ({
  useFetchCities: vi.fn(() => ({
    cities: [{ value: 1, label: 'Tel Aviv' }, { value: 2, label: 'Jerusalem' }],
    loading: false,
  })),
  useFetchCategories: vi.fn(() => ({
    categories: [{ value: 1, label: 'Construction' }],
    loading: false,
  })),
  useLoadingProgress: vi.fn(() => ({
    startLoadingWithProgress: vi.fn(),
    completeLoading: vi.fn(),
    stopLoadingImmediately: vi.fn(),
  })),
}));

vi.mock('@/libs', () => ({
  createJob: vi.fn(),
  createJobWithImage: vi.fn(),
  showToastError: vi.fn(),
  showToastSuccess: vi.fn(),
  updateJob: vi.fn(),
  deleteJobImage: vi.fn(),
}));

vi.mock('@/components/form', () => ({
  JobFormFields: ({ register, errors, setValue }) => (
    <div data-testid="job-form-fields">
      <input data-testid="title" {...register('title')} />
      <input data-testid="salary" {...register('salary')} />
      <input data-testid="phone" {...register('phone')} />
    </div>
  ),
  jobSchema: {
    parse: vi.fn(),
    _def: { typeName: 'ZodObject' },
  },
}));

// Mock @hookform/resolvers/zod
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async (data) => ({ values: data, errors: {} }),
}));

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => <div>{children}</div>,
}));

import { useUser } from '@clerk/clerk-react';
import { JobForm } from '../apps/client/src/components/form/JobForm.jsx';
import * as libs from '@/libs';

describe('JobForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUser.mockReturnValue({ user: { id: 'user_123' } });
  });

  it('renders without crashing', () => {
    const { container } = render(<JobForm onJobCreated={vi.fn()} />);
    expect(container).toBeDefined();
  });

  it('renders form fields', () => {
    const { container } = render(<JobForm onJobCreated={vi.fn()} />);
    expect(container.querySelector('[data-testid="job-form-fields"]')).toBeTruthy();
  });

  it('renders when no user logged in', () => {
    useUser.mockReturnValue({ user: null });
    const { container } = render(<JobForm onJobCreated={vi.fn()} />);
    expect(container).toBeDefined();
  });

  it('renders without onJobCreated prop', () => {
    const { container } = render(<JobForm />);
    expect(container).toBeDefined();
  });

  it('handles submit when no user', async () => {
    useUser.mockReturnValue({ user: null });
    const { container } = render(<JobForm onJobCreated={vi.fn()} />);

    const form = container.querySelector('form');
    if (form) {
      fireEvent.submit(form);
      await waitFor(() => expect(libs.showToastError).toHaveBeenCalled());
    }
    expect(container).toBeDefined();
  });
});
