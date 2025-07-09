import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFetchCities from '../hooks/useFetchCities';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const JobCard = ({ job }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cities, loading } = useFetchCities();

  // Получаем название города на нужном языке
  let cityLabel = null;
  if (job.cityId && Array.isArray(cities)) {
    const city = cities.find(c => c.value === job.cityId || c.id === job.cityId);
    cityLabel = city?.label || city?.name || null;
  }

  return (
    <div 
      className={`card shadow-sm mb-4 position-relative text-start ${
        job.user?.isPremium ? "premium-job" : ""
      }`}
      style={{
        backgroundColor: job.user?.isPremium ? "linear-gradient(90deg, #fffbe6 0%, #fff 100%)" : "white",
        width: "90%",
        maxWidth: "700px",
        borderRadius: "10px",
        minHeight: "220px",
        cursor: job.user?.clerkUserId ? "pointer" : "default",
      }}
      onClick={() => {
        if (job.user?.clerkUserId) {
          navigate(`/profile/${job.user.clerkUserId}`);
        }
      }}
    >
      {/* Плашка Премиум */}
      {job.user?.isPremium && (
        <div className="premium-badge">
          <i className="bi bi-star-fill"></i> Премиум
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title text-primary">{job.title}</h5>
        {job.category?.label && (
          <div className="mb-2">
            <span className="px-2 py-1 text-sm rounded font-semibold bg-primary text-white">{job.category.label}</span>
          </div>
        )}
        <p className="card-text">
          <strong>{t("salary_per_hour_card")}</strong>{" "}
          {job.salary || "Не указано"}
          <br />
          <strong>{t("location_card")}</strong>{" "}
          {loading ? (
            <Skeleton width={80} height={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
          ) : (
            cityLabel || "Не указано"
          )}
        </p>
        <p className="card-text">{job.description || "Описание отсутствует"}</p>
        <div className="card-text">
          {typeof job.shuttle === 'boolean' && (
            <div className="card-text">
              <strong>{t("shuttle") || "Подвозка"}:</strong> {job.shuttle ? t("yes") || "да" : t("no") || "нет"}
            </div>
          )}
          {typeof job.meals === 'boolean' && (
            <div className="card-text">
              <strong>{t("meals") || "Питание"}:</strong> {job.meals ? t("yes") || "да" : t("no") || "нет"}
            </div>
          )}
          <strong>{t("phone_number_card")}</strong> {job.phone || "Не указан"}
        </div>
      </div>
    </div>
  );
};

// **Валидация пропсов**
JobCard.propTypes = {
  job: PropTypes.shape({
    cityId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    city: PropTypes.object,
    title: PropTypes.string,
    salary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    phone: PropTypes.string,
    category: PropTypes.object,
    user: PropTypes.object,
    shuttle: PropTypes.bool,
    meals: PropTypes.bool,
  }).isRequired,
};

export default JobCard;
