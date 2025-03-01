import { useState, useEffect } from 'react';
import { fetchJob } from '../../server/editFormService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useFetchJob = (id, setValue) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadJob = async () => {
      try {
        const job = await fetchJob(id);
        setValue('title', job.title);
        setValue('salary', job.salary);
        setValue('cityId', job.city.id);
        setValue('phone', job.phone);
        setValue('description', job.description);
      } catch (error) {
        toast.error('Ошибка загрузки объявления');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, navigate, setValue]);

  return { loading };
};

export default useFetchJob;
