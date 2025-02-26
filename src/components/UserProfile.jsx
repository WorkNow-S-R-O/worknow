import { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loading-skeleton/dist/skeleton.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const { clerkUserId } = useParams();

  useEffect(() => {
    const fetchProfileData = async () => {
      console.log('clerkUserId из useParams:', clerkUserId);
      try {
        const [userResponse, jobsResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/user/${clerkUserId}`),
          axios.get(`http://localhost:3001/api/user-jobs/${clerkUserId}`),
        ]);

        setUser(userResponse.data);
        setJobs(jobsResponse.data.jobs);
      } catch (error) {
        console.error('Ошибка загрузки данных профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [clerkUserId]);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-20 d-flex flex-column align-items-center text-center">
        {loading ? (
          <>
            <div className="d-flex flex-column align-items-center mb-4">
              <Skeleton circle height={100} width={100} className="mb-3" />
              <div>
                <Skeleton width={200} height={24} />
                <Skeleton width={150} height={18} className="mt-2" />
              </div>
            </div>
            <h4><Skeleton width={200} height={24} /></h4>
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
        ) : !user ? (
          <p>Пользователь не найден</p>
        ) : (
          <>
            <div className="d-flex flex-column align-items-center mb-4">
              <img
                src={user.imageUrl}
                alt="User Avatar"
                className="rounded-circle mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <div>
                <h2>{user.firstName || 'Без имени'} {user.lastName || ''}</h2>
                <p className="text-muted">{user.email}</p>
              </div>
            </div>

            <h4 className='text-primary'>Объявления пользователя:</h4>
            {jobs.length === 0 ? (
              <p>Пользователь пока не разместил объявлений.</p>
            ) : (
              <>
                {currentJobs.map((job) => (
                  <div
                    key={job.id}
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
                        <strong>Зарплата в час:</strong> {job.salary}
                        <br />
                        <strong>Местоположение:</strong> {job.city.name}
                      </p>
                      <p className="card-text">{job.description}</p>
                      <p className="card-text">
                        <strong>Телефон:</strong> {job.phone}
                      </p>
                      <div className="card-text text-muted">
                        <small>
                          Дата создания: {format(new Date(job.createdAt), 'dd MMMM yyyy', { locale: ru })}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
                <Pagination className="justify-content-center">
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
              </>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
