import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const hookAlias = '@hooks/useJobs.js';
const hookPath = '../apps/client/src/hooks/useJobs.js';
const mockApiUrl = 'https://api.example.com';

const loadHook = async () => {
	vi.resetModules();

	const startLoadingWithProgress = vi.fn();
	const completeLoading = vi.fn();

	vi.doMock('axios', () => ({
		default: {
			get: vi.fn(),
		},
	}));

	vi.doMock('react-intlayer', () => ({
		useLocale: () => ({ locale: 'en' }),
	}));

	vi.doMock('../apps/client/src/hooks/useLoadingProgress.js', () => ({
		useLoadingProgress: () => ({
			startLoadingWithProgress,
			completeLoading,
		}),
	}));

	vi.doMock('@hooks/useLoadingProgress.js', () => ({
		useLoadingProgress: () => ({
			startLoadingWithProgress,
			completeLoading,
		}),
	}));

	vi.stubEnv('VITE_API_URL', mockApiUrl);

	const module = await import(hookAlias);
	const useJobs = module.default ?? module.useJobs;
	if (typeof useJobs !== 'function') {
		throw new Error('useJobs export not found');
	}

	const axiosModule = await import('axios');

	return {
		useJobs,
		axiosGet: axiosModule.default.get,
		startLoadingWithProgress,
		completeLoading,
	};
};

describe('useJobs', () => {
	const mockPaths = [
		'axios',
		'react-intlayer',
		'../apps/client/src/hooks/useLoadingProgress.js',
		hookPath,
		hookAlias,
		'@hooks/useLoadingProgress.js',
	];

	const consoleErrorSpy = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		mockPaths.forEach((path) => {
			try {
				vi.doUnmock(path);
			} catch {}
		});
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	it('fetches jobs with pagination and builds correct query string', async () => {
		const {
			useJobs,
			axiosGet,
			startLoadingWithProgress,
			completeLoading,
		} = await loadHook();

		const mockResponse = {
			data: {
				jobs: [{ id: 1 }, { id: 2 }],
				pagination: { page: 2, pages: 5 },
			},
		};
		vi.mocked(axiosGet).mockResolvedValueOnce(mockResponse);

		const filters = {
			salary: '6000',
			categoryId: '3',
			shuttleOnly: true,
			mealsOnly: true,
			city: 'TLV',
		};

		const { result } = renderHook(() => useJobs(2, filters));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const requestUrl = axiosGet.mock.calls[0][0];
		expect(requestUrl).toBe(
			`${mockApiUrl}/api/jobs?lang=en&page=2&limit=10&salary=6000&category=3&shuttle=true&meals=true&city=TLV`,
		);
		expect(result.current.jobs).toEqual(mockResponse.data.jobs);
		expect(result.current.pagination).toEqual(mockResponse.data.pagination);
		expect(startLoadingWithProgress).not.toHaveBeenCalled();
		expect(completeLoading).toHaveBeenCalledTimes(1);
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('handles legacy array response format', async () => {
		const { useJobs, axiosGet } = await loadHook();

		const legacyData = [{ id: 10 }, { id: 11 }];
		vi.mocked(axiosGet).mockResolvedValueOnce({ data: legacyData });

		const { result } = renderHook(() => useJobs(1, {}));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.jobs).toEqual(legacyData);
		expect(result.current.pagination).toBeNull();
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('logs error and returns empty jobs on failure', async () => {
		const { useJobs, axiosGet, completeLoading } = await loadHook();

		const apiError = new Error('network');
		vi.mocked(axiosGet).mockRejectedValueOnce(apiError);

		const { result } = renderHook(() => useJobs(1, {}));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.jobs).toEqual([]);
		expect(result.current.pagination).toBeNull();
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'❌ Ошибка загрузки вакансий:',
			apiError,
		);
		expect(completeLoading).toHaveBeenCalled();
	});

	it('suppresses ECONNABORTED errors', async () => {
		const { useJobs, axiosGet, completeLoading } = await loadHook();

		const abortedError = Object.assign(new Error('timeout'), {
			code: 'ECONNABORTED',
		});
		vi.mocked(axiosGet).mockRejectedValueOnce(abortedError);

		const { result } = renderHook(() => useJobs(1, {}));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.jobs).toEqual([]);
		expect(result.current.pagination).toBeNull();
		expect(consoleErrorSpy).not.toHaveBeenCalled();
		expect(completeLoading).toHaveBeenCalled();
	});
});
