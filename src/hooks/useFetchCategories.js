import { useState, useEffect } from 'react';
import useLanguageStore from '../store/languageStore';

const API_URL = import.meta.env.VITE_API_URL;

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const language = useLanguageStore((state) => state.language) || 'ru';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories?lang=${language}`);
        const data = await response.json();
        const formattedCategories = data.map(category => ({
          value: category.id,
          label: category.label || category.name
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  return { categories, loading };
};

export default useFetchCategories; 