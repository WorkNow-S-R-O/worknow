import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import useLanguageStore from '../../store/languageStore';
import '../../index.css';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

const CityDropdown = ({ selectedCity, onCitySelect, buttonClassName = '' }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const language = useLanguageStore((state) => state.language) || 'ru';
  const ref = useRef();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleCitySelect = (cityObj) => {
    onCitySelect(cityObj);
    setOpen(false);
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

  // Фильтрация городов по поиску
  const filteredOtherCities = otherCities.filter(city => (city.label || city.name).toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 180 }}>
      <button
        type="button"
        className={`d-flex align-items-center justify-content-center border border-primary rounded px-4 ${buttonClassName}`}
        style={{
          height: 40,
          background: '#fff',
          color: '#1976d2',
          fontWeight: 500,
          fontSize: 16,
          boxShadow: '0 1px 4px rgba(25, 118, 210, 0.06)',
          transition: 'box-shadow 0.2s',
          gap: 8,
          width: '100%'
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <i className="bi bi-geo-alt me-2" style={{ fontSize: 20 }}></i>
        {selectedCity?.label || t('city_all')}
        <i className="bi bi-caret-down-fill ms-2" style={{ fontSize: 14 }}></i>
      </button>
      {open && (
        window.innerWidth <= 600 ? (
          createPortal(
            <>
              {/* Затемнение */}
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 4000 }} onClick={() => setOpen(false)} />
              {/* Модалка */}
              <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100vw', maxHeight: '90vh', background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, boxShadow: '0 -2px 24px rgba(25, 118, 210, 0.13)', zIndex: 4101, padding: 0, display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 8px 20px', borderBottom: '1px solid #eee' }}>
                  <span style={{ fontWeight: 600, fontSize: 18 }}>{t('choose_city')}</span>
                  <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 26, color: '#888', cursor: 'pointer', padding: 0, marginLeft: 8 }}>&times;</button>
                </div>
                <div style={{ padding: '0 20px 8px 20px' }}>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('choose_city')} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e3eafc', marginBottom: 8, fontSize: 16 }} />
                </div>
                <div style={{ overflowY: 'auto', flex: 1, padding: '0 0 12px 0' }}>
                  <div
                    className="dropdown-item"
                    style={{ cursor: 'pointer', padding: '12px 20px', color: '#1976d2', borderRadius: 8, fontWeight: 500 }}
                    onClick={() => { handleCitySelect({ value: null, label: t('city_all') }); setSearch(""); }}
                  >
                    <i className="bi bi-geo-alt me-2"></i> {t('city_all')}
                  </div>
                  {/* Регионы */}
                  {regions.map((city) => (
                    <div
                      key={city.id}
                      className="dropdown-item"
                      style={{ cursor: 'pointer', padding: '12px 20px', color: '#1976d2', borderRadius: 8 }}
                      onClick={() => { handleCitySelect({ value: city.id, label: city.label || city.name }); setSearch(""); }}
                    >
                      <i className="bi bi-geo-alt me-2"></i> {city.label || city.name}
                    </div>
                  ))}
                  {/* Остальные города */}
                  {loading ? (
                    <div className="dropdown-item" style={{ color: '#888', padding: '12px 20px' }}>Загрузка...</div>
                  ) : (
                    filteredOtherCities.map((city) => (
                      <div
                        key={city.id}
                        className="dropdown-item"
                        style={{ cursor: 'pointer', padding: '12px 20px', color: '#1976d2', borderRadius: 8 }}
                        onClick={() => { handleCitySelect({ value: city.id, label: city.label || city.name }); setSearch(""); }}
                      >
                        <i className="bi bi-geo-alt me-2"></i> {city.label || city.name}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>,
            document.body
          )
        ) : (
          <div
            className="city-dropdown-menu"
            style={{
              position: 'absolute',
              top: 44,
              left: 0,
              zIndex: 3000,
              background: '#fff',
              border: '1px solid #e3eafc',
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(25, 118, 210, 0.13)',
              minWidth: 120,
              maxWidth: '96vw',
              maxHeight: 420,
              overflowY: 'auto',
              padding: 6,
              transition: 'box-shadow 0.2s',
            }}
          >
            <div
              className="dropdown-item"
              style={{ cursor: 'pointer', padding: '8px 16px', color: '#1976d2', borderRadius: 8, fontWeight: 500 }}
              onMouseDown={() => handleCitySelect({ value: null, label: t('city_all') })}
            >
              <i className="bi bi-geo-alt me-2"></i> {t('city_all')}
            </div>
            {/* Регионы */}
            {regions.map((city) => (
              <div
                key={city.id}
                className="dropdown-item"
                style={{ cursor: 'pointer', padding: '8px 16px', color: '#1976d2', borderRadius: 8 }}
                onMouseDown={() => handleCitySelect({ value: city.id, label: city.label || city.name })}
              >
                <i className="bi bi-geo-alt me-2"></i> {city.label || city.name}
              </div>
            ))}
            {/* Остальные города */}
            {loading ? (
              <div className="dropdown-item" style={{ color: '#888', padding: '8px 16px' }}>Загрузка...</div>
            ) : (
              otherCities.map((city) => (
                <div
                  key={city.id}
                  className="dropdown-item"
                  style={{ cursor: 'pointer', padding: '8px 16px', color: '#1976d2', borderRadius: 8 }}
                  onMouseDown={() => handleCitySelect({ value: city.id, label: city.label || city.name })}
                >
                  <i className="bi bi-geo-alt me-2"></i> {city.label || city.name}
                </div>
              ))
            )}
          </div>
        )
      )}
    </div>
  );
};

CityDropdown.propTypes = {
  selectedCity: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string
  }),
  onCitySelect: PropTypes.func.isRequired,
  buttonClassName: PropTypes.string,
};

export default CityDropdown;
