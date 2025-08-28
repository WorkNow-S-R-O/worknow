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
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Определяем десктоп или мобилка - moved to top
  const isMobile = window.innerWidth <= 768;
  
  // Minimum swipe distance (in px) - increased to prevent accidental closing
  const minSwipeDistance = 100;
  
  const onTouchStart = (e) => {
    // Only handle touch events if we're directly touching the header text or close button
    const target = e.target;
    const isHeaderText = target.tagName === 'H5' || target.closest('h5');
    const isCloseButton = target.classList.contains('btn-close') || target.closest('.btn-close');
    
    if (isHeaderText || isCloseButton) {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientY);
    }
  };
  
  const onTouchMove = (e) => {
    // Only handle touch events if we're directly touching the header text or close button
    const target = e.target;
    const isHeaderText = target.tagName === 'H5' || target.closest('h5');
    const isCloseButton = target.classList.contains('btn-close') || target.closest('.btn-close');
    
    if (isHeaderText || isCloseButton) {
      setTouchEnd(e.targetTouches[0].clientY);
    }
  };
  
  const onTouchEnd = () => {
    // Only handle touch events if we were touching the header
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    
    if (isUpSwipe) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      // Prevent iOS Safari from bouncing when modal is open
      if (isMobile) {
        // Don't set position fixed as it can interfere with scrolling
        document.body.style.position = 'relative';
        document.body.style.height = '100vh';
        document.body.style.width = '100%';
      }
      return () => { 
        document.body.style.overflow = '';
        if (isMobile) {
          document.body.style.position = '';
          document.body.style.height = '';
          document.body.style.width = '';
        }
      };
    }
  }, [show, isMobile]);
  
  const filteredOtherCities = otherCities.filter(city => (city.label || city.name).toLowerCase().includes(search.toLowerCase()));
  if (!show) return null;

  // Fullscreen modal for mobile
  const modalStyle = isMobile
    ? { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        width: '100vw', 
        height: '100vh',
        margin: 0,
        maxWidth: '100vw',
        maxHeight: '100vh'
      }
    : { 
        width: 420, 
        height: 520, 
        maxWidth: '90vw', 
        maxHeight: '90vh', 
        margin: 'auto', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        position: 'fixed', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      };
  
  const contentStyle = isMobile
    ? { 
        borderRadius: 0, 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column',
        border: 'none',
        boxShadow: 'none'
      }
    : { 
        borderRadius: 10, 
        width: 500, 
        height: 600, 
        display: 'flex', 
        flexDirection: 'column', 
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.13)' 
      };

  return createPortal(
    <div 
      className="modal fade show" 
      tabIndex="-1" 
      style={{ display: 'block', background: isMobile ? '#fff' : 'rgba(0,0,0,0.35)', zIndex: 4000 }} 
      onClick={isMobile ? undefined : onClose}
    >
      <div className="modal-dialog modal-dialog-centered" style={modalStyle} onClick={e => e.stopPropagation()}>
        <div className="modal-content" style={contentStyle}>
          <div className="modal-header" style={{ borderBottom: '1px solid #eee', padding: isMobile ? '20px 16px' : '16px' }}>
            <h5 
              className="modal-title" 
              style={{ fontSize: isMobile ? '20px' : '16px', fontWeight: '600', color: '#495057' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {t('choose_city')}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={onClose} 
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{ fontSize: isMobile ? '15px' : '16px' }}
            ></button>
          </div>
          <div className="modal-body" style={{ padding: isMobile ? '0 16px 20px' : '16px', flex: 1, overflowY: 'auto' }}>
            <div className="input-group mb-3" style={{ marginTop: isMobile ? '12px' : '0' }}>
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input 
                type="text" 
                className="form-control" 
                placeholder={t('choose_city')} 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{ fontSize: isMobile ? '16px' : '14px' }}
              />
              {search && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSearch('')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#6c757d',
                    padding: '8px 12px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                  title="Очистить"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item list-group-item-action" style={{ cursor: 'pointer', color: '#1976d2', fontWeight: 500, fontSize: isMobile ? '16px' : '14px', padding: isMobile ? '16px 0' : '12px 0' }} onClick={() => { onCitySelect({ value: null, label: t('city_all') }); setSearch(""); onClose(); }}>
                <i className="bi bi-geo-alt me-2"></i> {t('city_all')}
              </li>
              {regions.map(city => (
                <li key={city.id} className="list-group-item list-group-item-action" style={{ cursor: 'pointer', color: '#1976d2', fontWeight: '500', fontSize: isMobile ? '16px' : '14px', padding: isMobile ? '16px 0' : '12px 0' }} onClick={() => { onCitySelect({ value: city.id, label: city.label || city.name }); setSearch(""); onClose(); }}>
                  <i className="bi bi-geo-alt me-2"></i> {city.label || city.name}
                </li>
              ))}
              {filteredOtherCities.map(city => (
                <li key={city.id} className="list-group-item list-group-item-action" style={{ cursor: 'pointer', color: '#1976d2', fontWeight: '500', fontSize: isMobile ? '16px' : '14px', padding: isMobile ? '16px 0' : '12px 0' }} onClick={() => { onCitySelect({ value: city.id, label: city.label || city.name }); setSearch(""); onClose(); }}>
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
        console.log('🔍 Fetching cities from:', `${API_URL}/api/cities?lang=${language}`);
        const response = await axios.get(`${API_URL}/api/cities?lang=${language}`);
        console.log('🔍 Cities response:', response.data);
        
        if (Array.isArray(response.data)) {
          setCities(response.data);
        } else if (response.data && Array.isArray(response.data.cities)) {
          setCities(response.data.cities);
        } else {
          console.error('API вернул неожиданный формат:', response.data);
          setCities([]);
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки городов:', error);
        if (error.response) {
          console.error('❌ Response status:', error.response.status);
          console.error('❌ Response data:', error.response.data);
        }
        setCities([]);
      }
    };
    fetchCities();
  }, [language, API_URL]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open && window.innerWidth > 768) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Явно сортируем регионы в нужном порядке по label
  const regionOrder = [
    ['Центр страны', 'מרכז הארץ', 'Center'],
    ['Юг страны', 'דרום הארץ', 'South'],
    ['Север страны', 'צפון הארץ', 'North'],
  ];
  
  // Ensure cities is an array before processing
  const citiesArray = Array.isArray(cities) ? cities : [];
  
  const regions = regionOrder
    .map(labels => citiesArray.find(city => labels.includes(city.label || city.name)))
    .filter(Boolean);
  const otherCities = citiesArray.filter(city => !regions.includes(city));

  return (
    <>
      <button
        type="button"
        className={`btn btn-outline-primary d-flex align-items-center justify-content-center ${buttonClassName}`}
        style={{
          height: 40,
          fontWeight: 500,
          fontSize: 16,
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
