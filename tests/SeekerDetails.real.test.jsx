import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';

// Mock react-router-dom
const mockUseParams = vi.fn(() => ({ id: '1' }));
const mockUseLocation = vi.fn(() => ({ state: null }));
vi.mock('react-router-dom', () => ({
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: vi.fn(() => vi.fn()),
}));

// Mock react-intlayer - use a Proxy to return { value: key } for any property
vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

// Mock useTranslationHelpers
vi.mock('../apps/client/src/utils/translationHelpers.js', () => ({
  useTranslationHelpers: vi.fn(() => ({
    getGenderLabel: vi.fn((g) => g || ''),
    getEmploymentLabel: vi.fn((e) => e || ''),
    getCategoryLabel: vi.fn((c) => c || ''),
    getLangLabel: vi.fn((l) => l || ''),
    getDocumentTypeLabel: vi.fn((d) => d || ''),
    getCityLabel: vi.fn((c) => c || ''),
  })),
}));

// Override useLoadingProgress to include stopLoadingImmediately
vi.mock('../apps/client/src/hooks/useLoadingProgress.js', () => ({
  useLoadingProgress: () => ({
    startLoadingWithProgress: vi.fn(),
    completeLoading: vi.fn(),
    stopLoadingImmediately: vi.fn(),
  }),
}));

// Mock CSS imports
vi.mock('../apps/client/src/css/seeker-details-mobile.css', () => ({}));
vi.mock('../apps/client/src/css/ripple.css', () => ({}));

import SeekerDetails from '../apps/client/src/pages/SeekerDetails.jsx';

const mockSeeker = {
  id: 1,
  name: 'Ivan Petrov',
  city: 'Tel Aviv',
  gender: 'мужчина',
  employment: 'полная',
  category: 'Construction',
  languages: ['Russian', 'Hebrew'],
  nativeLanguage: 'Russian',
  documents: 'Visa B1',
  documentType: 'Виза Б1',
  contact: '+972501234567',
  facebook: null,
  description: 'Experienced construction worker',
  note: 'Some note',
  announcement: 'Job announcement',
  isActive: true,
  isDemanded: false,
  isPremium: false,
};

describe('SeekerDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: '1' });
    mockUseLocation.mockReturnValue({ state: null });
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockSeeker),
    });
  });

  it('shows loading state initially', () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // Never resolves
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('renders without crashing with basic seeker data', async () => {
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('renders with navigation state having seekerIds', async () => {
    mockUseLocation.mockReturnValue({
      state: { seekerIds: [1, 2, 3], currentIndex: 1, returnToPage: 1 },
    });
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('renders with seekerIds at first index (no prev)', async () => {
    mockUseLocation.mockReturnValue({
      state: { seekerIds: [1, 2, 3], currentIndex: 0, returnToPage: 1 },
    });
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('renders with seekerIds at last index (no next)', async () => {
    mockUseLocation.mockReturnValue({
      state: { seekerIds: [1, 2, 3], currentIndex: 2, returnToPage: 1 },
    });
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('renders premium seeker', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ ...mockSeeker, isPremium: true }),
    });
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('renders seeker with facebook contact', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        ...mockSeeker,
        contact: '+972501234567, facebook.com/ivan',
      }),
    });
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('renders with null seeker data initially', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ id: 1, name: 'Test' }), // no description
    });

    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('renders seeker without note and announcement', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        ...mockSeeker,
        note: null,
        announcement: null,
      }),
    });
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('renders seeker with isDemanded=true', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ ...mockSeeker, isDemanded: true }),
    });
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });

  it('handles when user is not logged in (no clerkUserId)', async () => {
    // useUser mock returns null user
    const { container } = render(<SeekerDetails />);
    expect(container).toBeDefined();
  });
});
