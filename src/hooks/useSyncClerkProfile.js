import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import axios from 'axios';

const useSyncClerkProfile = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      axios.patch('/api/users/sync-profile', {
        clerkUserId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        imageUrl: user.imageUrl,
      }).catch(() => {});
    }
  }, [isLoaded, user]);
};

export default useSyncClerkProfile; 