import { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';

const CityDropdown = ({ selectedCity, onCitySelect }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Ошибка загрузки городов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <DropdownButton
      title={
        <>
          <i className="bi bi-geo-alt me-2"></i> {selectedCity}
        </>
      }
      variant="outline-primary"
      className="mb-3"
    >
      <div
        style={{
          maxHeight: '200px', // ~5 строк (можно настроить)
          overflowY: 'auto',
        }}
      >
        <Dropdown.Item onClick={() => onCitySelect('Выбрать город')}>
          <i className="bi bi-geo-alt me-2"></i> Все города
        </Dropdown.Item>
        {loading ? (
          <Dropdown.Item disabled>Загрузка...</Dropdown.Item>
        ) : (
          cities.map((city) => (
            <Dropdown.Item
              key={city.id}
              onClick={() => onCitySelect(city.name)}
            >
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
