import { useCallback } from 'react';
import useFetchLocalized from './useFetchLocalized';

const transformCategories = (data) =>
	data.map((category) => ({
		value: category.id,
		label: category.label || category.name,
	}));

const useFetchCategories = () => {
	const transform = useCallback(transformCategories, []);
	const { data: categories, loading } = useFetchLocalized(
		'categories',
		transform,
	);
	return { categories, loading };
};

export default useFetchCategories;
