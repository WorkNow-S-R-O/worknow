import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import axios from 'axios';

const useSyncClerkProfile = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      axios.post('/api/users/sync-user', {
        clerkUserId: user.id,
      }).catch((error) => {
        console.error('Ошибка синхронизации профиля:', error);
      });
    }
  }, [isLoaded, user]);
};

export default useSyncClerkProfile; 