import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocale } from 'react-intlayer';

const API_URL = import.meta.env.VITE_API_URL; // ✅ Используем переменную окружения

const useFetchCities = () => {
	const [cities, setCities] = useState([]);
	const [loading, setLoading] = useState(true);
	const { locale } = useLocale();

	useEffect(() => {
		const loadCities = async () => {
			try {
				const url = `${API_URL}/api/cities?lang=${locale}`;
				const response = await axios.get(url);

				if (!Array.isArray(response.data)) {
					console.error('❌ API вернул не массив! Данные:', response.data);
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
	}, [locale]);

	return { cities, loading };
};

export default useFetchCities;
