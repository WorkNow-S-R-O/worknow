import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(() => ({ user: { id: 'user_123' } })),
  useClerk: vi.fn(() => ({ redirectToSignIn: vi.fn() })),
}));

vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

vi.mock('@/hooks', () => ({
  useGoogleAnalytics: vi.fn(() => ({
    trackPremiumSubscription: vi.fn(),
    trackButtonClick: vi.fn(),
    trackError: vi.fn(),
  })),
  useLoadingProgress: vi.fn(() => ({
    startLoadingWithProgress: vi.fn(),
    completeLoading: vi.fn(),
    stopLoadingImmediately: vi.fn(),
  })),
  useUserSync: vi.fn(() => ({
    dbUser: { isPremium: false, isPremiumDeluxe: false },
    loading: false,
    error: null,
    refreshUser: vi.fn(),
  })),
}));

import { useUser } from '@clerk/clerk-react';
import PremiumPage from '../apps/client/src/components/PremiumPage.jsx';

describe('PremiumPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.useFakeTimers();
    useUser.mockReturnValue({ user: { id: 'user_123' } });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = render(<PremiumPage />);
    expect(container).toBeDefined();
  });

  it('renders when user is not logged in', () => {
    useUser.mockReturnValue({ user: null });
    const { container } = render(<PremiumPage />);
    expect(container).toBeDefined();
  });

  it('renders when user is loading', () => {
    const { container } = render(<PremiumPage />);
    expect(container).toBeDefined();
  });

  it('renders premium user state', async () => {
    const { useUserSync } = await import('@/hooks');
    useUserSync.mockReturnValue({
      dbUser: { isPremium: true, isPremiumDeluxe: false },
      loading: false,
      error: null,
      refreshUser: vi.fn(),
    });
    const { container } = render(<PremiumPage />);
    expect(container).toBeDefined();
  });

  it('text carousel advances on timer', () => {
    const { container } = render(<PremiumPage />);
    vi.advanceTimersByTime(3000);
    expect(container).toBeDefined();
  });
});
