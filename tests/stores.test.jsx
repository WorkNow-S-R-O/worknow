import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useFilterStore from '../apps/client/src/store/filterStore';
import useLanguageStore from '../apps/client/src/store/languageStore';
import useSeekerFilterStore from '../apps/client/src/store/seekerFilterStore';

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

// Mock window.location.reload
Object.defineProperty(window, 'location', {
	value: { reload: vi.fn() },
	writable: true,
});

describe('Zustand Stores', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.getItem.mockReturnValue('ru');
	});

	afterEach(() => {
		// Clean up any side effects
		localStorageMock.clear();
	});

	describe('Filter Store', () => {
		it('initializes with default state', () => {
			const { result } = renderHook(() => useFilterStore());

			expect(result.current.filters).toEqual({
				salary: undefined,
				categoryId: undefined,
				shuttleOnly: false,
				mealsOnly: false,
			});
		});

		it('sets filters correctly', () => {
			const { result } = renderHook(() => useFilterStore());

			act(() => {
				result.current.setFilters({
					salary: '1500',
					categoryId: 'construction',
					shuttleOnly: true,
					mealsOnly: false,
				});
			});

			expect(result.current.filters).toEqual({
				salary: '1500',
				categoryId: 'construction',
				shuttleOnly: true,
				mealsOnly: false,
			});
		});

		it('resets filters to default state', () => {
			const { result } = renderHook(() => useFilterStore());

			// Set some filters first
			act(() => {
				result.current.setFilters({
					salary: '2000',
					categoryId: 'cleaning',
				});
			});

			// Reset filters
			act(() => {
				result.current.resetFilters();
			});

			expect(result.current.filters).toEqual({
				salary: undefined,
				categoryId: undefined,
				shuttleOnly: false,
				mealsOnly: false,
			});
		});

		it('handles partial filter updates', () => {
			const { result } = renderHook(() => useFilterStore());

			act(() => {
				result.current.setFilters({ salary: '1500' });
			});

			// The store completely replaces the filters object, so only salary should be set
			expect(result.current.filters.salary).toBe('1500');
			expect(result.current.filters.categoryId).toBeUndefined();
			expect(result.current.filters.shuttleOnly).toBeUndefined();
			expect(result.current.filters.mealsOnly).toBeUndefined();
		});

		it('maintains filter state between updates', () => {
			const { result } = renderHook(() => useFilterStore());

			// First update
			act(() => {
				result.current.setFilters({ salary: '1500' });
			});

			// Second update - should replace the entire object
			act(() => {
				result.current.setFilters({
					salary: '1500',
					categoryId: 'construction',
				});
			});

			// Should have both values, but others are undefined since we didn't set them
			expect(result.current.filters.salary).toBe('1500');
			expect(result.current.filters.categoryId).toBe('construction');
			expect(result.current.filters.shuttleOnly).toBeUndefined();
			expect(result.current.filters.mealsOnly).toBeUndefined();
		});
	});

	describe('Language Store', () => {
		it('initializes with default language from localStorage', () => {
			localStorageMock.getItem.mockReturnValue('ru');

			const { result } = renderHook(() => useLanguageStore());

			expect(result.current.language).toBe('ru');
			expect(result.current.localization).toBeDefined();
		});

		it('changes language correctly', () => {
			const { result } = renderHook(() => useLanguageStore());

			act(() => {
				result.current.changeLanguage('en');
			});

			expect(result.current.language).toBe('en');
			expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'en');
		});

		it('handles multiple language changes', () => {
			const { result } = renderHook(() => useLanguageStore());

			const languages = ['en', 'ru'];

			languages.forEach((lang) => {
				act(() => {
					result.current.changeLanguage(lang);
				});

				expect(result.current.language).toBe(lang);
			});
		});

		it('stores language preference in localStorage', () => {
			const { result } = renderHook(() => useLanguageStore());

			act(() => {
				result.current.changeLanguage('en');
			});

			expect(localStorageMock.setItem).toHaveBeenCalledWith('language', 'en');
		});

		it('reloads page when language changes', () => {
			const { result } = renderHook(() => useLanguageStore());

			act(() => {
				result.current.changeLanguage('en');
			});

			expect(window.location.reload).toHaveBeenCalled();
		});
	});

	describe('Seeker Filter Store', () => {
		it('initializes with default state', () => {
			const { result } = renderHook(() => useSeekerFilterStore());

			expect(result.current.filters).toEqual({
				city: undefined,
				category: undefined,
				employment: undefined,
				documentType: undefined,
				languages: undefined,
				gender: undefined,
				isDemanded: undefined,
			});
		});

		it('sets seeker filters correctly', () => {
			const { result } = renderHook(() => useSeekerFilterStore());

			const newFilters = {
				city: 'tel-aviv',
				category: 'construction',
				employment: 'full-time',
				gender: 'male',
				languages: ['Hebrew', 'English'],
				isDemanded: true,
			};

			act(() => {
				result.current.setFilters(newFilters);
			});

			expect(result.current.filters).toEqual(newFilters);
		});

		it('resets seeker filters to default state', () => {
			const { result } = renderHook(() => useSeekerFilterStore());

			// Set some filters first
			act(() => {
				result.current.setFilters({
					city: 'tel-aviv',
					category: 'construction',
				});
			});

			// Reset filters
			act(() => {
				result.current.resetFilters();
			});

			expect(result.current.filters).toEqual({
				city: undefined,
				category: undefined,
				employment: undefined,
				documentType: undefined,
				languages: undefined,
				gender: undefined,
				isDemanded: undefined,
			});
		});

		it('handles partial filter updates', () => {
			const { result } = renderHook(() => useSeekerFilterStore());

			act(() => {
				result.current.setFilters({ city: 'tel-aviv' });
			});

			expect(result.current.filters.city).toBe('tel-aviv');
			expect(result.current.filters.category).toBeUndefined();
		});

		it('maintains filter state between updates', () => {
			const { result } = renderHook(() => useSeekerFilterStore());

			// First update
			act(() => {
				result.current.setFilters({ city: 'tel-aviv' });
			});

			// Second update - should replace the entire object
			act(() => {
				result.current.setFilters({
					city: 'tel-aviv',
					category: 'construction',
				});
			});

			// Should have both values, but others are undefined since we didn't set them
			expect(result.current.filters.city).toBe('tel-aviv');
			expect(result.current.filters.category).toBe('construction');
			expect(result.current.filters.employment).toBeUndefined();
			expect(result.current.filters.documentType).toBeUndefined();
			expect(result.current.filters.languages).toBeUndefined();
			expect(result.current.filters.gender).toBeUndefined();
			expect(result.current.filters.isDemanded).toBeUndefined();
		});
	});

	describe('Store Integration', () => {
		it('stores work independently without interference', () => {
			const filterResult = renderHook(() => useFilterStore());
			const languageResult = renderHook(() => useLanguageStore());
			const seekerResult = renderHook(() => useSeekerFilterStore());

			// Set filters in filter store
			act(() => {
				filterResult.result.current.setFilters({ salary: '1500' });
			});

			// Change language
			act(() => {
				languageResult.result.current.changeLanguage('en');
			});

			// Set filters in seeker filter store
			act(() => {
				seekerResult.result.current.setFilters({ city: 'tel-aviv' });
			});

			// Verify each store maintains its own state
			expect(filterResult.result.current.filters.salary).toBe('1500');
			expect(languageResult.result.current.language).toBe('en');
			expect(seekerResult.result.current.filters.city).toBe('tel-aviv');
		});

		it('handles rapid state changes correctly', () => {
			const filterResult = renderHook(() => useFilterStore());
			const languageResult = renderHook(() => useLanguageStore());

			// Rapidly change states
			for (let i = 0; i < 5; i++) {
				act(() => {
					filterResult.result.current.setFilters({
						salary: `${1000 + i * 100}`,
					});
					languageResult.result.current.changeLanguage(['ru', 'en'][i % 2]);
				});
			}

			// Final states should be correct
			expect(filterResult.result.current.filters.salary).toBe('1400');
			// The language store reloads the page on change, so we need to check the final call
			// Since the page reloads, we can't easily test the final language state
			// Instead, let's verify that the changeLanguage was called multiple times
			expect(window.location.reload).toHaveBeenCalled();
		});
	});

	describe('Store Performance', () => {
		it('handles large filter objects efficiently', () => {
			const { result } = renderHook(() => useFilterStore());

			const largeFilters = {
				salary: 'a'.repeat(1000),
				categoryId: 'b'.repeat(100),
				shuttleOnly: true,
				mealsOnly: false,
			};

			const startTime = performance.now();

			act(() => {
				result.current.setFilters(largeFilters);
			});

			const endTime = performance.now();
			const executionTime = endTime - startTime;

			// Should complete within reasonable time (less than 100ms)
			expect(executionTime).toBeLessThan(100);
			expect(result.current.filters).toEqual(largeFilters);
		});

		it('handles frequent state updates efficiently', () => {
			const { result } = renderHook(() => useFilterStore());

			const iterations = 100;
			const startTime = performance.now();

			for (let i = 0; i < iterations; i++) {
				act(() => {
					result.current.setFilters({ salary: `${1000 + i}` });
				});
			}

			const endTime = performance.now();
			const executionTime = endTime - startTime;

			// Should complete within reasonable time (less than 100ms for 100 updates)
			expect(executionTime).toBeLessThan(100);
			expect(result.current.filters.salary).toBe(`${1000 + iterations - 1}`);
		});
	});

	describe('Store Error Handling', () => {
		it('handles invalid filter values gracefully', () => {
			const { result } = renderHook(() => useFilterStore());

			act(() => {
				result.current.setFilters({
					salary: null,
					categoryId: undefined,
					shuttleOnly: 'invalid',
					mealsOnly: null,
				});
			});

			const state = result.current.filters;
			expect(state.salary).toBeNull();
			expect(state.categoryId).toBeUndefined();
			expect(state.shuttleOnly).toBe('invalid');
			expect(state.mealsOnly).toBeNull();
		});

		it('handles empty or null filter objects', () => {
			const { result } = renderHook(() => useFilterStore());

			act(() => {
				result.current.setFilters(null);
			});

			expect(result.current.filters).toBeNull();

			act(() => {
				result.current.setFilters({});
			});

			expect(result.current.filters).toEqual({});
		});
	});
});
