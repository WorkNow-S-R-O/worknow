import { useEffect, useState } from 'react';
import { useLocale } from 'react-intlayer';

const API_URL = import.meta.env.VITE_API_URL;

const useFetchCategories = () => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const { locale } = useLocale();

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch(
					`${API_URL}/api/categories?lang=${locale}`,
				);
				const data = await response.json();
				const formattedCategories = data.map((category) => ({
					value: category.id,
					label: category.label || category.name,
				}));
				setCategories(formattedCategories);
			} catch (error) {
				console.error('Error fetching categories:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, [locale]);

	return { categories, loading };
};

export default useFetchCategories;
