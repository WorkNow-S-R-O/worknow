import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL; // ✅ Используем переменную окружения

const useFetchCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await axios.get(`${API_URL}/cities`);

        console.log("📌 Полученные города:", response.data); // ✅ Логируем данные

        if (!Array.isArray(response.data)) {
          console.error("❌ API вернул не массив:", response.data);
          setCities([]); // ✅ Предотвращаем ошибки
          return;
        }

        setCities(response.data);
      } catch (error) {
        console.error('❌ Ошибка загрузки городов:', error);
        toast.error('Не удалось загрузить города!');
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  return { cities, loading };
};

export default useFetchCities;
