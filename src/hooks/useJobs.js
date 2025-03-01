import { useState, useEffect } from 'react';
import { fetchJobs } from '../../server/jobService';

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
      setLoading(false);
    };

    loadJobs();
  }, []);

  return { jobs, loading };
};

export default useJobs;
