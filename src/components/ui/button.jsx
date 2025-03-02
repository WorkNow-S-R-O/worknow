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
      redirectToSignIn();
    } else {
      navigate('/create-new-advertisement');
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <button
          onClick={handleCreateAdClick}
          className="btn btn-primary btn-l h-16 mt-20 flex items-center justify-center"
        >
          <i className="bi bi-plus-circle-fill me-2"></i>
          {t('button_create_new_advertisement')}
        </button>
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
