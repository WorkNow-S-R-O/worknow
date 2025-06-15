import { useState } from "react";

export default function AddSeekerModal({ show, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    city: '',
    description: '',
    category: '',
    employment: '',
    languages: '',
    documents: '',
    note: '',
    announcement: '',
  });
  const [error, setError] = useState(null);

  if (!show) return null;

  const handleNext = (e) => {
    e.preventDefault();
    // Валидация первого шага
    if (!form.name || !form.contact || !form.city || !form.description) {
      setError('Заполните все поля');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Валидация второго шага (можно доработать)
    onSubmit(form);
  };

  return (
    <div className="modal show fade" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content p-4" style={{ borderRadius: 16, minWidth: 500, maxWidth: 700 }}>
          <div className="modal-header border-0">
            <h4 className="modal-title">Добавить соискателя</h4>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {step === 1 && (
              <form onSubmit={handleNext}>
                <div className="mb-3">
                  <input name="name" className="form-control" placeholder="Имя" value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <input name="contact" className="form-control" placeholder="Контакт" value={form.contact} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <input name="city" className="form-control" placeholder="Город" value={form.city} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <textarea name="description" className="form-control" placeholder="Краткое описание" value={form.description} onChange={handleChange} required />
                </div>
                {error && <div className="text-danger mb-2">{error}</div>}
                <button className="btn btn-primary" type="submit">Далее</button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input name="category" className="form-control" placeholder="Категория (например, уход-за-пожилыми)" value={form.category} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <input name="employment" className="form-control" placeholder="Занятость (например, полная)" value={form.employment} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <input name="languages" className="form-control" placeholder="Языки (например, ru: родной)" value={form.languages} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <input name="documents" className="form-control" placeholder="Документы" value={form.documents} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <textarea name="announcement" className="form-control" placeholder="Объявление (детально)" value={form.announcement} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <textarea name="note" className="form-control" placeholder="Примечание" value={form.note} onChange={handleChange} />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={handleBack}>Назад</button>
                  <button className="btn btn-primary" type="submit">Сохранить</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 