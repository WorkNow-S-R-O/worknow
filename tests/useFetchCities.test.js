import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockUseLocale = vi.fn(() => ({ locale: 'ru' }));
const mockApiUrl = 'https://api.example.com';

const loadHook = async () => {
	vi.resetModules();
	vi.doMock('../apps/client/src/hooks/useFetchCities.js', async () => {
		return vi.importActual('../apps/client/src/hooks/useFetchCities.js');
	});
	vi.doMock('@hooks/useFetchCities.js', async () => {
		return vi.importActual('../apps/client/src/hooks/useFetchCities.js');
	});
	vi.doMock('../apps/client/src/hooks/useFetchLocalized.js', async () => {
		return vi.importActual('../apps/client/src/hooks/useFetchLocalized.js');
	});
	vi.doMock('react-intlayer', () => ({
		useLocale: mockUseLocale,
	}));
	vi.stubEnv('VITE_API_URL', mockApiUrl);
	const module = await import('@hooks/useFetchCities.js');
	const hook = module.default ?? module.useFetchCities;
	if (typeof hook !== 'function') {
		throw new Error('useFetchCities export not found');
	}
	return hook;
};

describe('useFetchCities', () => {
	const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	it('fetches and formats city data', async () => {
		const useFetchCities = await loadHook();

		const citiesData = [
			{ id: 1, name: 'Tel Aviv' },
			{ id: 2, name: 'Haifa' },
		];
		global.fetch = vi.fn().mockResolvedValueOnce({
			json: () => Promise.resolve(citiesData),
		});

		const { result } = renderHook(() => useFetchCities());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(global.fetch).toHaveBeenCalledWith(
			`${mockApiUrl}/api/cities?lang=ru`,
		);
		expect(result.current.cities).toEqual([
			{ value: 1, label: 'Tel Aviv' },
			{ value: 2, label: 'Haifa' },
		]);
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('logs error when API returns non-array data', async () => {
		const useFetchCities = await loadHook();

		const invalidData = { invalid: true };
		global.fetch = vi.fn().mockResolvedValueOnce({
			json: () => Promise.resolve(invalidData),
		});

		const { result } = renderHook(() => useFetchCities());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.cities).toEqual([]);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining('API returned non-array'),
			invalidData,
		);
	});

	it('swallows ECONNABORTED errors without logging', async () => {
		const useFetchCities = await loadHook();

		const abortedError = Object.assign(new Error('timeout'), { code: 'ECONNABORTED' });
		global.fetch = vi.fn().mockRejectedValueOnce(abortedError);

		const { result } = renderHook(() => useFetchCities());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.cities).toEqual([]);
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('logs other errors and keeps loading false', async () => {
		const useFetchCities = await loadHook();

		const apiError = new Error('network');
		global.fetch = vi.fn().mockRejectedValueOnce(apiError);

		const { result } = renderHook(() => useFetchCities());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.cities).toEqual([]);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining('Error fetching'),
			apiError,
		);
	});
});
