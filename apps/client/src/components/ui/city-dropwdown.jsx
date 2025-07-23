import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import useLanguageStore from '../../store/languageStore';
import '../../index.css';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

function MobileCityModal({ show, onClose, regions, otherCities, onCitySelect, t }) {
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [show]);
  const filteredOtherCities = otherCities.filter(city => (city.label || city.name).toLowerCase().includes(search.toLowerCase()));
  if (!show) return null;

  // Определяем десктоп или мобилка
  const isMobile = window.innerWidth <= 600;
  const modalStyle = isMobile
    ? { maxWidth: 420, margin: '0 auto', minHeight: '80vh' }
    : { width: 420, height: 520, maxWidth: '90vw', maxHeight: '90vh', margin: 'auto', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const contentStyle = isMobile
    ? { borderRadius: 18, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }
    : { borderRadius: 18, width: 420, height: 520, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(25, 118, 210, 0.13)' };

  return createPortal(
    <div className="modal fade show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.35)', zIndex: 4000 }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" style={modalStyle} onClick={e => e.stopPropagation()}>
        <div className="modal-content" style={contentStyle}>
          <div className="modal-header" style={{ borderBottom: '1px solid #eee' }}>
            <h5 className="modal-title">{t('choose_city')}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
            <div className="input-group mb-3">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input type="text" className="form-control" placeholder={t('choose_city')} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item list-group-item-action" style={{ cursor: 'pointer', color: '#1976d2', fontWeight: 500 }} onClick={() => { onCitySelect({ value: null, label: t('city_all') }); setSearch(""); onClose(); }}>
                <i className="bi bi-geo-alt me-2"></i> {t('city_all')}
              </li>
              {regions.map(city => (
                <li key={city.id} className="list-group-item list-group-item-action" style={{ cursor: 'pointer', color: '#1976d2' }} onClick={() => { onCitySelect({ value: city.id, label: city.label || city.name }); setSearch(""); onClose(); }}>
                  <i className="bi bi-geo-alt me-2"></i> {city.label || city.name}
                </li>
              ))}
              {filteredOtherCities.map(city => (
                <li key={city.id} className="list-group-item list-group-item-action" style={{ cursor: 'pointer', color: '#1976d2' }} onClick={() => { onCitySelect({ value: city.id, label: city.label || city.name }); setSearch(""); onClose(); }}>
                  <i className="bi bi-geo-alt me-2"></i> {city.label || city.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

MobileCityModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  regions: PropTypes.array.isRequired,
  otherCities: PropTypes.array.isRequired,
  onCitySelect: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const CityDropdown = ({ selectedCity, onCitySelect, buttonClassName = '' }) => {
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const language = useLanguageStore((state) => state.language) || 'ru';
  const ref = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/cities?lang=${language}`);
        setCities(response.data);
      } catch (error) {
        if (!(error?.code === 'ECONNABORTED')) {
          console.error('Ошибка загрузки городов:', error);
        }
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
    if (open && window.innerWidth > 600) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

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
    <>
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
        onClick={() => setOpen(true)}
      >
        <i className="bi bi-geo-alt me-2" style={{ fontSize: 20 }}></i>
        {selectedCity?.label || t('city_all')}
      </button>
      <MobileCityModal
        show={open}
        onClose={() => setOpen(false)}
        regions={regions}
        otherCities={otherCities}
        onCitySelect={onCitySelect}
        t={t}
      />
    </>
  );
};

CityDropdown.propTypes = {
  selectedCity: PropTypes.object,
  onCitySelect: PropTypes.func.isRequired,
  buttonClassName: PropTypes.string,
};

export default CityDropdown;
