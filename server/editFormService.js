import axios from 'axios';

const API_URL = 'http://localhost:3001/api/jobs';

export const fetchJob = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateJob = async (id, jobData) => {
  const response = await axios.put(`${API_URL}/${id}`, jobData);
  return response.data;
};
