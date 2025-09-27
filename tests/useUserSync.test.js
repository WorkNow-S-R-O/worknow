import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';

import {
	mockApiUrl,
	mockClerkUser,
	mockDbUser,
	mockSyncedUser,
} from '@mocks/useUserSync.js';

const hookAlias = '@hooks/useUserSync.js';
const hookPath = '../apps/client/src/hooks/useUserSync.js';

const loadHook = async (clerkUser = mockClerkUser) => {
	vi.resetModules();

	const axiosGetMock = vi.fn();
	const axiosPostMock = vi.fn();

	vi.doMock('axios', () => ({
		default: {
			get: axiosGetMock,
			post: axiosPostMock,
		},
	}));

	vi.doMock('@clerk/clerk-react', () => ({
		useUser: () => ({ user: clerkUser }),
	}));

	vi.stubEnv('VITE_API_URL', mockApiUrl);

	const module = await import(hookAlias);
	const useUserSync = module.useUserSync || module.default;

	if (typeof useUserSync !== 'function') {
		throw new Error('useUserSync hook not found');
	}

	return {
		useUserSync,
		axiosGet: axiosGetMock,
		axiosPost: axiosPostMock,
	};
};

describe('useUserSync', () => {
	const mockPaths = [
		'axios',
		'@clerk/clerk-react',
		hookPath,
		hookAlias,
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

	it('returns a null database user when there is no Clerk user', async () => {
		const { useUserSync, axiosGet } = await loadHook(null);

		const { result } = renderHook(() => useUserSync());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.dbUser).toBeNull();
		expect(result.current.error).toBeNull();
		expect(axiosGet).not.toHaveBeenCalled();
	});

	it('fetches user data when Clerk user exists', async () => {
		const { useUserSync, axiosGet } = await loadHook();
		axiosGet.mockResolvedValueOnce({ data: mockDbUser });

		const { result } = renderHook(() => useUserSync());

		await waitFor(() => {
			expect(result.current.dbUser).toEqual(mockDbUser);
		});

		expect(result.current.error).toBeNull();
		expect(result.current.loading).toBe(false);
		expect(axiosGet).toHaveBeenCalledWith(
			`${mockApiUrl}/api/users/${mockClerkUser.id}`,
		);
	});

	it('attempts to sync the user when the API returns 404', async () => {
		const { useUserSync, axiosGet, axiosPost } = await loadHook();
		const notFoundError = Object.assign(new Error('Not found'), {
			response: { status: 404 },
		});

		axiosGet.mockRejectedValueOnce(notFoundError);
		axiosPost.mockResolvedValueOnce({ data: { user: mockSyncedUser } });

		const { result } = renderHook(() => useUserSync());

		await waitFor(() => {
			expect(result.current.dbUser).toEqual(mockSyncedUser);
		});

		expect(result.current.error).toBeNull();
		expect(axiosPost).toHaveBeenCalledWith(
			`${mockApiUrl}/api/users/sync-user`,
			{ clerkUserId: mockClerkUser.id },
		);
	});

	it('sets an error state when syncing the user fails', async () => {
		const { useUserSync, axiosGet, axiosPost } = await loadHook();
		const notFoundError = Object.assign(new Error('Not found'), {
			response: { status: 404 },
		});

		axiosGet.mockRejectedValueOnce(notFoundError);
		axiosPost.mockRejectedValueOnce(new Error('Sync failed'));

		const { result } = renderHook(() => useUserSync());

		await waitFor(() => {
			expect(result.current.error).toBe('Failed to sync user data');
		});

		expect(result.current.dbUser).toBeNull();
	});

	it('reports non-404 errors and clears the cached user', async () => {
		const { useUserSync, axiosGet } = await loadHook();
		const serverError = Object.assign(new Error('Server error'), {
			response: { status: 500 },
		});

		axiosGet.mockRejectedValueOnce(serverError);

		const { result } = renderHook(() => useUserSync());

		await waitFor(() => {
			expect(result.current.error).toBe('Failed to fetch user data');
		});

		expect(result.current.dbUser).toBeNull();
	});

	it('exposes a syncUser helper that syncs the current Clerk user', async () => {
		const { useUserSync, axiosGet, axiosPost } = await loadHook();
		axiosGet.mockResolvedValueOnce({ data: mockDbUser });
		axiosPost.mockResolvedValueOnce({ data: { user: mockSyncedUser } });

		const { result } = renderHook(() => useUserSync());

		await waitFor(() => {
			expect(result.current.dbUser).toEqual(mockDbUser);
		});

		await act(async () => {
			const syncedUser = await result.current.syncUser();
			expect(syncedUser).toEqual(mockSyncedUser);
		});

		expect(axiosPost).toHaveBeenCalledWith(
			`${mockApiUrl}/api/users/sync-user`,
			{ clerkUserId: mockClerkUser.id },
		);
	});

	it('returns null from syncUser when there is no Clerk user', async () => {
		const { useUserSync, axiosPost } = await loadHook(null);

		const { result } = renderHook(() => useUserSync());

		expect(result.current.syncUser()).toBeNull();
		expect(axiosPost).not.toHaveBeenCalled();
	});

	it('refreshUser refetches data from the API', async () => {
		const { useUserSync, axiosGet } = await loadHook();
		const refreshedUser = { id: 'db_user_02', email: 'refresh@example.com' };

		axiosGet.mockResolvedValueOnce({ data: mockDbUser });
		axiosGet.mockResolvedValueOnce({ data: refreshedUser });

		const { result } = renderHook(() => useUserSync());

		await waitFor(() => {
			expect(result.current.dbUser).toEqual(mockDbUser);
		});

		await act(async () => {
			result.current.refreshUser();
		});

		await waitFor(() => {
			expect(result.current.dbUser).toEqual(refreshedUser);
		});
	});

	it('propagates errors from the syncUser helper', async () => {
		const { useUserSync, axiosGet, axiosPost } = await loadHook();
		axiosGet.mockResolvedValueOnce({ data: mockDbUser });
		axiosPost.mockRejectedValueOnce(new Error('Sync failed'));

		const { result } = renderHook(() => useUserSync());

		await waitFor(() => {
			expect(result.current.dbUser).toEqual(mockDbUser);
		});

		await expect(result.current.syncUser()).rejects.toThrow('Sync failed');
	});
});
