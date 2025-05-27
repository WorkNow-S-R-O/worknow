import PropTypes from "prop-types";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const JobCard = ({ job, currentUserName, currentUserImageUrl }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);

  const handleAvatarClick = () => {
    if (job.user?.clerkUserId) {
      navigate(`/profile/${job.user.clerkUserId}`);
    }
  };

  // Добавляем timestamp к URL изображения
  const getImageUrl = (url) => {
    if (!url) return "/images/default-avatar.png";
    const timestamp = new Date().getTime();
    return `${url}?t=${timestamp}`;
  };

  // Используем актуальные данные, если они переданы
  const avatarUrl = currentUserImageUrl || job.user?.imageUrl;
  const displayName = currentUserName || job.user?.name;

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

      {avatarUrl && (
        <div
          className="position-absolute top-0 end-0 m-2 d-flex justify-content-center align-items-center"
          style={{
            width: "45px",
            height: "45px",
            cursor: "pointer",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "#f0f0f0",
          }}
          onClick={handleAvatarClick}
        >
          {imageLoading && (
            <Spinner animation="border" variant="primary" size="sm" />
          )}
          <img
            src={getImageUrl(avatarUrl)}
            alt="User Avatar"
            className="rounded-circle w-100 h-100"
            style={{ display: imageLoading ? "none" : "block" }}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              setImageLoading(false);
              e.target.src = "/images/default-avatar.png";
            }}
          />
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
    user: PropTypes.shape({
      clerkUserId: PropTypes.string,
      imageUrl: PropTypes.string,
      isPremium: PropTypes.bool,
      name: PropTypes.string,
    }),
  }).isRequired,
  currentUserName: PropTypes.string,
  currentUserImageUrl: PropTypes.string,
};

export default JobCard;
