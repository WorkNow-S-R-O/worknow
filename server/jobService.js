import axios from 'axios';

const API_URL = 'http://localhost:3001/api/jobs';

export const fetchJobs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Ошибка загрузки объявлений:', error);
    return [];
  }
};
