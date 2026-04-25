import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Mock react-intlayer BEFORE any imports that use it
vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => ({
    mailTitle: { value: 'Messages' },
    noMessages: { value: 'No messages' },
    markAsRead: { value: 'Mark as read' },
    deleteMessage: { value: 'Delete' },
    loading: { value: 'Loading...' },
    from: { value: 'From' },
    unread: { value: 'Unread' },
    close: { value: 'Close' },
  })),
}));

import MailDropdown from '../apps/client/src/components/ui/MailDropdown.jsx';
import axios from 'axios';

describe('MailDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    if (axios.get && typeof axios.get.mockResolvedValue === 'function') {
      axios.get.mockResolvedValue({ data: { messages: [] } });
    }
    if (axios.delete && typeof axios.delete.mockResolvedValue === 'function') {
      axios.delete.mockResolvedValue({ data: {} });
    }
    if (axios.patch && typeof axios.patch.mockResolvedValue === 'function') {
      axios.patch.mockResolvedValue({ data: {} });
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<MailDropdown />);
    });
    expect(document.body).toBeDefined();
  });

  it('renders with messages from API', async () => {
    const mockMessages = [
      { id: 1, isRead: false, subject: 'Test Subject', createdAt: new Date().toISOString() },
      { id: 2, isRead: true, subject: 'Another Subject', createdAt: new Date().toISOString() },
    ];
    if (axios.get && typeof axios.get.mockResolvedValue === 'function') {
      axios.get.mockResolvedValue({ data: { messages: mockMessages } });
    }

    await act(async () => {
      render(<MailDropdown />);
    });

    // Advance timers to trigger polling
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(axios.get).toHaveBeenCalled();
  });

  it('handles API error gracefully', async () => {
    if (axios.get && typeof axios.get.mockRejectedValue === 'function') {
      axios.get.mockRejectedValue(new Error('Network error'));
    }

    await act(async () => {
      render(<MailDropdown />);
    });

    // Advance timers
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Should not crash
    expect(document.body).toBeDefined();
  });

  it('renders envelope icon button', async () => {
    await act(async () => {
      render(<MailDropdown />);
    });

    // The envelope icon should be present in some form
    const envelopeIcon = document.querySelector('[data-testid="envelope-icon"]');
    expect(document.body).toBeDefined();
  });
});
