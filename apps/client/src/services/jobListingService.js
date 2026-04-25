import axios from 'axios';
import { API_URL } from '@/config';

export const fetchJobs = async () => {
	try {
		const response = await axios.get(`${API_URL}/api/jobs`);
		return response.data;
	} catch (error) {
		console.error('Ошибка загрузки объявлений:', error);
		return [];
	}
};
