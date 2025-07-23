import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { Pagination, Modal, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Trash, PencilSquare, SortUp } from "react-bootstrap-icons";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import "react-loading-skeleton/dist/skeleton.css";
import useLanguageStore from '../store/languageStore';

const API_URL = import.meta.env.VITE_API_URL; // Берем API из .env

const UserJobs = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();
  const language = useLanguageStore((state) => state.language) || 'ru';

  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const fetchUserJobs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/users/user-jobs/${user.id}?page=${currentPage}&limit=5&lang=${language}`
      );

      console.log('Ответ от сервера:', response.data.jobs);
      console.log('🔍 UserJobs - Jobs with images:', response.data.jobs.map(job => ({
        id: job.id,
        title: job.title,
        imageUrl: job.imageUrl
      })));
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(
        "❌ Ошибка загрузки объявлений пользователя:",
        error.response?.data || error.message
      );
      toast.error("Ошибка загрузки ваших объявлений!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserJobs();
  }, [user, currentPage, language]);

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      await axios.delete(`${API_URL}/api/jobs/${jobToDelete}`);
      toast.success("Объявление удалено!");
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobToDelete));
    } catch (error) {
      console.error("Ошибка удаления объявления:", error);
      toast.error("Ошибка удаления объявления!");
    } finally {
      setShowModal(false);
      setJobToDelete(null);
    }
  };

  const openDeleteModal = (jobId) => {
    setJobToDelete(jobId);
    setShowModal(true);
  };

  const handleEdit = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleBoost = async (jobId) => {
    try {
      await axios.post(`${API_URL}/api/jobs/${jobId}/boost`);
      toast.success("Объявление поднято в топ!");
      fetchUserJobs();
    } catch (error) {
      toast.error(error.response?.data?.error || "Ошибка поднятия объявления");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!user) {
    return <p className="text-center">{t("sing_in_to_view")}</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-bold mb-3 text-center text-primary">
        {loading ? <Skeleton width={200} height={24} /> : t("my_ads_title")}
      </h2>

      {loading ? (
        <div className="d-flex flex-column align-items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="card mb-3 shadow-sm"
              style={{ width: "90%", maxWidth: "700px", minHeight: "220px" }}
            >
              <div className="card-body">
                <Skeleton height={30} width="70%" />
                <Skeleton height={20} width="90%" className="mt-2" />
                <Skeleton height={20} width="60%" className="mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center fs-4">{t("you_dont_have_ads")}</p>
      ) : (
        <div className="d-flex flex-column" style={{ minHeight: "700px" }}>
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`card mb-3 position-relative shadow-sm ${
                job.user?.isPremium ? "premium-job" : ""
              }`}
              style={{
                width: "90%",
                maxWidth: "700px",
                margin: "0 auto",
                background: job.user?.isPremium ? "#D4E6F9" : "white",
                borderRadius: "10px",
              }}
            >
              {/* Плашка Премиум */}
              {job.user?.isPremium && (
                <div className="premium-badge">
                  <i className="bi bi-star-fill"></i> Премиум
                </div>
              )}
              <div className="card-body">
                {job.imageUrl && (
                  <div className="mb-3">
                    {console.log('🔍 UserJobs - Rendering image for job:', job.id, 'URL:', job.imageUrl)}
                    <img 
                      src={job.imageUrl} 
                      alt={job.title}
                      className="img-fluid rounded"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                      onError={(e) => console.error('❌ UserJobs - Image failed to load:', job.imageUrl, e)}
                      onLoad={() => console.log('✅ UserJobs - Image loaded successfully:', job.imageUrl)}
                    />
                  </div>
                )}
                <h5 className="card-title text-primary">{job.title}</h5>
                {job.category?.label && (
                  <div className="mb-2">
                    <span className="px-2 py-1 text-sm rounded font-semibold bg-primary text-white">{job.category.label}</span>
                  </div>
                )}
                {!job.category?.label && (
                  <div className="mb-2">
                    <span className="px-2 py-1 text-sm rounded font-semibold bg-primary text-white">{t('not_specified') || 'Не указано'}</span>
                  </div>
                )}
                <p className="card-text">
                  <strong>{t("salary_per_hour_card")}</strong> {job.salary}
                  <br />
                  <strong>{t("location_card")}</strong>{" "}
                  {job.city?.name || "Не указано"}
                </p>
                <p className="card-text">{job.description}</p>
                <div className="card-text">
                  {typeof job.shuttle === 'boolean' && (
                    <p className="card-text mb-1">
                      <strong>{t("shuttle") || "Подвозка"}:</strong> {job.shuttle ? t("yes") || "да" : t("no") || "нет"}
                    </p>
                  )}
                  {typeof job.meals === 'boolean' && (
                    <p className="card-text mb-1">
                      <strong>{t("meals") || "Питание"}:</strong> {job.meals ? t("yes") || "да" : t("no") || "нет"}
                    </p>
                  )}
                  <p className="card-text mb-0">
                    <strong>{t("phone_number_card")}</strong> {job.phone}
                  </p>
                </div>
                <div className="text-muted">
                  <small>
                    <span className="d-none d-sm-inline">
                      {t("created_at") + ": "}
                    </span>
                    {format(new Date(job.createdAt), "dd MMMM yyyy", {
                      locale: ru,
                    })}
                  </small>
                </div>
              </div>
              <div className="position-absolute bottom-0 end-0 mb-3 me-3 d-flex gap-3">
                <SortUp
                  role="button"
                  size={24}
                  className="text-success"
                  onClick={() => handleBoost(job.id)}
                  title="Поднять в топ"
                />
                <PencilSquare
                  role="button"
                  size={24}
                  className="text-primary"
                  onClick={() => handleEdit(job.id)}
                />
                <Trash
                  role="button"
                  size={24}
                  className="text-danger"
                  onClick={() => openDeleteModal(job.id)}
                />
              </div>
            </div>
          ))}
          <Pagination className="mt-3 justify-content-center">
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
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("confirm_delete")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("confirm_delete_text")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserJobs;
