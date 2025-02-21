import { useTranslation } from 'react-i18next';
import UserJobs from '../UserJobs';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner'; // Импортируем спиннер Shadcn

const Button = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { redirectToSignIn } = useClerk();
  const navigate = useNavigate();
  const [hasJobs, setHasJobs] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false); // Останавливаем загрузку, если пользователь не авторизован
      return;
    }

    const fetchUserJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/user-jobs/${user.id}?limit=1`);
        setHasJobs(response.data.jobs.length > 0);
      } catch (error) {
        console.error('Ошибка загрузки объявлений пользователя:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, [user]);

  const handleCreateAdClick = () => {
    if (!user) {
      redirectToSignIn();
    } else {
      navigate('/create-new-advertisement');
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        {loading ? (
          <Spinner size="sm" className="bg-black dark:bg-white mx-auto mt-20" />
        ) : (
          <button
            onClick={handleCreateAdClick}
            className="btn btn-primary btn-l h-16 mt-20 flex items-center justify-center"
          >
            <i className="bi bi-plus-circle-fill me-2"></i>
            {hasJobs ? t('button_create_new_advertisement') : t('button_create_first_advertisement')}
          </button>
        )}
      </div>

      {user ? (
        <UserJobs />
      ) : (
        <div className="text-center mt-6 fs-4">
          {t('message_login_to_view_ads')}
        </div>
      )}
    </div>
  );
};

export { Button };
