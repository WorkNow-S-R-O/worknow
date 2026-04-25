import { useCallback } from 'react';
import useFetchLocalized from './useFetchLocalized';

const transformCities = (data) =>
	data.map((city) => ({
		value: city.id,
		label: city.name,
	}));

const useFetchCities = () => {
	const transform = useCallback(transformCities, []);
	const { data: cities, loading } = useFetchLocalized('cities', transform);
	return { cities, loading };
};

export default useFetchCities;
