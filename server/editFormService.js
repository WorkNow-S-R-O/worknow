import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchJob = async (id) => {
  const response = await axios.get(`${API_URL}/jobs/${id}`);  // ✅ Путь исправлен
  return response.data;
};

export const updateJob = async (id, jobData) => {
  if (jobData instanceof FormData) {
    const response = await axios.post(`${API_URL}/jobs/${id}/upload`, jobData);
    return response.data;
  } else {
    const response = await axios.put(`${API_URL}/jobs/${id}`, jobData);
    return response.data;
  }
};
