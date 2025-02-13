import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CityDropdown from './ui/city-dropwdown';

const JobListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('Выбрать город');
  const [jobData, setJobData] = useState([]);
  const jobsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/jobs');
        setJobData(response.data);
      } catch (error) {
        console.error('Ошибка загрузки объявлений:', error);
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

        <div className="d-flex flex-column align-items-center flex-grow-1">
          {filteredJobs.length === 0 ? (
            <p className="text-muted mt-4">Объявлений не найдено</p>
          ) : (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className="d-flex card shadow-sm mb-4"
                style={{ width: '90%', maxWidth: '700px', borderRadius: '10px' }}
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
              </div>
            ))
          )}
        </div>
      </div>

      {filteredJobs.length > 0 && (
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
