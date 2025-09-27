import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const hookPath = '../apps/client/src/hooks/useLoadingProgress.js';
const aliasPath = '@hooks/useLoadingProgress.js';

const mockPaths = [
	'@/contexts',
	'@/contexts/index.js',
	hookPath,
	aliasPath,
	'../apps/client/src/contexts/index.js',
];

const setupHook = async () => {
	const startLoading = vi.fn();
	const stopLoading = vi.fn();
	const updateProgress = vi.fn();

	vi.doUnmock(hookPath);
	vi.doUnmock(aliasPath);
	vi.doMock('@/contexts', () => ({
		useLoading: () => ({ startLoading, stopLoading, updateProgress }),
	}));
	vi.doMock('@/contexts/index.js', () => ({
		useLoading: () => ({ startLoading, stopLoading, updateProgress }),
	}));
	vi.doMock('../apps/client/src/contexts/index.js', () => ({
		useLoading: () => ({ startLoading, stopLoading, updateProgress }),
	}));

	const module = await import(aliasPath);
	const useLoadingProgress = module.useLoadingProgress ?? module.default;
	if (typeof useLoadingProgress !== 'function') {
		throw new Error('useLoadingProgress export not found');
	}

	return { useLoadingProgress, startLoading, stopLoading, updateProgress };
};

describe('useLoadingProgress', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		mockPaths.forEach((path) => vi.doUnmock(path));
		vi.clearAllMocks();
	});

	it('starts loading and updates progress over time', async () => {
		const { useLoadingProgress, startLoading, updateProgress } = await setupHook();
		const { result } = renderHook(() => useLoadingProgress());

		act(() => {
			result.current.startLoadingWithProgress(100);
		});

		expect(startLoading).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(150);
		expect(updateProgress).toHaveBeenCalled();
		expect(updateProgress).toHaveBeenLastCalledWith(95);
	});

	it('completes loading and stops after a short delay', async () => {
		const { useLoadingProgress, updateProgress, stopLoading } = await setupHook();
		const { result } = renderHook(() => useLoadingProgress());

		act(() => {
			result.current.completeLoading();
		});

		expect(updateProgress).toHaveBeenCalledWith(100);

		vi.advanceTimersByTime(199);
		expect(stopLoading).not.toHaveBeenCalled();

		vi.advanceTimersByTime(1);
		expect(stopLoading).toHaveBeenCalledTimes(1);
	});

	it('stops loading immediately and exposes updateProgress reference', async () => {
		const { useLoadingProgress, updateProgress, stopLoading } = await setupHook();
		const { result } = renderHook(() => useLoadingProgress());

		expect(result.current.updateProgress).toBe(updateProgress);

		act(() => {
			result.current.stopLoadingImmediately();
		});

		expect(stopLoading).toHaveBeenCalledTimes(1);
	});

	it('clears any running interval on unmount', async () => {
		const { useLoadingProgress } = await setupHook();
		const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

		const { result, unmount } = renderHook(() => useLoadingProgress());

		act(() => {
			result.current.startLoadingWithProgress(500);
		});

		unmount();
		expect(clearIntervalSpy).toHaveBeenCalled();
		clearIntervalSpy.mockRestore();
	});
});
