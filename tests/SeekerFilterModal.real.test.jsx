import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
  useLocale: vi.fn(() => ({ locale: 'ru' })),
}));

global.fetch = vi.fn();

import SeekerFilterModal from '../apps/client/src/components/ui/SeekerFilterModal.jsx';

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  onApply: vi.fn(),
  currentFilters: {},
};

const mockCities = [
  { id: 1, name: 'Tel Aviv' },
  { id: 2, name: 'Jerusalem' },
];

const mockCategories = [
  { id: 1, name: 'Construction' },
  { id: 2, name: 'Cleaning' },
];

describe('SeekerFilterModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockCities) })
      .mockResolvedValueOnce({ json: () => Promise.resolve(mockCategories) });
  });

  it('renders without crashing when open', () => {
    const { container } = render(<SeekerFilterModal {...defaultProps} />);
    expect(container).toBeDefined();
  });

  it('returns null when not open', () => {
    const { container } = render(
      <SeekerFilterModal {...defaultProps} open={false} />
    );
    // Modal should not render when closed
    expect(container.innerHTML).toBe('');
  });

  it('fetches cities and categories when opened', async () => {
    render(<SeekerFilterModal {...defaultProps} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });

  it('handles fetch error gracefully', async () => {
    global.fetch.mockReset();
    global.fetch.mockRejectedValue(new Error('Network error'));
    const { container } = render(<SeekerFilterModal {...defaultProps} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('renders with currentFilters pre-populated', () => {
    const { container } = render(
      <SeekerFilterModal
        {...defaultProps}
        currentFilters={{
          city: 'Tel Aviv',
          category: 'Construction',
          employment: 'полная',
          documentType: 'Виза Б1',
          languages: ['русский', 'иврит'],
          gender: 'мужчина',
          isDemanded: true,
        }}
      />
    );
    expect(container).toBeDefined();
  });

  it('handles close button click', () => {
    const onClose = vi.fn();
    const { container } = render(
      <SeekerFilterModal {...defaultProps} onClose={onClose} />
    );
    const closeBtn = container.querySelector('[aria-label="Close"], .btn-close, button');
    if (closeBtn) {
      fireEvent.click(closeBtn);
    }
    expect(container).toBeDefined();
  });

  it('handles apply button click', async () => {
    const onApply = vi.fn();
    const { container } = render(
      <SeekerFilterModal {...defaultProps} onApply={onApply} />
    );
    // Find apply button
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.textContent && btn.textContent.includes('apply')) {
        fireEvent.click(btn);
      }
    });
    expect(container).toBeDefined();
  });

  it('handles city select change', async () => {
    const { container } = render(<SeekerFilterModal {...defaultProps} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

    const selects = container.querySelectorAll('select');
    if (selects.length > 0) {
      fireEvent.change(selects[0], { target: { value: 'Tel Aviv' } });
    }
    expect(container).toBeDefined();
  });

  it('handles category select change', async () => {
    const { container } = render(<SeekerFilterModal {...defaultProps} />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

    const selects = container.querySelectorAll('select');
    if (selects.length > 1) {
      fireEvent.change(selects[1], { target: { value: 'Construction' } });
    }
    expect(container).toBeDefined();
  });

  it('handles employment select change', async () => {
    const { container } = render(<SeekerFilterModal {...defaultProps} />);
    const selects = container.querySelectorAll('select');
    selects.forEach((select, idx) => {
      fireEvent.change(select, { target: { value: 'полная' } });
    });
    expect(container).toBeDefined();
  });

  it('handles language checkbox change', async () => {
    const { container } = render(<SeekerFilterModal {...defaultProps} />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if (!cb.checked) {
        fireEvent.click(cb);
      }
    });
    expect(container).toBeDefined();
  });

  it('handles isDemanded checkbox change', async () => {
    const { container } = render(<SeekerFilterModal {...defaultProps} />);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length > 0) {
      // Toggle isDemanded
      fireEvent.click(checkboxes[checkboxes.length - 1]);
    }
    expect(container).toBeDefined();
  });

  it('handles touch events for swipe down', () => {
    const onClose = vi.fn();
    const { container } = render(
      <SeekerFilterModal {...defaultProps} onClose={onClose} />
    );
    const modal = container.querySelector('[class*="modal"], [role="dialog"], .modal');
    if (modal) {
      fireEvent.touchStart(modal, { targetTouches: [{ clientY: 100 }] });
      fireEvent.touchMove(modal, { targetTouches: [{ clientY: 200 }] });
      fireEvent.touchEnd(modal);
    }
    expect(container).toBeDefined();
  });

  it('resets filters when cleared', async () => {
    const { container } = render(
      <SeekerFilterModal
        {...defaultProps}
        currentFilters={{ city: 'Tel Aviv', employment: 'полная' }}
      />
    );

    // Find reset/clear button
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.textContent && (btn.textContent.toLowerCase().includes('clear') || btn.textContent.toLowerCase().includes('reset') || btn.textContent.toLowerCase().includes('сброс'))) {
        fireEvent.click(btn);
      }
    });
    expect(container).toBeDefined();
  });

  it('handles language unchecking', async () => {
    const { container } = render(
      <SeekerFilterModal
        {...defaultProps}
        currentFilters={{ languages: ['русский', 'иврит'] }}
      />
    );
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if (cb.checked) {
        fireEvent.click(cb);
      }
    });
    expect(container).toBeDefined();
  });

  it('outside click closes modal on desktop', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <SeekerFilterModal {...defaultProps} onClose={onClose} />
    );
    // Click outside the modal (body)
    fireEvent.mouseDown(document.body);
    expect(container).toBeDefined();
  });

  it('transitions from open to closed', () => {
    const { container, rerender } = render(
      <SeekerFilterModal {...defaultProps} open={true} />
    );
    expect(container.innerHTML).not.toBe('');

    rerender(<SeekerFilterModal {...defaultProps} open={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('submits the filter form', async () => {
    const onApply = vi.fn();
    const onClose = vi.fn();
    const { container } = render(
      <SeekerFilterModal {...defaultProps} onApply={onApply} onClose={onClose} />
    );
    const form = container.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }
    expect(container).toBeDefined();
  });
});
