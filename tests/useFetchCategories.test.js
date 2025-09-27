import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockUseLocale = vi.fn(() => ({ locale: 'en' }));
const mockApiUrl = 'https://api.example.com';

const loadHook = async () => {
	vi.resetModules();
	vi.doMock('../apps/client/src/hooks/useFetchCategories.js', async () => {
		return vi.importActual('../apps/client/src/hooks/useFetchCategories.js');
	});
	vi.doMock('@hooks/useFetchCategories.js', async () => {
		return vi.importActual('../apps/client/src/hooks/useFetchCategories.js');
	});
	vi.doMock('react-intlayer', () => ({
		useLocale: mockUseLocale,
	}));
	vi.stubEnv('VITE_API_URL', mockApiUrl);
	const module = await import('@hooks/useFetchCategories.js');
	const hook = module.default ?? module.useFetchCategories;
	if (typeof hook !== 'function') {
		throw new Error('useFetchCategories export not found');
	}
	return hook;
};

describe('useFetchCategories', () => {
	const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

	beforeEach(() => {
		vi.clearAllMocks();
		if (!global.fetch || !('mockResolvedValueOnce' in global.fetch)) {
			global.fetch = vi.fn();
		}
		vi.mocked(global.fetch).mockReset();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	it('fetches and formats category data', async () => {
		const useFetchCategories = await loadHook();

		const mockResponseData = [
			{ id: 1, label: 'IT' },
			{ id: 2, name: 'Marketing' },
		];

		vi.mocked(global.fetch).mockResolvedValueOnce({
			json: () => Promise.resolve(mockResponseData),
		});

		const { result } = renderHook(() => useFetchCategories());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(global.fetch).toHaveBeenCalledWith(
			`${mockApiUrl}/api/categories?lang=en`,
		);
		expect(result.current.categories).toEqual([
			{ value: 1, label: 'IT' },
			{ value: 2, label: 'Marketing' },
		]);
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('handles fetch errors gracefully', async () => {
		const useFetchCategories = await loadHook();

		const fetchError = new Error('network');
		vi.mocked(global.fetch).mockRejectedValueOnce(fetchError);

		const { result } = renderHook(() => useFetchCategories());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.categories).toEqual([]);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Error fetching categories:',
			fetchError,
		);
	});
});
