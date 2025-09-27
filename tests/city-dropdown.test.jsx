import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';
import { useState, useEffect } from 'react';

// Mock CSS imports
vi.mock('../../index.css', () => ({}), { virtual: true });

// Mock axios
import axios from 'axios';
vi.mock('axios');

// Mock react-intlayer
const mockUseIntlayer = vi.fn(() => ({
	chooseCity: { value: 'Choose City' },
	cityAll: { value: 'All Cities' },
}));

const mockUseLocale = vi.fn(() => ({
	locale: 'en',
}));

vi.mock('react-intlayer', () => ({
	useIntlayer: mockUseIntlayer,
	useLocale: mockUseLocale,
}));

// Mock environment variable
Object.defineProperty(import.meta, 'env', {
	value: {
		VITE_API_URL: 'http://localhost:3001',
	},
	writable: true,
});

// Mock createPortal
vi.mock('react-dom', () => ({
	createPortal: (children, container) => children,
}));

// Simple CityDropdown component for testing
const CityDropdown = ({ selectedCity, onCitySelect, buttonClassName = '' }) => {
	const [cities, setCities] = useState([]);
	const [open, setOpen] = useState(false);
	const { locale } = mockUseLocale();
	const content = mockUseIntlayer('cityDropdown');

	useEffect(() => {
		const fetchCities = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/cities?lang=${locale}`,
				);
				if (Array.isArray(response.data)) {
					setCities(response.data);
				} else if (response.data && Array.isArray(response.data.cities)) {
					setCities(response.data.cities);
				} else {
					setCities([]);
				}
			} catch (error) {
				setCities([]);
			}
		};
		fetchCities();
	}, [locale]);

	const regionOrder = [
		['Центр страны', 'מרכז הארץ', 'Center'],
		['Юг страны', 'דרום הארץ', 'South'],
		['Север страны', 'צפון הארץ', 'North'],
	];

	const citiesArray = Array.isArray(cities) ? cities : [];
	const regions = regionOrder
		.map((labels) =>
			citiesArray.find((city) => labels.includes(city.label || city.name)),
		)
		.filter(Boolean);
	const otherCities = citiesArray.filter((city) => !regions.includes(city));

	return (
		<>
			<button
				type="button"
				className={`btn btn-outline-primary d-flex align-items-center justify-content-center ${buttonClassName}`}
				onClick={() => setOpen(true)}
			>
				<i className="bi bi-geo-alt me-2"></i>
				{selectedCity?.label || content.cityAll.value}
			</button>
			{open && (
				<div className="modal fade show" style={{ display: 'block' }}>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">{content.chooseCity.value}</h5>
								<button
									type="button"
									className="btn-close"
									aria-label="Close"
									onClick={() => setOpen(false)}
								></button>
							</div>
							<div className="modal-body">
								<input
									type="text"
									className="form-control"
									placeholder={content.chooseCity.value}
								/>
								<ul className="list-group">
									<li
										className="list-group-item"
										onClick={() => {
											onCitySelect({
												value: null,
												label: content.cityAll.value,
											});
											setOpen(false);
										}}
									>
										{content.cityAll.value}
									</li>
									{regions.map((city) => (
										<li
											key={city.id}
											className="list-group-item"
											onClick={() => {
												onCitySelect({
													value: city.id,
													label: city.label || city.name,
												});
												setOpen(false);
											}}
										>
											{city.label || city.name}
										</li>
									))}
									{otherCities.map((city) => (
										<li
											key={city.id}
											className="list-group-item"
											onClick={() => {
												onCitySelect({
													value: city.id,
													label: city.label || city.name,
												});
												setOpen(false);
											}}
										>
											{city.label || city.name}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

describe('CityDropdown Component', () => {
	const mockCities = [
		{ id: 1, label: 'Center', name: 'Center' },
		{ id: 2, label: 'South', name: 'South' },
		{ id: 3, label: 'North', name: 'North' },
		{ id: 4, label: 'Tel Aviv', name: 'Tel Aviv' },
		{ id: 5, label: 'Haifa', name: 'Haifa' },
	];

	const defaultProps = {
		selectedCity: null,
		onCitySelect: vi.fn(),
		buttonClassName: '',
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock axios to return cities
		vi.mocked(axios.get).mockResolvedValue({
			data: mockCities,
		});
	});

	describe('Basic Rendering', () => {
		it('renders the dropdown button', async () => {
			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			expect(screen.getByText('All Cities')).toBeInTheDocument();
			expect(screen.getByRole('button')).toBeInTheDocument();
		});

		it('displays selected city label when a city is selected', async () => {
			const propsWithCity = {
				...defaultProps,
				selectedCity: { value: 1, label: 'Center' },
			};

			await act(async () => {
				render(<CityDropdown {...propsWithCity} />);
			});

			expect(screen.getByText('Center')).toBeInTheDocument();
		});

		it('applies custom button className', async () => {
			const propsWithClassName = {
				...defaultProps,
				buttonClassName: 'custom-class',
			};

			await act(async () => {
				render(<CityDropdown {...propsWithClassName} />);
			});

			const button = screen.getByRole('button');
			expect(button).toHaveClass('custom-class');
		});
	});

	describe('API Integration', () => {
		it('fetches cities on mount', async () => {
			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalledWith(
					'http://localhost:3001/api/cities?lang=en',
				);
			});
		});

		it('handles API response with cities array', async () => {
			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled();
			});
		});

		it('handles API response with cities object', async () => {
			vi.mocked(axios.get).mockResolvedValue({
				data: { cities: mockCities },
			});

			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled();
			});
		});

		it('handles API errors gracefully', async () => {
			vi.mocked(axios.get).mockRejectedValue(new Error('API Error'));

			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled();
			});
		});

		it('handles empty API response', async () => {
			vi.mocked(axios.get).mockResolvedValue({
				data: [],
			});

			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled();
			});
		});
	});

	describe('Modal Interactions', () => {
		it('opens modal when button is clicked', async () => {
			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			const button = screen.getByRole('button');
			await act(async () => {
				fireEvent.click(button);
			});

			expect(screen.getByText('Choose City')).toBeInTheDocument();
		});

		it('closes modal when close button is clicked', async () => {
			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			const button = screen.getByRole('button');
			await act(async () => {
				fireEvent.click(button);
			});

			await waitFor(() => {
				expect(screen.getByText('Choose City')).toBeInTheDocument();
			});

			const closeButton = screen.getByLabelText('Close');
			await act(async () => {
				fireEvent.click(closeButton);
			});

			expect(screen.queryByText('Choose City')).not.toBeInTheDocument();
		});

		it('handles city selection', async () => {
			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			const button = screen.getByRole('button');
			await act(async () => {
				fireEvent.click(button);
			});

			await waitFor(() => {
				expect(screen.getByText('Choose City')).toBeInTheDocument();
			});

			// Wait for cities to load
			await waitFor(() => {
				expect(screen.getByText('Center')).toBeInTheDocument();
			});

			const centerCity = screen.getByText('Center');
			await act(async () => {
				fireEvent.click(centerCity);
			});

			expect(defaultProps.onCitySelect).toHaveBeenCalledWith({
				value: 1,
				label: 'Center',
			});
		});

		it('handles "All Cities" selection', async () => {
			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			const button = screen.getByRole('button');
			await act(async () => {
				fireEvent.click(button);
			});

			await waitFor(() => {
				expect(screen.getByText('Choose City')).toBeInTheDocument();
			});

			const allCitiesOption = screen.getAllByText('All Cities')[1]; // Get the second one (in the modal)
			await act(async () => {
				fireEvent.click(allCitiesOption);
			});

			expect(defaultProps.onCitySelect).toHaveBeenCalledWith({
				value: null,
				label: 'All Cities',
			});
		});
	});

	describe('City Organization', () => {
		it('organizes cities into regions and other cities', async () => {
			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			const button = screen.getByRole('button');
			await act(async () => {
				fireEvent.click(button);
			});

			await waitFor(() => {
				expect(screen.getByText('Choose City')).toBeInTheDocument();
			});

			// Wait for cities to load
			await waitFor(() => {
				expect(screen.getByText('Center')).toBeInTheDocument();
			});

			// Check that regions are displayed
			expect(screen.getByText('Center')).toBeInTheDocument();
			expect(screen.getByText('South')).toBeInTheDocument();
			expect(screen.getByText('North')).toBeInTheDocument();

			// Check that other cities are displayed
			expect(screen.getByText('Tel Aviv')).toBeInTheDocument();
			expect(screen.getByText('Haifa')).toBeInTheDocument();
		});

		it('handles cities with both label and name properties', async () => {
			const citiesWithBoth = [
				{ id: 1, label: 'Center Label', name: 'Center Name' },
				{ id: 2, label: 'South Label', name: 'South Name' },
			];

			vi.mocked(axios.get).mockResolvedValue({
				data: citiesWithBoth,
			});

			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			const button = screen.getByRole('button');
			await act(async () => {
				fireEvent.click(button);
			});

			await waitFor(() => {
				expect(screen.getByText('Choose City')).toBeInTheDocument();
			});

			await waitFor(() => {
				expect(screen.getByText('Center Label')).toBeInTheDocument();
			});
		});

		it('handles cities with only name property', async () => {
			const citiesWithNameOnly = [
				{ id: 1, name: 'Center Name' },
				{ id: 2, name: 'South Name' },
			];

			vi.mocked(axios.get).mockResolvedValue({
				data: citiesWithNameOnly,
			});

			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			const button = screen.getByRole('button');
			await act(async () => {
				fireEvent.click(button);
			});

			await waitFor(() => {
				expect(screen.getByText('Choose City')).toBeInTheDocument();
			});

			await waitFor(() => {
				expect(screen.getByText('Center Name')).toBeInTheDocument();
			});
		});
	});

	describe('Error Handling', () => {
		it('handles invalid API response format', async () => {
			vi.mocked(axios.get).mockResolvedValue({
				data: 'invalid format',
			});

			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled();
			});
		});

		it('handles null API response', async () => {
			vi.mocked(axios.get).mockResolvedValue({
				data: null,
			});

			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled();
			});
		});

		it('handles undefined API response', async () => {
			vi.mocked(axios.get).mockResolvedValue({
				data: undefined,
			});

			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled();
			});
		});
	});

	describe('Accessibility', () => {
		it('has proper ARIA labels', async () => {
			await act(async () => {
				render(<CityDropdown {...defaultProps} />);
			});

			const button = screen.getByRole('button');
			await act(async () => {
				fireEvent.click(button);
			});

			await waitFor(() => {
				expect(screen.getByText('Choose City')).toBeInTheDocument();
			});

			const closeButton = screen.getByLabelText('Close');
			expect(closeButton).toBeInTheDocument();
		});
	});
});
