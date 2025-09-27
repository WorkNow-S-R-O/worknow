import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';

const hookAlias = '@hooks/useSeekers.js';
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
		useLocale: () => ({ locale: 'he' }),
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
	const useSeekers = module.default ?? module.useSeekers;
	if (typeof useSeekers !== 'function') {
		throw new Error('useSeekers export not found');
	}

	const axiosModule = await import('axios');

	return {
		useSeekers,
		axiosGet: axiosModule.default.get,
		startLoadingWithProgress,
		completeLoading,
	};
};

describe('useSeekers', () => {
	const mockPaths = [
		'axios',
		'react-intlayer',
		'../apps/client/src/hooks/useLoadingProgress.js',
		'@hooks/useLoadingProgress.js',
		hookAlias,
	];

	const consoleErrorSpy = vi
		.spyOn(console, 'error')
		.mockImplementation(() => {});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		mockPaths.forEach((path) => {
			try {
				vi.doUnmock(path);
			} catch {}
		});
		vi.unstubAllEnvs();
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	it('fetches seekers with filters and pagination', async () => {
		const { useSeekers, axiosGet, completeLoading } = await loadHook();

		const responseData = {
			seekers: [{ id: 's1' }],
			pagination: { page: 3, pages: 7 },
		};

		vi.mocked(axiosGet).mockResolvedValueOnce({ data: responseData });

		const filters = {
			city: 'TLV',
			category: 'finance',
			employment: 'full',
			documentType: 'passport',
			gender: 'male',
			isDemanded: true,
			languages: ['ru', 'en'],
		};

		const { result } = renderHook(() => useSeekers(3, filters));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

	expect(axiosGet).toHaveBeenCalledTimes(1);
	const requestUrl = new URL(axiosGet.mock.calls[0][0]);
	expect(`${requestUrl.origin}${requestUrl.pathname}`).toBe(
		`${mockApiUrl}/api/seekers`,
	);
	expect(requestUrl.searchParams.get('lang')).toBe('he');
	expect(requestUrl.searchParams.get('page')).toBe('3');
	expect(requestUrl.searchParams.get('limit')).toBe('10');
	expect(requestUrl.searchParams.get('city')).toBe('TLV');
	expect(requestUrl.searchParams.get('category')).toBe('finance');
	expect(requestUrl.searchParams.get('employment')).toBe('full');
	expect(requestUrl.searchParams.get('documentType')).toBe('passport');
	expect(requestUrl.searchParams.get('gender')).toBe('male');
	expect(requestUrl.searchParams.get('isDemanded')).toBe('true');
	expect(requestUrl.searchParams.getAll('languages')).toEqual(['ru', 'en']);
		expect(result.current.seekers).toEqual(responseData.seekers);
		expect(result.current.pagination).toEqual(responseData.pagination);
		expect(result.current.error).toBeNull();
		expect(completeLoading).toHaveBeenCalled();
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});

	it('supports legacy array responses', async () => {
		const { useSeekers, axiosGet } = await loadHook();
		const legacyData = [{ id: 'legacy' }];
		vi.mocked(axiosGet).mockResolvedValueOnce({ data: legacyData });

		const { result } = renderHook(() => useSeekers());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.seekers).toEqual(legacyData);
		expect(result.current.pagination).toBeNull();
		expect(result.current.error).toBeNull();
	});

	it('logs unexpected formats and clears seekers', async () => {
		const { useSeekers, axiosGet, completeLoading } = await loadHook();
		vi.mocked(axiosGet).mockResolvedValueOnce({ data: { invalid: true } });

		const { result } = renderHook(() => useSeekers());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.seekers).toEqual([]);
		expect(result.current.pagination).toBeNull();
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'❌ API вернул неожиданный формат:',
			{ invalid: true },
		);
		expect(completeLoading).toHaveBeenCalled();
	});

	it('captures non-ECONN errors', async () => {
		const { useSeekers, axiosGet } = await loadHook();
		const apiError = new Error('network');
		vi.mocked(axiosGet).mockRejectedValueOnce(apiError);

		const { result } = renderHook(() => useSeekers());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.seekers).toEqual([]);
		expect(result.current.error).toBe('Ошибка загрузки соискателей');
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'❌ Ошибка загрузки соискателей:',
			apiError,
		);
	});

	it('swallows ECONNABORTED errors without setting error', async () => {
		const { useSeekers, axiosGet } = await loadHook();
		const abortedError = Object.assign(new Error('timeout'), {
			code: 'ECONNABORTED',
		});
		vi.mocked(axiosGet).mockRejectedValueOnce(abortedError);

		const { result } = renderHook(() => useSeekers());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.seekers).toEqual([]);
		expect(result.current.error).toBeNull();
		expect(consoleErrorSpy).not.toHaveBeenCalled();
	});
});
