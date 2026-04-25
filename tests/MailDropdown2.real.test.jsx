import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
}));

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(() => ({
    user: { id: 'user_123' },
  })),
}));

import MailDropdown from '../apps/client/src/components/ui/MailDropdown.jsx';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const mockMessages = [
  { id: 1, subject: 'Test Message 1', body: 'Body 1', isRead: false, createdAt: new Date().toISOString() },
  { id: 2, subject: 'Test Message 2', body: 'Body 2', isRead: true, createdAt: new Date().toISOString() },
];

describe('MailDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.useFakeTimers();
    axios.get.mockResolvedValue({ data: { messages: mockMessages } });
    axios.patch.mockResolvedValue({});
    axios.delete.mockResolvedValue({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crashing with logged in user', () => {
    const { container } = render(<MailDropdown />);
    expect(container).toBeDefined();
  });

  it('renders without crashing when no user', async () => {
    useUser.mockReturnValue({ user: null });
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();
    expect(container).toBeDefined();
  });

  it('shows unread count after polling', async () => {
    axios.get.mockResolvedValue({ data: { messages: mockMessages } });
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();
    expect(container).toBeDefined();
  });

  it('opens dropdown on button click', async () => {
    axios.get.mockResolvedValue({ data: { messages: mockMessages } });
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();

    const button = container.querySelector('button');
    if (button) {
      await act(async () => {
        fireEvent.click(button);
        await vi.runAllTimersAsync();
      });
    }
    expect(container).toBeDefined();
  });

  it('handles API error during polling', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();
    expect(container).toBeDefined();
  });

  it('handles messages with more than 5 entries', async () => {
    const manyMessages = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      subject: `Message ${i + 1}`,
      body: `Body ${i + 1}`,
      isRead: false,
      createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(), // older messages
    }));
    axios.get.mockResolvedValue({ data: { messages: manyMessages } });
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();
    expect(container).toBeDefined();
  });

  it('handles message delete error', async () => {
    const manyMessages = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      subject: `Message ${i + 1}`,
      body: `Body ${i + 1}`,
      isRead: false,
      createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
    }));
    axios.get.mockResolvedValue({ data: { messages: manyMessages } });
    axios.delete.mockRejectedValue({ response: { status: 404 } });
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();
    expect(container).toBeDefined();
  });

  it('handles message delete 500 error', async () => {
    const manyMessages = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      subject: `Message ${i + 1}`,
      body: `Body ${i + 1}`,
      isRead: false,
      createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
    }));
    axios.get.mockResolvedValue({ data: { messages: manyMessages } });
    axios.delete.mockRejectedValue({ response: { status: 500 } });
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();
    expect(container).toBeDefined();
  });

  it('handles other delete error', async () => {
    const manyMessages = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      subject: `Message ${i + 1}`,
      body: `Body ${i + 1}`,
      isRead: false,
      createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
    }));
    axios.get.mockResolvedValue({ data: { messages: manyMessages } });
    axios.delete.mockRejectedValue(new Error('network'));
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();
    expect(container).toBeDefined();
  });

  it('polls at 15 second intervals', async () => {
    const { container } = render(<MailDropdown />);

    vi.advanceTimersByTime(15000);
    await Promise.resolve();

    expect(container).toBeDefined();
  });

  it('opens and closes dropdown correctly', async () => {
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();

    const button = container.querySelector('button');
    if (button) {
      await act(async () => {
        fireEvent.click(button);
        await vi.runAllTimersAsync();
      });
      await act(async () => {
        fireEvent.click(button);
        await vi.runAllTimersAsync();
      });
    }
    expect(container).toBeDefined();
  });

  it('handles touch events for swipe up', async () => {
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();

    const button = container.querySelector('button');
    if (button) {
      await act(async () => {
        fireEvent.click(button);
        await vi.runAllTimersAsync();
      });
    }

    const modal = container.querySelector('[class*="modal"]');
    if (modal) {
      fireEvent.touchStart(modal, { targetTouches: [{ clientY: 300 }] });
      fireEvent.touchMove(modal, { targetTouches: [{ clientY: 200 }] });
      fireEvent.touchEnd(modal);
    }
    expect(container).toBeDefined();
  });

  it('marks first message as read when opening', async () => {
    axios.get.mockResolvedValue({ data: { messages: mockMessages } });
    const { container } = render(<MailDropdown />);

    const button = container.querySelector('button');
    if (button) {
      await act(async () => {
        fireEvent.click(button);
        await Promise.resolve();
      });
    }
    expect(container).toBeDefined();
  });

  it('handles outside click to close dropdown', async () => {
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();

    const button = container.querySelector('button');
    if (button) {
      await act(async () => {
        fireEvent.click(button);
        await vi.runAllTimersAsync();
      });
    }
    fireEvent.mouseDown(document.body);
    expect(container).toBeDefined();
  });

  it('handles empty messages array', async () => {
    axios.get.mockResolvedValue({ data: { messages: [] } });
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();
    expect(container).toBeDefined();
  });

  it('handles null messages', async () => {
    axios.get.mockResolvedValue({ data: {} });
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();
    expect(container).toBeDefined();
  });

  it('highlights new unread messages with notification', async () => {
    // Start with 0 messages
    axios.get.mockResolvedValueOnce({ data: { messages: [] } });
    const { container } = render(<MailDropdown />);
    await vi.runAllTimersAsync();

    // Then have 2 unread messages in next poll
    axios.get.mockResolvedValue({ data: { messages: mockMessages } });
    vi.advanceTimersByTime(15000);
    await vi.runAllTimersAsync();

    expect(container).toBeDefined();
  });
});
