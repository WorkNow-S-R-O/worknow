import { useState, useEffect } from 'react';
import { fetchCities } from '../../server/cityService';
import { toast } from 'react-hot-toast';

const useFetchCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cityData = await fetchCities();
        setCities(cityData);
      } catch (error) {
        console.error('Ошибка загрузки городов:', error);
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
