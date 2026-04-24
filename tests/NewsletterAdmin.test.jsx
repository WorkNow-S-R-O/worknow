import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({ user: null }),
}));
vi.mock('react-intlayer', () => ({
  useIntlayer: () => ({
    loading: { value: 'Loading...' },
    active: { value: 'Active' },
    inactive: { value: 'Inactive' },
  }),
}));
vi.mock('react-hot-toast', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('axios');

import NewsletterAdmin from '../apps/client/src/components/ui/NewsletterAdmin.jsx';

describe('NewsletterAdmin', () => {
  it('renders without crashing for non-admin user', () => {
    const { container } = render(<NewsletterAdmin />);
    expect(container).toBeDefined();
  });

  it('shows access denied for non-admin user', () => {
    const { getByText } = render(<NewsletterAdmin />);
    expect(getByText('Доступ запрещен')).toBeInTheDocument();
  });
});
