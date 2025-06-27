import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useLanguageStore from '../../store/languageStore';
import { useTranslation } from 'react-i18next';

const JobFilterModal = ({ open, onClose, onApply, currentFilters = {} }) => {
  const [salary, setSalary] = useState(currentFilters.salary || '');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.categoryId || '');
  const modalRef = useRef();
  const language = useLanguageStore((state) => state.language) || 'ru';
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      // Устанавливаем текущие фильтры при открытии
      setSalary(currentFilters.salary || '');
      setSelectedCategory(currentFilters.categoryId || '');
      
      document.body.style.overflow = 'hidden';
      fetch(`/api/categories?lang=${language}`)
        .then(res => res.json())
        .then(data => setCategories(data));
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, currentFilters, language]);

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
    });
    onClose();
  };

  const handleReset = () => {
    setSalary('');
    setSelectedCategory('');
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
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
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
  }),
};

export default JobFilterModal; 