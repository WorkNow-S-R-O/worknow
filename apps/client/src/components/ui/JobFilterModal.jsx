import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useLanguageStore from '../../store/languageStore';
import { useTranslation } from 'react-i18next';

const JobFilterModal = ({ open, onClose, onApply, currentFilters = {} }) => {
  const [salary, setSalary] = useState(currentFilters.salary || '');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.categoryId || '');
  const [shuttleOnly, setShuttleOnly] = useState(currentFilters.shuttleOnly || false);
  const [mealsOnly, setMealsOnly] = useState(currentFilters.mealsOnly || false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const modalRef = useRef();
  const language = useLanguageStore((state) => state.language) || 'ru';
  const { t } = useTranslation();

  const API_URL = import.meta.env.VITE_API_URL;

  // Определяем десктоп или мобилка
  const isMobile = window.innerWidth <= 768;

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };
  
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    
    if (isUpSwipe) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      setSalary(currentFilters.salary || '');
      setSelectedCategory(currentFilters.categoryId || '');
      setShuttleOnly(currentFilters.shuttleOnly || false);
      setMealsOnly(currentFilters.mealsOnly || false);
      
      document.body.style.overflow = 'hidden';
      // Prevent iOS Safari from bouncing when modal is open
      if (isMobile) {
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        // Hide any fixed elements like navbar
        const navbar = document.querySelector('nav, .navbar, header');
        if (navbar) {
          navbar.style.display = 'none';
        }
      }
      
      fetch(`${API_URL}/api/categories?lang=${language}`)
        .then(res => res.json())
        .then(data => setCategories(data));
    } else {
      document.body.style.overflow = '';
      if (isMobile) {
        document.body.style.position = '';
        document.body.style.width = '';
        // Show navbar again
        const navbar = document.querySelector('nav, .navbar, header');
        if (navbar) {
          navbar.style.display = '';
        }
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (isMobile) {
        document.body.style.position = '';
        document.body.style.width = '';
        // Show navbar again
        const navbar = document.querySelector('nav, .navbar, header');
        if (navbar) {
          navbar.style.display = '';
        }
      }
    };
  }, [open, currentFilters, language, API_URL, isMobile]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open && !isMobile) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, onClose, isMobile]);

  if (!open) return null;

  const handleApply = () => {
    onApply({
      salary: salary ? Number(salary) : undefined,
      categoryId: selectedCategory || undefined,
      shuttleOnly: shuttleOnly || undefined,
      mealsOnly: mealsOnly || undefined,
    });
    onClose();
  };

  const handleReset = () => {
    setSalary('');
    setSelectedCategory('');
    setShuttleOnly(false);
    setMealsOnly(false);
    onApply({});
    onClose();
  };

  // Fullscreen modal for mobile, original overlay for desktop
  const modalStyle = isMobile
    ? { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        width: '100vw', 
        height: '100vh',
        background: '#fff',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column'
      }
    : { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        background: 'rgba(0,0,0,0.3)', 
        zIndex: 1000, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      };

  const contentStyle = isMobile
    ? { 
        background: '#fff', 
        borderRadius: 0, 
        height: '100vh', 
        width: '100vw',
        padding: '16px 16px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
        border: 'none',
        position: 'absolute',
        top: 0,
        left: 0
      }
    : { 
        background: '#fff', 
        borderRadius: 18, 
        padding: 40, 
        width: 550, 
        height: 550,
        boxShadow: '0 4px 32px rgba(0,0,0,0.15)', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      };

  return (
    <div 
      style={modalStyle}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
    >
      <div ref={modalRef} style={contentStyle}>
        {isMobile ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h5 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>{t('filter_modal_title')}</h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={onClose} 
              style={{ fontSize: isMobile ? '24px' : '16px' }}
            ></button>
          </div>
        ) : (
          <>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={onClose} 
              style={{ 
                position: 'absolute', 
                margin: '5px',
                top: '8px', 
                right: '8px', 
                fontSize: isMobile ? '24px' : '16px' 
              }}
            ></button>
            <h5 className='mb-4 font-size-10'>{t('filter_modal_title')}</h5>
          </>
        )}
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {isMobile ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>{t('filter_salary_label')}</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={salary} 
                  onChange={e => setSalary(e.target.value)} 
                  placeholder={t('filter_salary_placeholder')}
                  style={{ fontSize: '16px', padding: '12px', margin: '0 8px', width: '90%' }}
                />
              </div>
              
              <div style={{ marginBottom: '28px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>{t('category')}</label>
                <select 
                  className="form-select" 
                  value={selectedCategory} 
                  onChange={e => setSelectedCategory(e.target.value)}
                  style={{ fontSize: '16px', padding: '12px', margin: '0 8px', width: '90%' }}
                >
                  <option value="">{t('choose_category')}</option>
                  {Array.isArray(categories) ? (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))
                  ) : (
                    <option value="" disabled>{t('categories_load_error') || 'Ошибка загрузки категорий'}</option>
                  )}
                </select>
              </div>
              
              <div className="form-check mb-3" style={{ marginLeft: '8px' }}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="shuttleSwitch"
                  checked={shuttleOnly}
                  onChange={e => setShuttleOnly(e.target.checked)}
                  style={{ 
                    transform: 'scale(1.2)', 
                    zIndex: 10,
                    position: 'relative'
                  }}
                />
                <label className="form-check-label" htmlFor="shuttleSwitch" style={{ fontSize: '16px' }}>
                  {t('shuttle') || 'Подвозка'}
                </label>
              </div>
              
              <div className="form-check mb-4" style={{ marginLeft: '8px' }}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="mealsSwitch"
                  checked={mealsOnly}
                  onChange={e => setMealsOnly(e.target.checked)}
                  style={{ 
                    transform: 'scale(1.2)', 
                    zIndex: 10,
                    position: 'relative'
                  }}
                />
                <label className="form-check-label" htmlFor="mealsSwitch" style={{ fontSize: '16px' }}>
                  {t('meals') || 'Питание'}
                </label>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <label>{t('filter_salary_label')}</label>
                <input type="number" className="form-control" value={salary} onChange={e => setSalary(e.target.value)} placeholder={t('filter_salary_placeholder')} style={{ margin: '0 8px', width: '90%' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label>{t('category')}</label>
                <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ margin: '0 8px', width: '90%' }}>
                  <option value="">{t('choose_category')}</option>
                  {Array.isArray(categories) ? (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))
                  ) : (
                    <option value="" disabled>{t('categories_load_error') || 'Ошибка загрузки категорий'}</option>
                  )}
                </select>
              </div>
              <div className="form-check mb-3" style={{ marginLeft: '8px' }}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="shuttleSwitch"
                  checked={shuttleOnly}
                  onChange={e => setShuttleOnly(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="shuttleSwitch">
                  {t('shuttle') || 'Подвозка'}
                </label>
              </div>
              <div className="form-check mb-4" style={{ marginLeft: '8px' }}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="mealsSwitch"
                  checked={mealsOnly}
                  onChange={e => setMealsOnly(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="mealsSwitch">
                  {t('meals') || 'Питание'}
                </label>
              </div>
            </>
          )}
        </div>
        
        <div className="d-flex justify-content-between mt-4" style={{ marginTop: isMobile ? 'auto' : '16px', paddingTop: isMobile ? '20px' : '0' }}>
          <button 
            className="btn btn-outline-secondary" 
            onClick={handleReset}
            style={{ fontSize: isMobile ? '16px' : '14px', padding: isMobile ? '12px 20px' : '8px 16px' }}
          >
            {t('reset')}
          </button>
          <button 
            className="btn btn-primary px-4" 
            onClick={handleApply}
            style={{ fontSize: isMobile ? '16px' : '14px', padding: isMobile ? '12px 24px' : '8px 16px' }}
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

JobFilterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  currentFilters: PropTypes.shape({
    salary: PropTypes.number,
    categoryId: PropTypes.string,
    shuttleOnly: PropTypes.bool,
    mealsOnly: PropTypes.bool,
  }),
};

export default JobFilterModal; 