import { vi } from 'vitest';

// Mock useFetchCities hook
export const mockUseFetchCities = vi.fn(() => ({
	cities: [
		{ value: 1, label: 'Tel Aviv' },
		{ value: 2, label: 'Jerusalem' },
		{ value: 3, label: 'Haifa' },
	],
	loading: false,
}));

// Mock useFetchCategories hook
export const mockUseFetchCategories = vi.fn(() => ({
	categories: [
		{ value: 1, label: 'Construction' },
		{ value: 2, label: 'Cleaning' },
		{ value: 3, label: 'Delivery' },
	],
	loading: false,
}));

// Mock useLoadingProgress hook
export const mockUseLoadingProgress = vi.fn(() => ({
	startLoadingWithProgress: vi.fn(),
	completeLoading: vi.fn(),
}));

// Reset mocks before each test
export const resetHookMocks = () => {
	mockUseFetchCities.mockClear();
	mockUseFetchCategories.mockClear();
	mockUseLoadingProgress.mockClear();
};
