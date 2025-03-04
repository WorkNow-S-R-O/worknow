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
        console.log(`📌 Отправляем запрос: ${API_URL}/cities`);
        const response = await axios.get(`${API_URL}/cities`);

        console.log("📌 Статус ответа:", response.status);
        console.log("📌 Данные ответа:", response.data);

        if (!response.data || !Array.isArray(response.data)) {
          console.error("❌ API вернул некорректные данные:", response.data);
          setCities([]);
          return;
        }

        console.log("✅ Города успешно загружены:", response.data);
        setCities(response.data);
      } catch (error) {
        console.error("❌ Ошибка при загрузке городов:", error.response?.data || error.message);
        toast.error("Не удалось загрузить города!");
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  return { cities, loading };
};

export default useFetchCities;
