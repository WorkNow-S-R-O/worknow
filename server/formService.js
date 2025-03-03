import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createJob = async (jobData) => {
  const response = await axios.post(API_URL, jobData);
  return response.data;
};
