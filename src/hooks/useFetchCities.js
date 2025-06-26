import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import useLanguageStore from '../store/languageStore';

const API_URL = import.meta.env.VITE_API_URL; // ✅ Используем переменную окружения

const useFetchCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const language = useLanguageStore((state) => state.language) || 'ru';

  useEffect(() => {
    const loadCities = async () => {
      try {
        const url = `${API_URL}/cities?lang=${language}`;
        const response = await axios.get(url);

        if (!Array.isArray(response.data)) {
          console.error("❌ API вернул не массив! Данные:", response.data);
          setCities([]);
          return;
        }

        const formattedCities = response.data.map((city) => ({
          value: city.id,
          label: city.name,
        }));
        setCities(formattedCities);
      } catch (error) {
        if (!(error?.code === 'ECONNABORTED')) {
          console.error('Ошибка загрузки городов:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [language]);

  return { cities, loading };
};

export default useFetchCities;
