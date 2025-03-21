import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCities = async () => {
  const response = await axios.get(`${API_URL}/cities`);
  return response.data.map((city) => ({
    value: city.id,
    label: city.name,
  }));
};
