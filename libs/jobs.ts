import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createJob = async (jobData: any) => {
  const response = await axios.post(`${API_URL}/jobs`, jobData);
  return response.data;
};

export const updateJob = async (id: number, jobData: any) => {
  const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
  return response.data;
}; 