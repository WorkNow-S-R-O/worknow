import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useUserSync = () => {
	const { user: clerkUser } = useUser();
	const [dbUser, setDbUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const syncUser = async (clerkUserId) => {
		try {
			// Syncing user with Clerk
			const response = await axios.post(`${API_URL}/api/users/sync-user`, {
				clerkUserId,
			});
			// User sync response received
			return response.data.user;
		} catch (error) {
			console.error('❌ Error syncing user:', error);
			console.error('❌ Sync error details:', {
				status: error.response?.status,
				data: error.response?.data,
				message: error.message,
			});
			throw error;
		}
	};

	const fetchUserData = async () => {
		if (!clerkUser) {
			// No clerkUser, setting dbUser to null
			setDbUser(null);
			setLoading(false);
			return;
		}

		try {
			// Fetching user data from API
			setLoading(true);
			setError(null);

			// Try to get user from database
			const response = await axios.get(`${API_URL}/api/users/${clerkUser.id}`);
			// User data fetched successfully
			setDbUser(response.data);
		} catch (error) {
			console.error('❌ Error fetching user data:', error);
			console.error('❌ Error details:', {
				status: error.response?.status,
				data: error.response?.data,
				message: error.message,
			});

			if (error.response?.status === 404) {
				// User not found in database, attempting to sync
				// User doesn't exist in database, try to sync them
				try {
					const syncedUser = await syncUser(clerkUser.id);
					// User synced successfully
					setDbUser(syncedUser);
				} catch (syncError) {
					console.error('❌ Error syncing user:', syncError);
					setError('Failed to sync user data');
					setDbUser(null);
				}
			} else {
				console.error('❌ Non-404 error, setting error state');
				setError('Failed to fetch user data');
				setDbUser(null);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
	}, [clerkUser?.id]);

	const refreshUser = () => {
		fetchUserData();
	};

	return {
		dbUser,
		loading,
		error,
		refreshUser,
		syncUser: () => (clerkUser ? syncUser(clerkUser.id) : null),
	};
};
