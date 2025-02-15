import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CityDropdown from './ui/city-dropwdown';

const JobListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('Выбрать город');
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const jobsPerPage = 10;

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

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  return (
    <div className="d-flex flex-column">
      <div className="flex-grow-1 d-flex flex-column align-items-center mt-40 min-h-screen">
        <CityDropdown selectedCity={selectedCity} onCitySelect={handleCitySelect} />

        <div className="d-flex flex-column align-items-center w-100">
          {loading ? (
            // Показываем 5 скелетонов вместо вакансий во время загрузки
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
                className="card shadow-sm mb-4 position-relative"
                style={{
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
                </div>

                {/* Аватарка пользователя в правом верхнем углу */}
                {job.user?.imageUrl && (
                  <div
                    className="position-absolute top-0 end-0 m-2"
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #ddd',
                    }}
                  >
                    <img
                      src={job.user.imageUrl}
                      alt="User Avatar"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {filteredJobs.length > 0 && !loading && (
        <div className="mt-auto d-flex justify-content-center">
          <Pagination>
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

export { JobListing };
