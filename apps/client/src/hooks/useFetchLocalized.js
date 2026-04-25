import { useState, useEffect } from 'react';
import { useLocale } from 'react-intlayer';
import { API_URL } from '@/config';

const useFetchLocalized = (endpoint, transform) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const { locale } = useLocale();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(
					`${API_URL}/api/${endpoint}?lang=${locale}`,
				);
				const json = await response.json();

				if (!Array.isArray(json)) {
					console.error(`API returned non-array for ${endpoint}:`, json);
					setData([]);
					return;
				}

				setData(transform(json));
			} catch (error) {
				if (error?.code !== 'ECONNABORTED') {
					console.error(`Error fetching ${endpoint}:`, error);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [locale, endpoint, transform]);

	return { data, loading };
};

export default useFetchLocalized;
