import axios from 'axios';
import { API_URL } from '@/config';

export const createJob = async (jobData) => {
	const response = await axios.post(`${API_URL}/api/jobs`, jobData);
	return response.data;
};
