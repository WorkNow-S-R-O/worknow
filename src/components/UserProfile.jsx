import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import { ru } from 'date-fns/locale';
import { useTranslation } from "react-i18next";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loading-skeleton/dist/skeleton.css';

const API_URL = import.meta.env.VITE_API_URL;

const UserProfile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 5;
  const { clerkUserId } = useParams();

  const fetchJobs = async (page) => {
    try {
      const response = await axios.get(
        `${API_URL}/users/user-jobs/${clerkUserId}?page=${page}&limit=${jobsPerPage}`
      );
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Ошибка загрузки объявлений:', error);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userResponse = await axios.get(`${API_URL}/users/${clerkUserId}`);

        if (!userResponse.data || !userResponse.data.firstName) {
          console.warn("⚠️ Пользователь не найден или данные профиля пустые!");
          setUser(null);
        } else {
          setUser(userResponse.data);
        }

        await fetchJobs(currentPage);
      } catch (error) {
        console.error("❌ Ошибка загрузки данных профиля:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [clerkUserId, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
  };

  // 🔹 Динамические заголовок и описание для SEO
  const pageTitle = user
    ? `${user.firstName} ${user.lastName || ""} | ${t("user_profile_title")} - WorkNow`
    : `${t("user_not_found")} | WorkNow`;

  const pageDescription = user
    ? `${t("profile_description", { name: user.firstName })}. ${t("user_jobs")}: ${jobs.length}.`
    : t("user_profile_not_found_description");

  const profileImage = user?.imageUrl || "/images/default-avatar.png";
  const profileUrl = `https://worknowjob.com/user/${clerkUserId}`;

  return (
    <>
      {/* 🔹 SEO-оптимизация */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={profileUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content={profileImage} />
        <meta name="robots" content="index, follow" />

        {/* 🔹 Schema.org разметка (Person + JobPosting) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": user ? `${user.firstName} ${user.lastName || ""}` : "Пользователь",
            "image": profileImage,
            "url": profileUrl,
            "email": user?.email || "Не указано",
            "jobTitle": "Работодатель",
            "worksFor": {
              "@type": "Organization",
              "name": "WorkNow",
              "sameAs": "https://worknowjob.com"
            },
            "hasOfferCatalog": jobs.map((job) => ({
              "@type": "JobPosting",
              "title": job.title,
              "description": job.description,
              "datePosted": job.createdAt,
              "hiringOrganization": {
                "@type": "Organization",
                "name": "WorkNow",
                "sameAs": "https://worknowjob.com"
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": job.city?.name || "Не указано",
                  "addressCountry": "IL"
                }
              }
            }))
          })}
        </script>
      </Helmet>

      <Navbar />
      <div className="container mt-20 d-flex flex-column align-items-center text-center">
        {loading ? (
          <SkeletonLoader jobsPerPage={jobsPerPage} />
        ) : !user ? (
          <p>{t("user_not_found")}</p>
        ) : (
          <>
            <UserHeader user={user} />
            <h4 className="text-primary">{t("user_jobs")}</h4>
            {jobs.length === 0 ? (
              <p>{t("user_no_jobs")}</p>
            ) : (
              <>
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
                <Pagination className="justify-content-center">
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

// Компонент заглушки (скелетон)
const SkeletonLoader = ({ jobsPerPage }) => (
  <>
    <div className="d-flex flex-column align-items-center mb-4">
      <Skeleton circle height={100} width={100} className="mb-3" />
      <div>
        <Skeleton width={200} height={24} />
        <Skeleton width={150} height={18} className="mt-2" />
      </div>
    </div>
    <h4>
      <Skeleton width={200} height={24} />
    </h4>
    {Array.from({ length: jobsPerPage }).map((_, index) => (
      <div key={index} className="card mb-3 w-75 text-start" style={{ maxWidth: '700px' }}>
        <div className="card-body">
          <Skeleton height={24} width="50%" />
          <Skeleton height={18} width="90%" className="mt-2" />
          <Skeleton height={18} width="60%" className="mt-2" />
          <Skeleton height={15} width="100%" className="mt-3" />
          <Skeleton height={15} width="100%" />
          <Skeleton height={15} width="80%" />
        </div>
      </div>
    ))}
  </>
);

SkeletonLoader.propTypes = {
  jobsPerPage: PropTypes.number.isRequired,
};

// Компонент заголовка профиля
const UserHeader = ({ user, loading }) => (
  <div className="d-flex flex-column align-items-center mb-4">
    {loading ? (
      <div
        className="d-flex justify-content-center align-items-center mb-3"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
        }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    ) : (
      <img
        src={user.imageUrl || "/images/default-avatar.png"}
        alt="User Avatar"
        className="rounded-circle mb-3"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
    )}
    <div>
      <h2>{user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Анонимный пользователь"}</h2>
      <p className="text-muted">{user.email || "Email не указан"}</p>
    </div>
  </div>
);


UserHeader.propTypes = {
  user: PropTypes.shape({
    imageUrl: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
};

// Компонент карточки вакансии
const JobCard = ({ job }) => {
  const { t } = useTranslation(); // Вызов внутри компонента

  return (
    <div
      className={`card shadow-sm mb-4 position-relative w-75 text-start ${
        job.user?.isPremium ? 'border border-warning premium-glow' : ''
      }`}
      style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        maxWidth: '700px',
        minHeight: '220px',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: job.user?.isPremium
          ? '0px 0px 15px 5px rgba(255, 215, 0, 0.7)'
          : 'none',
      }}
    >
      <div className="card-body">
        <h5 className="card-title text-primary">{job.title}</h5>
        <p className="card-text">
          <strong>{t("salary_per_hour_card")}</strong> {job.salary}
          <br />
          <strong>{t("location_card")}</strong> {job.city.name}
        </p>
        <p className="card-text">{job.description}</p>
        <p className="card-text">
          <strong>{t("phone_number_card")}</strong> {job.phone}
        </p>
        <div className="card-text text-muted">
          <small>
            {t("created_at")}: {format(new Date(job.createdAt), 'dd MMMM yyyy', { locale: ru })}
          </small>
        </div>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    salary: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    city: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      isPremium: PropTypes.bool,
    }),
  }).isRequired,
};

export default UserProfile;
