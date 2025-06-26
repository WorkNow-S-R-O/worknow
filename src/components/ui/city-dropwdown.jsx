import { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';
import useLanguageStore from '../../store/languageStore';

const API_URL = import.meta.env.VITE_API_URL;

const CityDropdown = ({ selectedCity, onCitySelect }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const language = useLanguageStore((state) => state.language) || 'ru';

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_URL}/cities?lang=${language}`);
        setCities(response.data);
        // Выводим id и label всех городов для поиска id регионов
        console.log('CITIES:', response.data.map(city => ({ id: city.id, label: city.label || city.name })));
      } catch (error) {
        if (!(error?.code === 'ECONNABORTED')) {
          console.error('Ошибка загрузки городов:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [language]);

  const handleCitySelect = (cityObj) => {
    onCitySelect(cityObj);
  };

  // Явно сортируем регионы в нужном порядке по label
  const regionOrder = [
    ['Центр страны', 'מרכז הארץ', 'Center'],
    ['Юг страны', 'דרום הארץ', 'South'],
    ['Север страны', 'צפון הארץ', 'North'],
  ];
  const regions = regionOrder
    .map(labels => cities.find(city => labels.includes(city.label || city.name)))
    .filter(Boolean);
  const otherCities = cities.filter(city => !regions.includes(city));

  return (
    <DropdownButton
      title={
        <>
          <i className="bi bi-geo-alt me-2"></i> {selectedCity?.label || 'Все города'}
        </>
      }
      variant="outline-primary"
      className="mb-3"
      style={{ height: 40 }}
    >
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <Dropdown.Item onClick={() => handleCitySelect({ value: null, label: 'Все города' })}>
          <i className="bi bi-geo-alt me-2"></i> Все города
        </Dropdown.Item>
        {/* Регионы */}
        {regions.map((city) => (
          <Dropdown.Item key={city.id} onClick={() => handleCitySelect({ value: city.id, label: city.label || city.name })}>
            <i className="bi bi-geo-alt me-2"></i> {city.label || city.name}
          </Dropdown.Item>
        ))}
        {/* Остальные города */}
        {loading ? (
          <Dropdown.Item disabled>Загрузка...</Dropdown.Item>
        ) : (
          otherCities.map((city) => (
            <Dropdown.Item key={city.id} onClick={() => handleCitySelect({ value: city.id, label: city.label || city.name })}>
              <i className="bi bi-geo-alt me-2"></i> {city.label || city.name}
            </Dropdown.Item>
          ))
        )}
      </div>
    </DropdownButton>
  );
};

CityDropdown.propTypes = {
  selectedCity: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string
  }),
  onCitySelect: PropTypes.func.isRequired,
};

export default CityDropdown;
