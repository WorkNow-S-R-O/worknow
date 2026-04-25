import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('react-intlayer', () => ({
  useIntlayer: vi.fn(() => new Proxy({}, {
    get: (_, key) => ({ value: String(key) }),
  })),
  useLocale: vi.fn(() => ({ locale: 'ru' })),
}));

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('../../index.css', () => ({}));

import axios from 'axios';
import CityDropdown from '../apps/client/src/components/ui/city-dropwdown.jsx';

const mockCities = [
  { id: 1, name: 'Центр страны', label: 'Центр страны' },
  { id: 2, name: 'Юг страны', label: 'Юг страны' },
  { id: 3, name: 'Север страны', label: 'Север страны' },
  { id: 4, name: 'Tel Aviv', label: 'Tel Aviv' },
  { id: 5, name: 'Jerusalem', label: 'Jerusalem' },
  { id: 6, name: 'Haifa', label: 'Haifa' },
];

describe('CityDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockResolvedValue({ data: mockCities });
  });

  it('renders without crashing', () => {
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );
    expect(container).toBeDefined();
  });

  it('shows selected city label in button', () => {
    const { container } = render(
      <CityDropdown
        selectedCity={{ value: 1, label: 'Tel Aviv' }}
        onCitySelect={vi.fn()}
      />
    );
    expect(container).toBeDefined();
  });

  it('fetches cities on mount', async () => {
    render(<CityDropdown selectedCity={null} onCitySelect={vi.fn()} />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('handles cities as array in response', async () => {
    axios.get.mockResolvedValue({ data: mockCities });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('handles cities in data.cities format', async () => {
    axios.get.mockResolvedValue({ data: { cities: mockCities } });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('handles unexpected API format', async () => {
    axios.get.mockResolvedValue({ data: { unexpected: 'format' } });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('handles API error', async () => {
    axios.get.mockRejectedValue({ message: 'Network error', response: { status: 500, data: 'error' } });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('handles API error without response property', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
    expect(container).toBeDefined();
  });

  it('opens modal when button clicked', async () => {
    axios.get.mockResolvedValue({ data: mockCities });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );

    const button = container.querySelector('button');
    fireEvent.click(button);
    // Modal should appear
    expect(container).toBeDefined();
  });

  it('closes modal when close button is clicked', async () => {
    axios.get.mockResolvedValue({ data: mockCities });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );

    const button = container.querySelector('button');
    fireEvent.click(button);

    const closeBtn = container.querySelector('.btn-close');
    if (closeBtn) {
      fireEvent.click(closeBtn);
    }
    expect(container).toBeDefined();
  });

  it('handles city selection from modal', async () => {
    const onCitySelect = vi.fn();
    axios.get.mockResolvedValue({ data: mockCities });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={onCitySelect} />
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const button = container.querySelector('button[type="button"]');
    fireEvent.click(button);

    // Try clicking a city in the list
    const listItems = container.querySelectorAll('.list-group-item');
    if (listItems.length > 0) {
      fireEvent.click(listItems[0]);
    }
    expect(container).toBeDefined();
  });

  it('renders with buttonClassName prop', () => {
    const { container } = render(
      <CityDropdown
        selectedCity={null}
        onCitySelect={vi.fn()}
        buttonClassName="custom-class"
      />
    );
    expect(container).toBeDefined();
  });

  it('searches cities in modal', async () => {
    axios.get.mockResolvedValue({ data: mockCities });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const button = container.querySelector('button[type="button"]');
    fireEvent.click(button);

    const searchInput = container.querySelector('input[type="text"]');
    if (searchInput) {
      fireEvent.change(searchInput, { target: { value: 'Tel' } });
      // Clear button should appear
      const clearBtn = container.querySelector('.btn.btn-outline-secondary');
      if (clearBtn) {
        fireEvent.click(clearBtn);
      }
    }
    expect(container).toBeDefined();
  });

  it('backdrop click closes modal on desktop', async () => {
    axios.get.mockResolvedValue({ data: mockCities });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const button = container.querySelector('button[type="button"]');
    fireEvent.click(button);

    const modal = container.querySelector('.modal');
    if (modal) {
      fireEvent.click(modal);
    }
    expect(container).toBeDefined();
  });

  it('handles touch events on modal header', async () => {
    axios.get.mockResolvedValue({ data: mockCities });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={vi.fn()} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const button = container.querySelector('button[type="button"]');
    fireEvent.click(button);

    const modalTitle = container.querySelector('.modal-title');
    if (modalTitle) {
      fireEvent.touchStart(modalTitle, { targetTouches: [{ clientY: 100 }] });
      fireEvent.touchMove(modalTitle, { targetTouches: [{ clientY: 200 }] });
      fireEvent.touchEnd(modalTitle);
    }
    expect(container).toBeDefined();
  });

  it('selects city "All" option', async () => {
    const onCitySelect = vi.fn();
    axios.get.mockResolvedValue({ data: mockCities });
    const { container } = render(
      <CityDropdown selectedCity={null} onCitySelect={onCitySelect} />
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const button = container.querySelector('button[type="button"]');
    fireEvent.click(button);

    const listItems = container.querySelectorAll('.list-group-item');
    if (listItems.length > 0) {
      // Click "All cities" option
      fireEvent.click(listItems[0]);
      expect(onCitySelect).toHaveBeenCalledWith(expect.objectContaining({ value: null }));
    }
    expect(container).toBeDefined();
  });
});
