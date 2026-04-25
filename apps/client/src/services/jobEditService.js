import axios from 'axios';
import { API_URL } from '@/config';

export const fetchJob = async (id) => {
	const response = await axios.get(`${API_URL}/api/jobs/${id}`);
	return response.data;
};

export const updateJob = async (id, jobData) => {
	const response = await axios.put(`${API_URL}/api/jobs/${id}`, jobData);
	return response.data;
};
