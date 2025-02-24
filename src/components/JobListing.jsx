import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CityDropdown from './ui/city-dropwdown';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const JobListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('Выбрать город');
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const jobsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/jobs');
        setJobData(response.data);
      } catch (error) {
        console.error('Ошибка загрузки объявлений:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs =
    selectedCity === 'Выбрать город'
      ? jobData
      : jobData.filter((job) => job.city.name === selectedCity);

      const sortedJobs = [...filteredJobs].sort((a, b) => {
        // Premium объявления выше всех остальных
        if (a.user?.isPremium !== b.user?.isPremium) {
          return a.user?.isPremium ? -1 : 1;
        }
      
        // Затем сортировка по boostedAt и createdAt
        const dateA = a.boostedAt ? new Date(a.boostedAt) : new Date(a.createdAt);
        const dateB = b.boostedAt ? new Date(b.boostedAt) : new Date(b.createdAt);
      
        return dateB - dateA;
      });
      

  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  const handleAvatarClick = (clerkUserId) => {
    navigate(`/profile/${clerkUserId}`);
  };

  return (
    <div className="d-flex flex-column">
      <div className="flex-grow-1 d-flex flex-column align-items-center mt-40 min-h-screen">
        <CityDropdown selectedCity={selectedCity} onCitySelect={handleCitySelect} />

        <div className="d-flex flex-column align-items-center w-100">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="card shadow-sm mb-4"
                style={{
                  width: '90%',
                  maxWidth: '700px',
                  borderRadius: '10px',
                  minHeight: '220px',
                  height: 'auto',
                }}
              >
                <div className="card-body">
                  <Skeleton height={30} width="70%" />
                  <Skeleton height={20} width="90%" className="mt-2" />
                  <Skeleton height={20} width="60%" className="mt-2" />
                  <Skeleton height={15} width="100%" className="mt-3" />
                  <Skeleton height={15} width="100%" />
                  <Skeleton height={15} width="80%" />
                </div>
              </div>
            ))
          ) : filteredJobs.length === 0 ? (
            <p className="text-muted mt-4">Объявлений не найдено</p>
          ) : (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className={`card shadow-sm mb-4 position-relative ${
                  job.user?.isPremium ? 'border border-warning' : ''
                }`}
                style={{
                  backgroundColor: job.user?.isPremium ? '#fff8dc' : 'white',
                  width: '90%',
                  maxWidth: '700px',
                  borderRadius: '10px',
                  minHeight: '220px',
                  height: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
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

                {job.user?.imageUrl && (
                  <div
                    className="position-absolute top-0 end-0 m-2"
                    style={{ width: '45px', height: '45px', cursor: 'pointer' }}
                    onClick={() => handleAvatarClick(job.user.clerkUserId)}
                  >
                    <img src={job.user.imageUrl} alt="User Avatar" className="rounded-circle w-100 h-100" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {filteredJobs.length > 0 && !loading && (
        <Pagination className="mt-auto d-flex justify-content-center">
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
              {page + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </div>
  );
};

export { JobListing };
