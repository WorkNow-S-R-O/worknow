import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFetchCities from '../hooks/useFetchCities';

const JobCard = ({ job }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cities } = useFetchCities();

  // Получаем название города на нужном языке
  let cityLabel = 'Не указано';
  if (job.cityId && Array.isArray(cities)) {
    const city = cities.find(c => c.value === job.cityId || c.id === job.cityId);
    cityLabel = city?.label || city?.name || 'Не указано';
  }

  return (
    <div
      className={`card shadow-sm mb-4 position-relative text-start ${
        job.user?.isPremium ? "border border-warning premium-glow" : ""
      }`}
      style={{
        backgroundColor: "white",
        width: "90%",
        maxWidth: "700px",
        borderRadius: "10px",
        minHeight: "220px",
        boxShadow: job.user?.isPremium
          ? "0px 0px 15px 5px rgba(255, 215, 0, 0.7)"
          : "none",
        cursor: job.user?.clerkUserId ? "pointer" : "default",
      }}
      onClick={() => {
        if (job.user?.clerkUserId) {
          navigate(`/profile/${job.user.clerkUserId}`);
        }
      }}
    >
      <div className="card-body">
        <h5 className="card-title text-primary">{job.title}</h5>
        {job.category?.name && (
          <div className="mb-2">
            <span className="px-2 py-1 text-sm rounded font-semibold bg-primary text-white">{job.category.name}</span>
          </div>
        )}
        <p className="card-text">
          <strong>{t("salary_per_hour_card")}</strong>{" "}
          {job.salary || "Не указано"}
          <br />
          <strong>{t("location_card")}</strong> {cityLabel}
        </p>
        <p className="card-text">{job.description || "Описание отсутствует"}</p>
        <p className="card-text">
          <strong>{t("phone_number_card")}</strong> {job.phone || "Не указан"}
        </p>
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
  }).isRequired,
};

export default JobCard;
