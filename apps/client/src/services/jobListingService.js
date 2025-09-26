import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchJobs = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/jobs`);
		return response.data;
	} catch (error) {
		console.error('Ошибка загрузки объявлений:', error);
		return [];
	}
};
