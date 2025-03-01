import axios from 'axios';

const API_URL = 'http://localhost:3001/api/cities';

export const fetchCities = async () => {
  const response = await axios.get(API_URL);
  return response.data.map((city) => ({
    value: city.id,
    label: city.name,
  }));
};
