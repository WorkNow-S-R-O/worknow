import axios from 'axios';

const API_URL = 'http://localhost:3001/api/jobs';

export const createJob = async (jobData) => {
  const response = await axios.post(API_URL, jobData);
  return response.data;
};
