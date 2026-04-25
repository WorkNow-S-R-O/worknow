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
  useFetchJob: vi.fn(() => ({
    loading: false,
    job: { id: 1, title: 'Test Job', imageUrl: 'https://example.com/image.jpg' },
  })),
  useLoadingProgress: vi.fn(() => ({
    startLoadingWithProgress: vi.fn(),
    completeLoading: vi.fn(),
    stopLoadingImmediately: vi.fn(),
  })),
}));

vi.mock('@/libs', () => ({
  updateJob: vi.fn(),
  showToastError: vi.fn(),
  showToastSuccess: vi.fn(),
}));

vi.mock('@/components/form', () => ({
  EditJobFields: ({ register, errors, setValue }) => (
    <div data-testid="edit-job-fields">
      <input data-testid="title" {...register('title')} />
    </div>
  ),
  jobSchema: {
    parse: vi.fn(),
    _def: { typeName: 'ZodObject' },
  },
}));

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async (data) => ({ values: data, errors: {} }),
}));

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => <div>{children}</div>,
}));

import { useUser } from '@clerk/clerk-react';
import { useFetchJob } from '@/hooks';
import { EditJobForm } from '../apps/client/src/components/form/EditJobForm.jsx';
import * as libs from '@/libs';

describe('EditJobForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUser.mockReturnValue({ user: { id: 'user_123' } });
    useFetchJob.mockReturnValue({
      loading: false,
      job: { id: 1, title: 'Test Job', imageUrl: 'https://example.com/image.jpg' },
    });
  });

  it('renders without crashing', () => {
    const { container } = render(<EditJobForm />);
    expect(container).toBeDefined();
  });

  it('renders edit form fields', () => {
    const { container } = render(<EditJobForm />);
    expect(container.querySelector('[data-testid="edit-job-fields"]')).toBeTruthy();
  });

  it('renders when job is loading', () => {
    useFetchJob.mockReturnValue({ loading: true, job: null });
    const { container } = render(<EditJobForm />);
    expect(container).toBeDefined();
  });

  it('renders when job has no image', () => {
    useFetchJob.mockReturnValue({
      loading: false,
      job: { id: 1, title: 'Test Job', imageUrl: null },
    });
    const { container } = render(<EditJobForm />);
    expect(container).toBeDefined();
  });

  it('renders when no user', () => {
    useUser.mockReturnValue({ user: null });
    const { container } = render(<EditJobForm />);
    expect(container).toBeDefined();
  });

  it('handles form submit when no user', async () => {
    useUser.mockReturnValue({ user: null });
    const { container } = render(<EditJobForm />);

    const form = container.querySelector('form');
    if (form) {
      fireEvent.submit(form);
      await waitFor(() => expect(libs.showToastError).toHaveBeenCalled());
    }
    expect(container).toBeDefined();
  });
});
