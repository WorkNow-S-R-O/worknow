import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';

import {
	mockApiUrl,
	mockJobId,
	mockJobResponse,
	invalidJobResponse,
} from '@mocks/useUpdateJobs.js';

const hookAlias = '@hooks/useUpdateJobs.js';
const hookPath = '../apps/client/src/hooks/useUpdateJobs.js';

const loadHook = async () => {
	vi.resetModules();

	const setValueMock = vi.fn();
	const axiosGetMock = vi.fn();
	const toastErrorMock = vi.fn();
	const navigateMock = vi.fn();
	const startLoadingWithProgress = vi.fn();
	const completeLoading = vi.fn();

	vi.doMock('axios', () => ({
		default: {
			get: axiosGetMock,
		},
	}));

	vi.doMock('react-hot-toast', () => ({
		toast: {
			error: toastErrorMock,
		},
	}));

	vi.doMock('react-router-dom', () => ({
		useNavigate: () => navigateMock,
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
	const useFetchJob =
		module.default || module.useFetchJob || module.useUpdateJobs;

	if (typeof useFetchJob !== 'function') {
		throw new Error('useUpdateJobs hook not found');
	}

	return {
		useFetchJob,
		axiosGet: axiosGetMock,
		setValueMock,
		toastErrorMock,
		navigateMock,
		startLoadingWithProgress,
		completeLoading,
	};
};

describe('useUpdateJobs', () => {
	const mockPaths = [
		'axios',
		'react-hot-toast',
		'react-router-dom',
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

	it('logs an error and skips the request when id is missing', async () => {
		const {
			useFetchJob,
			axiosGet,
			setValueMock,
			completeLoading,
		} = await loadHook();

		renderHook(() => useFetchJob(null, setValueMock));

		expect(axiosGet).not.toHaveBeenCalled();
		expect(setValueMock).not.toHaveBeenCalled();
		expect(completeLoading).not.toHaveBeenCalled();
	});

	it('fetches job data and populates the form fields', async () => {
		const {
			useFetchJob,
			axiosGet,
			setValueMock,
			completeLoading,
			startLoadingWithProgress,
		} = await loadHook();

		axiosGet.mockResolvedValueOnce({ data: mockJobResponse });

		const { result } = renderHook(() => useFetchJob(mockJobId, setValueMock));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.job).toEqual(mockJobResponse);
		expect(setValueMock).toHaveBeenCalledWith('title', mockJobResponse.title);
		expect(setValueMock).toHaveBeenCalledWith('salary', mockJobResponse.salary);
		expect(setValueMock).toHaveBeenCalledWith(
			'cityId',
			mockJobResponse.city.id,
		);
		expect(setValueMock).toHaveBeenCalledWith(
			'categoryId',
			mockJobResponse.category.id,
		);
		expect(setValueMock).toHaveBeenCalledWith('phone', mockJobResponse.phone);
		expect(setValueMock).toHaveBeenCalledWith(
			'description',
			mockJobResponse.description,
		);
		expect(setValueMock).toHaveBeenCalledWith('shuttle', mockJobResponse.shuttle);
		expect(setValueMock).toHaveBeenCalledWith('meals', mockJobResponse.meals);
		expect(setValueMock).toHaveBeenCalledWith('imageUrl', mockJobResponse.imageUrl);
		expect(startLoadingWithProgress).not.toHaveBeenCalled();
		expect(completeLoading).toHaveBeenCalled();
	});

	it('handles invalid API responses by notifying the user and navigating home', async () => {
		const {
			useFetchJob,
			axiosGet,
			setValueMock,
			toastErrorMock,
			navigateMock,
		} = await loadHook();

		axiosGet.mockResolvedValueOnce({ data: invalidJobResponse });

		renderHook(() => useFetchJob(mockJobId, setValueMock));

		await waitFor(() => {
			expect(toastErrorMock).toHaveBeenCalledWith('Ошибка загрузки объявления');
		});

		expect(navigateMock).toHaveBeenCalledWith('/');
		expect(setValueMock).not.toHaveBeenCalled();
	});

	it('handles request failures by showing a toast and navigating home', async () => {
		const {
			useFetchJob,
			axiosGet,
			setValueMock,
			toastErrorMock,
			navigateMock,
		} = await loadHook();

		axiosGet.mockRejectedValueOnce(new Error('Network error'));

		renderHook(() => useFetchJob(mockJobId, setValueMock));

		await waitFor(() => {
			expect(toastErrorMock).toHaveBeenCalledWith('Ошибка загрузки объявления');
		});

		expect(navigateMock).toHaveBeenCalledWith('/');
		expect(setValueMock).not.toHaveBeenCalled();
	});

	it('starts the loading progress indicator when the request takes longer than 500ms', async () => {
		const {
			useFetchJob,
			axiosGet,
			setValueMock,
			startLoadingWithProgress,
		} = await loadHook();

		vi.useFakeTimers();

		let resolveRequest;
		const requestPromise = new Promise((resolve) => {
			resolveRequest = resolve;
		});

		axiosGet.mockReturnValueOnce(requestPromise);

		const { result } = renderHook(() => useFetchJob(mockJobId, setValueMock));

		act(() => {
			vi.advanceTimersByTime(600);
		});

		expect(startLoadingWithProgress).toHaveBeenCalledWith(1200);

		vi.useRealTimers();

		await act(async () => {
			resolveRequest({ data: mockJobResponse });
			await requestPromise;
		});

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
	});
});
