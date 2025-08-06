import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import useFetchCities from '../hooks/useFetchCities';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ImageModal } from './ui';

const JobCard = ({ job }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cities, loading } = useFetchCities();
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Получаем название города на нужном языке
  let cityLabel = null;
  if (job.cityId && Array.isArray(cities)) {
    const city = cities.find(c => c.value === job.cityId || c.id === job.cityId);
    cityLabel = city?.label || city?.name || null;
  }

  const handleImageClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking image
    setShowImageModal(true);
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    console.log('✅ JobCard - Mini image loaded successfully:', job.imageUrl);
  };

  const handleImageError = (e) => {
    setImageLoading(false);
    console.error('❌ JobCard - Mini image failed to load:', job.imageUrl, e);
  };

  return (
    <>
      <div 
        className={`card shadow-sm mb-4 position-relative text-start ${
          job.user?.isPremium ? "premium-job" : ""
        }`}
        style={{
          backgroundColor: job.user?.isPremium ? "#D4E6F9" : "white",
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
            <i className="bi bi-star-fill"></i> {t('premium_badge')}
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
          
          {/* Image displayed under phone number in mini size */}
          {job.imageUrl && (
            <div className="mt-3">
              {console.log('🔍 JobCard - Rendering image for job:', job.id, 'URL:', job.imageUrl)}
              {imageLoading && (
                <Skeleton 
                  width={120} 
                  height={80} 
                  style={{
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0'
                  }}
                />
              )}
              <img 
                src={job.imageUrl} 
                alt={job.title}
                className="img-fluid rounded"
                style={{
                  width: '120px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  display: imageLoading ? 'none' : 'block'
                }}
                onClick={handleImageClick}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          )}
        </div>
      </div>

      {/* Image Modal - Only render if there's an image URL */}
      {job.imageUrl && (
        <ImageModal 
          show={showImageModal} 
          onHide={handleCloseModal}
          imageUrl={job.imageUrl}
          imageAlt={job.title}
          onImageError={(e) => console.error('❌ JobCard - Modal image failed to load:', job.imageUrl, e)}
        />
      )}
    </>
  );
};

// **Валидация пропсов**
JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
    imageUrl: PropTypes.string,
  }).isRequired,
};

export default JobCard;
