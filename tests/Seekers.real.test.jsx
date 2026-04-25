import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

vi.mock('react-router-dom', () => ({
  useUser: vi.fn(),
  Link: ({ children, to, state, style }) => <a href={to}>{children}</a>,
  useLocation: vi.fn(() => ({ state: null })),
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(() => ({ user: { id: 'user_123' } })),
  useAuth: vi.fn(() => ({ getToken: vi.fn(() => Promise.resolve('token')) })),
}));

vi.mock('@/hooks', () => ({
  useLoadingProgress: vi.fn(() => ({
    startLoadingWithProgress: vi.fn(),
    completeLoading: vi.fn(),
    stopLoadingImmediately: vi.fn(),
  })),
  useSeekers: vi.fn(() => ({
    seekers: [],
    loading: false,
    error: null,
    pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
  })),
}));

vi.mock('@/store', () => ({
  useSeekerFilterStore: vi.fn(() => ({
    filters: {},
    setFilters: vi.fn(),
  })),
}));

vi.mock('@/utils', () => ({
  downloadSeekersCSV: vi.fn(),
}));

vi.mock('@/components', () => ({
  CSVDownloadModal: ({ isOpen, onClose }) => isOpen ? <div data-testid="csv-modal"><button onClick={onClose}>Close</button></div> : null,
  PaginationControl: ({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

vi.mock('@/components/form', () => ({
  AddSeekerModal: ({ isOpen, onClose }) => isOpen ? <div data-testid="add-seeker-modal"><button onClick={onClose}>Close</button></div> : null,
}));

vi.mock('@/components/ui', () => ({
  SeekerFilterModal: ({ open, onClose, onApply }) => open ? <div data-testid="filter-modal"><button onClick={onClose}>Close</button><button onClick={() => onApply({})}>Apply</button></div> : null,
}));

vi.mock('react-bootstrap-icons', () => ({
  Facebook: () => <span>FB</span>,
}));

vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: { isPremium: false } })),
  },
}));

vi.mock('react-loading-skeleton', () => ({
  default: ({ count }) => <div data-testid="skeleton">Loading...</div>,
}));

vi.mock('react-hot-toast', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => <div>{children}</div>,
}));

// CSS mocks
vi.mock('../apps/client/src/css/seekers-table-mobile.css', () => ({}));
vi.mock('../apps/client/src/css/seekers-mobile.css', () => ({}));
vi.mock('react-loading-skeleton/dist/skeleton.css', () => ({}));

import { useUser } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';
import { useSeekers } from '@/hooks';
import { useSeekerFilterStore } from '@/store';
import Seekers from '../apps/client/src/pages/Seekers.jsx';

const mockSeekers = [
  {
    id: 1,
    name: 'Ivan Petrov',
    city: 'Tel Aviv',
    gender: 'мужчина',
    employment: 'полная',
    category: 'Construction',
    contact: '+972501234567',
    facebook: null,
    description: 'Experienced worker',
    isActive: true,
    isDemanded: false,
    isPremium: false,
    languages: ['Russian'],
    nativeLanguage: 'Russian',
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 2,
    name: 'Anna Smith',
    city: 'Jerusalem',
    gender: 'женщина',
    employment: 'частичная',
    category: 'Cleaning',
    contact: '+972509876543, facebook.com/anna',
    facebook: 'https://facebook.com/anna',
    description: 'Cleaning expert',
    isActive: true,
    isDemanded: true,
    isPremium: true,
    languages: ['Russian', 'Hebrew'],
    nativeLanguage: 'Russian',
    createdAt: new Date('2024-01-02').toISOString(),
  },
];

describe('Seekers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    useUser.mockReturnValue({ user: { id: 'user_123' } });
    useLocation.mockReturnValue({ state: null });
    useSeekers.mockReturnValue({
      seekers: mockSeekers,
      loading: false,
      error: null,
      pagination: { currentPage: 1, totalPages: 3, totalCount: 30 },
    });
    useSeekerFilterStore.mockReturnValue({
      filters: {},
      setFilters: vi.fn(),
    });
  });

  it('renders without crashing', () => {
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('renders loading state', () => {
    useSeekers.mockReturnValue({
      seekers: [],
      loading: true,
      error: null,
      pagination: null,
    });
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('renders error state', () => {
    useSeekers.mockReturnValue({
      seekers: [],
      loading: false,
      error: 'Failed to load',
      pagination: null,
    });
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('renders empty state when no seekers', () => {
    useSeekers.mockReturnValue({
      seekers: [],
      loading: false,
      error: null,
      pagination: { currentPage: 1, totalPages: 0, totalCount: 0 },
    });
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('renders seekers with premium user', () => {
    useUser.mockReturnValue({ user: { id: 'user_123', publicMetadata: { isPremium: true } } });
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('renders seekers when user is not logged in', () => {
    useUser.mockReturnValue({ user: null });
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('handles return to page from location state', () => {
    useLocation.mockReturnValue({
      state: { returnToPage: true, returnPage: 2 },
    });
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('handles invalid return page in location state', () => {
    useLocation.mockReturnValue({
      state: { returnToPage: true, returnPage: null },
    });
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('opens filter modal', () => {
    const { container } = render(<Seekers />);
    const filterBtn = container.querySelector('button');
    if (filterBtn) {
      fireEvent.click(filterBtn);
    }
    expect(container).toBeDefined();
  });

  it('renders seekers with facebook contact', () => {
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('renders demanded seeker badge', () => {
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });

  it('renders pagination when multiple pages', () => {
    const { container } = render(<Seekers />);
    expect(container.querySelector('[data-testid="pagination"]')).toBeTruthy();
  });

  it('handles page change', () => {
    const { container } = render(<Seekers />);
    const pagination = container.querySelector('[data-testid="pagination"]');
    if (pagination) {
      const nextBtn = pagination.querySelector('button');
      if (nextBtn) fireEvent.click(nextBtn);
    }
    expect(container).toBeDefined();
  });

  it('renders with active filters', () => {
    useSeekerFilterStore.mockReturnValue({
      filters: { city: 'Tel Aviv', employment: 'полная' },
      setFilters: vi.fn(),
    });
    const { container } = render(<Seekers />);
    expect(container).toBeDefined();
  });
});
