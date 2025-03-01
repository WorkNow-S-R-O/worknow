import { useState } from 'react';
import useJobs from '../hooks/useJobs';
import JobList from '../components/JobList';
import PaginationControl from '../components/PaginationControl';
import CityDropdown from '../components/ui/city-dropwdown';

const JobListing = () => {
  const { jobs, loading } = useJobs();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('Выбрать город');
  const jobsPerPage = 10;

  const filteredJobs = selectedCity === 'Выбрать город' ? jobs : jobs.filter((job) => job.city.name === selectedCity);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  return (
    <div className="d-flex flex-column align-items-center mt-40 min-h-screen">
      <CityDropdown selectedCity={selectedCity} onCitySelect={setSelectedCity} />
      <JobList jobs={currentJobs} loading={loading} />
      {filteredJobs.length > 0 && <PaginationControl currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  );
};

export {JobListing};
