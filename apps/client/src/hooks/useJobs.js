import { useState, useEffect } from 'react';
import axios from 'axios';
// import { toast } from 'react-hot-toast'; // больше не используется
import useLanguageStore from '../store/languageStore';
import { useLoadingProgress } from './useLoadingProgress';

const API_URL = import.meta.env.VITE_API_URL; // ✅ Используем переменную окружения

const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const language = useLanguageStore((state) => state.language) || 'ru';
  const { startLoadingWithProgress, completeLoading } = useLoadingProgress();

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      
      // Only show loading progress if it takes more than 500ms
      const loadingTimeout = setTimeout(() => {
        startLoadingWithProgress(1500);
      }, 500);
      
      try {
        const response = await axios.get(`${API_URL}/api/jobs?lang=${language}`);
      
        
        if (!Array.isArray(response.data)) {
          console.error("❌ API вернул не массив:", response.data);
          setJobs([]); // ✅ Предотвращаем ошибку `.map()`
          return;
        }

        setJobs(response.data);
        clearTimeout(loadingTimeout);
        completeLoading(); // Complete loading when done
      } catch (error) {
        if (!(error?.code === 'ECONNABORTED')) {
          console.error("❌ Ошибка загрузки вакансий:", error);
        }
        clearTimeout(loadingTimeout);
        completeLoading(); // Complete loading even on error
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [language]); // Removed loading functions from dependencies

  return { jobs, loading };
};

export default useJobs;
