import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import JobCard from './JobCard';
import Skeleton from 'react-loading-skeleton';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import JobFilterModal from './ui/JobFilterModal';

const API_URL = import.meta.env.VITE_API_URL;

const JobList = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({});

  const fetchJobs = async (currentFilters = {}) => {
    setLoading(true);
    try {
      // Формируем строку запроса из фильтров
      const params = new URLSearchParams();
      if (currentFilters.salary) params.append('salary', currentFilters.salary);
      if (currentFilters.categoryId) params.append('categoryId', currentFilters.categoryId);

      const response = await axios.get(`${API_URL}/jobs?${params.toString()}`);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Ошибка загрузки вакансий:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(filters);
  }, [filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setFilterModalOpen(false);
  };

  if (loading) {
    return (
      <>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="card shadow-sm mb-4" style={{ width: '90%', maxWidth: '700px', minHeight: '220px' }}>
            <div className="card-body">
              <Skeleton height={30} width="70%" />
              <Skeleton height={20} width="90%" className="mt-2" />
              <Skeleton height={20} width="60%" className="mt-2" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (!jobs || jobs.length === 0) {
    return <p className="text-muted mt-4">Объявлений не найдено</p>;
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <button 
          className="btn btn-outline-primary" 
          onClick={() => setFilterModalOpen(true)}
        >
          Фильтры
        </button>
      </div>

      {jobs.map((job) => {
        const isOwnJob = isLoaded && clerkUser && job.user?.clerkUserId === clerkUser.id;
        return (
          <JobCard
            key={job.id}
            job={job}
            currentUserName={isOwnJob ? `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() : undefined}
            currentUserImageUrl={isOwnJob ? clerkUser.imageUrl : undefined}
          />
        );
      })}

      <JobFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />
    </>
  );
};

// **Валидация пропсов**
JobList.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      salary: PropTypes.string,
      city: PropTypes.shape({
        name: PropTypes.string,
      }),
      description: PropTypes.string,
      phone: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      user: PropTypes.shape({
        clerkUserId: PropTypes.string,
        imageUrl: PropTypes.string,
        isPremium: PropTypes.bool,
      }),
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default JobList;
