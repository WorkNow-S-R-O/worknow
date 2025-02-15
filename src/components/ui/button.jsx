import { useTranslation } from 'react-i18next';
import UserJobs from '../UserJobs';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Button = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { redirectToSignIn } = useClerk();
  const navigate = useNavigate();

  const handleCreateAdClick = () => {
    if (!user) {
      // Если пользователь не авторизован – отправляем на страницу авторизации
      redirectToSignIn();
    } else {
      // Если авторизован – отправляем на создание объявления
      navigate('/create-new-advertisement');
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <button
          onClick={handleCreateAdClick}
          className="btn btn-primary btn-l h-16 mt-20 flex"
        >
          <i className="bi bi-plus-circle-fill me-2"></i>
          {t('button_create_new_advertisement')}
        </button>
      </div>

      <UserJobs />
    </div>
  );
};

export { Button };
