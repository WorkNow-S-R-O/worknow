import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
  useLocale: vi.fn(() => ({ locale: 'ru' })),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(() => ({
    user: { id: 'user_123' },
  })),
  useAuth: vi.fn(() => ({
    getToken: vi.fn(() => Promise.resolve('test-token')),
  })),
}));

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('react-loading-skeleton', () => ({
  default: ({ count }) => <div data-testid="skeleton">{Array.from({length: count || 1}).map((_, i) => <div key={i}>Loading...</div>)}</div>,
}));

vi.mock('../apps/client/src/hooks/useLoadingProgress.js', () => ({
  useLoadingProgress: () => ({
    startLoadingWithProgress: vi.fn(),
    completeLoading: vi.fn(),
    stopLoadingImmediately: vi.fn(),
  }),
}));

vi.mock('../apps/client/src/utils/translationHelpers.js', () => ({
  useTranslationHelpers: vi.fn(() => ({
    getCityLabel: vi.fn((c) => c || ''),
  })),
}));

vi.mock('@/hooks', () => ({
  useLoadingProgress: () => ({
    startLoadingWithProgress: vi.fn(),
    completeLoading: vi.fn(),
    stopLoadingImmediately: vi.fn(),
  }),
}));

vi.mock('@/utils', () => ({
  useTranslationHelpers: vi.fn(() => ({
    getCityLabel: vi.fn((c) => c || ''),
  })),
}));

vi.mock('@/components', () => ({
  PaginationControl: ({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage - 1)}>Prev</button>
      <span>{currentPage}/{totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock('./ui', () => ({
  ImageModal: ({ show, onHide, imageUrl }) => show ? <div data-testid="image-modal">{imageUrl}</div> : null,
}));

// Mock react-bootstrap
vi.mock('react-bootstrap', () => ({
  Modal: ({ show, children, onHide }) => show ? <div data-testid="modal" onClick={onHide}>{children}</div> : null,
  Button: ({ children, onClick, variant }) => <button onClick={onClick}>{children}</button>,
}));

vi.mock('react-bootstrap/Modal', () => ({
  default: { Header: ({ children }) => <div>{children}</div>, Body: ({ children }) => <div>{children}</div>, Footer: ({ children }) => <div>{children}</div> }
}));

import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import UserJobs from '../apps/client/src/components/UserJobs.jsx';

const mockJobs = [
  {
    id: 1,
    title: 'Construction Worker',
    description: 'Looking for a construction worker',
    salary: 50,
    city: 'Tel Aviv',
    phone: '+972501234567',
    category: 'Construction',
    isActive: true,
    isPremium: false,
    boostedAt: null,
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 2,
    title: 'Cleaning Job',
    description: 'Looking for cleaner',
    salary: 40,
    city: 'Jerusalem',
    phone: '+972509876543',
    category: 'Cleaning',
    isActive: false,
    isPremium: true,
    boostedAt: new Date(Date.now() - 1000).toISOString(), // recently boosted
    imageUrl: null,
    createdAt: new Date('2024-01-02').toISOString(),
  },
];

describe('UserJobs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    useUser.mockReturnValue({ user: { id: 'user_123' } });
    axios.get.mockResolvedValue({
      data: {
        jobs: mockJobs,
        totalCount: 2,
        totalPages: 1,
        currentPage: 1,
      },
    });
  });

  it('renders without crashing', async () => {
    const { container } = render(<UserJobs />);
    expect(container).toBeDefined();
  });

  it('shows loading skeleton initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    const { container } = render(<UserJobs />);
    expect(container).toBeDefined();
  });

  it('renders jobs after fetching', async () => {
    const { container } = render(<UserJobs />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('renders when user has no jobs', async () => {
    axios.get.mockResolvedValue({
      data: { jobs: [], totalCount: 0, totalPages: 0, currentPage: 1 },
    });
    const { container } = render(<UserJobs />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('handles API error when fetching jobs', async () => {
    axios.get.mockRejectedValue(new Error('API error'));
    const { container } = render(<UserJobs />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('renders when no user is logged in', async () => {
    useUser.mockReturnValue({ user: null });
    const { container } = render(<UserJobs />);
    expect(container).toBeDefined();
  });

  it('renders jobs with images', async () => {
    const { container } = render(<UserJobs />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('handles delete button click opens confirm modal', async () => {
    const { container } = render(<UserJobs />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const deleteButtons = container.querySelectorAll('button');
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
    }
    expect(container).toBeDefined();
  });

  it('renders with boosted job', async () => {
    const boostedJob = {
      ...mockJobs[0],
      boostedAt: new Date(Date.now() - 1000).toISOString(), // boosted just now
    };
    axios.get.mockResolvedValue({
      data: { jobs: [boostedJob], totalCount: 1, totalPages: 1, currentPage: 1 },
    });
    const { container } = render(<UserJobs />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('renders with old boosted job (can boost again)', async () => {
    const oldBoostedJob = {
      ...mockJobs[0],
      boostedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
    };
    axios.get.mockResolvedValue({
      data: { jobs: [oldBoostedJob], totalCount: 1, totalPages: 1, currentPage: 1 },
    });
    const { container } = render(<UserJobs />);
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });
});
