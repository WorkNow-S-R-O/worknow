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
  const modalRef = useRef();
  const language = useLanguageStore((state) => state.language) || 'ru';
  const { t } = useTranslation();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (open) {
      setSalary(currentFilters.salary || '');
      setSelectedCategory(currentFilters.categoryId || '');
      setShuttleOnly(currentFilters.shuttleOnly || false);
      setMealsOnly(currentFilters.mealsOnly || false);
      
      document.body.style.overflow = 'hidden';
      fetch(`${API_URL}/api/categories?lang=${language}`)
        .then(res => res.json())
        .then(data => setCategories(data));
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, currentFilters, language, API_URL]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, onClose]);

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

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div ref={modalRef} style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 32px rgba(0,0,0,0.15)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', padding: '4px 8px' }} aria-label={t('close_filter')}>&times;</button>
        <h5 className='mb-4 font-size-10'>{t('filter_modal_title')}</h5>
        <div style={{ marginBottom: 16 }}>
          <label>{t('filter_salary_label')}</label>
          <input type="number" className="form-control" value={salary} onChange={e => setSalary(e.target.value)} placeholder={t('filter_salary_placeholder')} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label>{t('category')}</label>
          <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
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
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="shuttleSwitch"
            checked={shuttleOnly}
            onChange={e => setShuttleOnly(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="shuttleSwitch">
            {t('shuttle') || 'Подвозка'}
          </label>
        </div>
        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="mealsSwitch"
            checked={mealsOnly}
            onChange={e => setMealsOnly(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="mealsSwitch">
            {t('meals') || 'Питание'}
          </label>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-outline-secondary" onClick={handleReset}>{t('reset')}</button>
          <button className="btn btn-primary px-4" onClick={handleApply}>{t('save')}</button>
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