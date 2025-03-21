import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL; // ✅ Используем переменную окружения

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/jobs`);
      
        
        if (!Array.isArray(response.data)) {
          console.error("❌ API вернул не массив:", response.data);
          setJobs([]); // ✅ Предотвращаем ошибку `.map()`
          return;
        }

        setJobs(response.data);
      } catch (error) {
        console.error("❌ Ошибка загрузки вакансий:", error);
        toast.error("Не удалось загрузить вакансии!");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  return { jobs, loading };
};

export default useJobs;
