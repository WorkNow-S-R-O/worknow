import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Pagination, Modal, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import Skeleton from 'react-loading-skeleton';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-loading-skeleton/dist/skeleton.css';

const UserJobs = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Модальное окно
  const [showModal, setShowModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUserJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/user-jobs/${user.id}?page=${currentPage}&limit=5`
        );
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Ошибка загрузки объявлений пользователя:', error);
        toast.error('Ошибка загрузки ваших объявлений!');
      } finally {
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, [user, currentPage]);

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      await axios.delete(`http://localhost:3001/api/jobs/${jobToDelete}`);
      toast.success('Объявление удалено!');
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobToDelete));
    } catch (error) {
      console.error('Ошибка удаления объявления:', error);
      toast.error('Ошибка удаления объявления!');
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!user) {
    return <p className='text-center'>Пожалуйста, войдите, чтобы увидеть ваши объявления.</p>;
  }

  return (
    <div className="mt-4">
      {loading ? (
        <div style={{ minHeight: '700px' }} className="d-flex flex-column justify-content-between">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="card mb-3 position-relative"
              style={{ width: '90%', maxWidth: '700px', margin: '0 auto' }}
            >
              <div className="card-body">
                <Skeleton height={24} width="50%" />
                <Skeleton height={18} width="80%" className="my-2" />
                <Skeleton height={18} width="60%" />
                <Skeleton height={15} width="100%" className="my-2" />
                <Skeleton height={15} width="100%" />
              </div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center fs-4">У вас пока нет объявлений.</p>
      ) : (
        <div style={{ minHeight: '700px' }} className="d-flex flex-column">
          {/* Отображаем заголовок "Мои объявления" только если есть объявления */}
          <h2 className="text-lg font-bold mb-3 text-center text-primary">Мои объявления</h2>

          {jobs.map((job) => (
            <div
              key={job.id}
              className="card mb-3 position-relative"
              style={{ width: '90%', maxWidth: '700px', margin: '0 auto' }}
            >
              <div className="card-body">
                <h5 className="card-title text-primary">{job.title}</h5>
                <p className="card-text">
                  <strong>Зарплата в час:</strong> <span>{job.salary}</span>
                  <br />
                  <strong>Местоположение:</strong> <span>{job.city.name}</span>
                </p>
                <p className="card-text">{job.description}</p>
                <p className="card-text">
                  <strong>Телефон:</strong> <span>{job.phone}</span>
                </p>
                <div className="card-text text-muted">
                  <small>
                    Дата создания: {format(new Date(job.createdAt), 'dd MMMM yyyy', { locale: ru })}
                  </small>
                </div>
              </div>

              <div className="position-absolute bottom-0 end-0 mb-3 me-3 d-flex gap-3">
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
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтвердите удаление</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы точно хотите удалить это объявление? Это действие нельзя отменить.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserJobs;
