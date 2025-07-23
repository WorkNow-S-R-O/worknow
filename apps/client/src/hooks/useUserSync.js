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
      const response = await axios.post(`${API_URL}/api/users/sync-user`, { clerkUserId });
      return response.data.user;
    } catch (error) {
      console.error('Error syncing user:', error);
      throw error;
    }
  };

  const fetchUserData = async () => {
    if (!clerkUser) {
      setDbUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to get user from database
      const response = await axios.get(`${API_URL}/api/users/${clerkUser.id}`);
      setDbUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      if (error.response?.status === 404) {
        // User doesn't exist in database, try to sync them
        try {
          const syncedUser = await syncUser(clerkUser.id);
          setDbUser(syncedUser);
        } catch (syncError) {
          console.error('Error syncing user:', syncError);
          setError('Failed to sync user data');
          setDbUser(null);
        }
      } else {
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
    syncUser: () => clerkUser ? syncUser(clerkUser.id) : null
  };
}; 