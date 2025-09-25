import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchJob = async (id) => {
	const response = await axios.get(`${API_URL}/api/jobs/${id}`);
	return response.data;
};

export const updateJob = async (id, jobData) => {
	const response = await axios.put(`${API_URL}/api/jobs/${id}`, jobData);
	return response.data;
};
