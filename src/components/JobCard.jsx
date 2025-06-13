import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const JobCard = ({ job }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className={`card shadow-sm mb-4 position-relative ${
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
        <p className="card-text">
          <strong>{t("salary_per_hour_card")}</strong>{" "}
          {job.salary || "Не указано"}
          <br />
          <strong>{t("location_card")}</strong> {job.city?.name || "Не указано"}
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
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    salary: PropTypes.string,
    city: PropTypes.shape({
      name: PropTypes.string,
    }),
    description: PropTypes.string,
    phone: PropTypes.string,
    user: PropTypes.shape({
      clerkUserId: PropTypes.string,
      imageUrl: PropTypes.string,
      isPremium: PropTypes.bool,
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default JobCard;
