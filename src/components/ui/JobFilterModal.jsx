import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const JobFilterModal = ({ open, onClose, onApply }) => {
  const [salary, setSalary] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => setCategories(data));
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleApply = () => {
    onApply({
      salary: salary ? Number(salary) : undefined,
      categoryId: selectedCategory || undefined,
    });
    onClose();
  };

  // Закрытие по клику вне окна
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div onClick={handleBackdropClick} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 32px rgba(0,0,0,0.15)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', padding: '4px 8px' }} aria-label="Закрыть фильтр">×</button>
        <h5 className='mb-4 font-size-10'>Фильтрация вакансий</h5>
        <div style={{ marginBottom: 16 }}>
          <label>Желаемая зарплата (₪/час):</label>
          <input type="number" className="form-control" value={salary} onChange={e => setSalary(e.target.value)} placeholder="Например, 50" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label>Категория работы:</label>
          <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">Выберите категорию</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="d-flex justify-content-start mt-4">
          <button className="btn btn-primary px-4" onClick={handleApply}>Сохранить</button>
        </div>
      </div>
    </div>
  );
};

JobFilterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
};

export default JobFilterModal; 