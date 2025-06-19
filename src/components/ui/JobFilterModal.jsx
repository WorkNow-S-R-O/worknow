import React, { useEffect, useState } from 'react';

const JobFilterModal = ({ open, onClose }) => {
  const [salary, setSalary] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (open) {
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => setCategories(data));
    }
  }, [open]);

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}>
        <h3 style={{ marginBottom: 24 }}>Фильтрация вакансий</h3>
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
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>Закрыть</button>
          {/* Кнопка "Применить" появится позже */}
        </div>
      </div>
    </div>
  );
};

export default JobFilterModal; 