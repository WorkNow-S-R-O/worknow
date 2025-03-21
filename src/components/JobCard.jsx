import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";


const JobCard = ({ job }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    if (job.user?.clerkUserId) {
      navigate(`/profile/${job.user.clerkUserId}`);
    }
  };

  return (
    <div
      className={`card shadow-sm mb-4 position-relative ${
        job.user?.isPremium ? 'border border-warning premium-glow' : ''
      }`}
      style={{
        backgroundColor: 'white',
        width: '90%',
        maxWidth: '700px',
        borderRadius: '10px',
        minHeight: '220px',
        boxShadow: job.user?.isPremium ? '0px 0px 15px 5px rgba(255, 215, 0, 0.7)' : 'none',
      }}
    >
      <div className="card-body">
        <h5 className="card-title text-primary">{job.title}</h5>
        <p className="card-text">
          <strong>{t("salary_per_hour_card")}</strong> {job.salary || 'Не указано'}
          <br />
          <strong>{t("location_card")}</strong> {job.city?.name || 'Не указано'}
        </p>
        <p className="card-text">{job.description || 'Описание отсутствует'}</p>
        <p className="card-text">
          <strong>{t("phone_number_card")}</strong> {job.phone || 'Не указан'}
        </p>
        <div className="card-text text-muted">
          <small>
            {t("created_at")}{' '}
            {job.createdAt
              ? format(new Date(job.createdAt), 'dd MMMM yyyy', { locale: ru })
              : 'Неизвестно'}
          </small>
        </div>
      </div>

      {job.user?.imageUrl && (
        <div
          className="position-absolute top-0 end-0 m-2"
          style={{ width: '45px', height: '45px', cursor: 'pointer' }}
          onClick={handleAvatarClick}
        >
          <img src={job.user.imageUrl} alt="User Avatar" className="rounded-circle w-100 h-100" />
        </div>
      )}
    </div>
  );
};

// **Валидация пропсов**
JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    salary: PropTypes.string,
    city: PropTypes.shape({
      name: PropTypes.string,
    }),
    description: PropTypes.string,
    phone: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      clerkUserId: PropTypes.string,
      imageUrl: PropTypes.string,
      isPremium: PropTypes.bool,
    }),
  }).isRequired,
};

export default JobCard;
