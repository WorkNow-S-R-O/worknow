import { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_URL = import.meta.env.VITE_API_URL;

const CityDropdown = ({ selectedCity, onCitySelect }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_URL}/cities`);
        setCities(response.data);
      } catch (error) {
        console.error('Ошибка загрузки городов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleCitySelect = (cityName) => {
    if (cityName === 'Все города') {
      window.location.reload(); // 🔄 Перезагрузка страницы при выборе "Все города"
    } else {
      onCitySelect(cityName);
    }
  };

  return (
    <DropdownButton
      title={
        <>
          <i className="bi bi-geo-alt me-2"></i> {selectedCity}
        </>
      }
      variant="outline-primary"
      className="mb-3"
      style={{ height: 40 }}
    >
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <Dropdown.Item onClick={() => handleCitySelect('Все города')}>
          <i className="bi bi-geo-alt me-2"></i> Все города
        </Dropdown.Item>
        {loading ? (
          <Dropdown.Item disabled>Загрузка...</Dropdown.Item>
        ) : (
          cities.map((city) => (
            <Dropdown.Item key={city.id} onClick={() => handleCitySelect(city.name)}>
              <i className="bi bi-geo-alt me-2"></i> {city.name}
            </Dropdown.Item>
          ))
        )}
      </div>
    </DropdownButton>
  );
};

CityDropdown.propTypes = {
  selectedCity: PropTypes.string.isRequired,
  onCitySelect: PropTypes.func.isRequired,
};

export default CityDropdown;
