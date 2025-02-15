import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Pagination } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const UserJobs = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (jobId) => {
    if (!window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/jobs/${jobId}`);
      toast.success('Объявление удалено!');
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error('Ошибка удаления объявления:', error);
      toast.error('Ошибка удаления объявления!');
    }
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
      <h2 className="text-lg font-bold mb-3 text-center text-primary">Мои объявления</h2>

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
        <p className='text-center'>У вас нет объявлений.</p>
      ) : (
        <div style={{ minHeight: '700px' }} className="d-flex flex-column justify-content-between">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="card mb-3 position-relative"
              style={{ width: '90%', maxWidth: '700px', margin: '0 auto' }}
            >
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">Зарплата: {job.salary}</p>
                <p className="card-text">Местоположение: {job.city.name}</p>
                <p className="card-text">Описание: {job.description}</p>
                <strong className="card-text">Телефон: {job.phone}</strong>
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
                  onClick={() => handleDelete(job.id)}
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
    </div>
  );
};

export default UserJobs;
