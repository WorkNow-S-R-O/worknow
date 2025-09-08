import { useState } from "react";
import { useIntlayer } from 'react-intlayer';
import useFetchCities from '../../hooks/useFetchCities';
import useFetchCategories from '../../hooks/useFetchCategories';
import PropTypes from 'prop-types';

export default function AddSeekerModal({ show, onClose, onSubmit }) {
  const content = useIntlayer("addSeekerModal");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    contact: '',
    city: '',
    description: '',
    gender: '',
    isDemanded: false,
    facebook: '',
    languages: [],
    nativeLanguage: '',
    category: '',
    employment: '',
    documents: '',
    note: '',
    announcement: '',
    documentType: '',
  });
  const [error, setError] = useState(null);

  const languageOptions = [
    { value: 'русский', label: content.languageRussian.value },
    { value: 'арабский', label: content.languageArabic.value },
    { value: 'английский', label: content.languageEnglish.value },
    { value: 'иврит', label: content.languageHebrew.value },
  ];

  const { cities, loading: loadingCities } = useFetchCities();
  const { categories, loading: loadingCategories } = useFetchCategories();

  const employmentOptions = [
    { value: 'полная', label: content.employmentFull.value },
    { value: 'частичная', label: content.employmentPartial.value },
  ];

  const documentTypeOptions = [
    { value: 'Виза Б1', label: content.documentVisaB1.value },
    { value: 'Виза Б2', label: content.documentVisaB2.value },
    { value: 'Теудат Зеут', label: content.documentTeudatZehut.value },
    { value: 'Рабочая виза', label: content.documentWorkVisa.value },
    { value: 'Другое', label: content.documentOther.value },
  ];

  if (!show) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.city || !form.description || !form.gender) {
      setError(content.fillAllFieldsError.value);
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'languages') {
      setForm(f => {
        let langs = f.languages || [];
        if (checked) {
          langs = [...langs, value];
        } else {
          langs = langs.filter(l => l !== value);
        }
        // если убрали родной язык из списка языков — сбросить nativeLanguage
        const nativeLanguage = langs.includes(f.nativeLanguage) ? f.nativeLanguage : '';
        return { ...f, languages: langs, nativeLanguage };
      });
    } else if (name === 'nativeLanguage') {
      setForm(f => ({ ...f, nativeLanguage: value }));
    } else if (type === 'radio') {
      setForm(f => ({ ...f, [name]: value }));
    } else if (type === 'checkbox' && name !== 'languages') {
      setForm(f => ({ ...f, [name]: checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nativeLanguage || form.languages.length === 0) {
      setError(content.languageSelectionError.value);
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="modal show fade" style={{ 
      display: 'block', 
      background: 'rgba(0,0,0,0.5)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1050
    }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" style={{
        margin: window.innerWidth <= 768 ? '10px' : '1.75rem auto',
        maxWidth: window.innerWidth <= 768 ? 'calc(100% - 20px)' : '700px'
      }}>
        <div className="modal-content" style={{ 
          borderRadius: 10, 
          minWidth: window.innerWidth <= 768 ? 'auto' : 500, 
          maxWidth: window.innerWidth <= 768 ? '100%' : 700,
          border: '1px solid #e9ecef',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.13)',
          overflow: 'hidden'
        }}>
          <div className="modal-header" style={{
            borderBottom: '1px solid #eee',
            padding: window.innerWidth <= 768 ? '16px 20px' : '20px 24px',
            background: 'white'
          }}>
            <h4 className="modal-title" style={{
              fontSize: window.innerWidth <= 768 ? '18px' : '20px',
              fontWeight: '600',
              color: '#495057',
              margin: 0
            }}>
              {content.addSeeker.value}
            </h4>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              style={{
                fontSize: window.innerWidth <= 768 ? '20px' : '18px',
                color: '#6c757d'
              }}
            ></button>
          </div>
          <div className="modal-body" style={{
            padding: window.innerWidth <= 768 ? '16px 20px' : '20px 24px',
            maxHeight: window.innerWidth <= 768 ? '70vh' : '60vh',
            overflowY: 'auto'
          }}>
            {step === 1 && (
              <form onSubmit={handleNext}>
                <div className="mb-3">
                  <input name="name" className="form-control" placeholder={content.namePlaceholder.value} value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <input name="contact" className="form-control" placeholder={content.phonePlaceholder.value} value={form.contact} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <input name="facebook" className="form-control" placeholder={content.facebookPlaceholder.value} value={form.facebook} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <select
                    name="city"
                    className="form-control"
                    value={form.city}
                    onChange={handleChange}
                    required
                    disabled={loadingCities}
                  >
                    <option value="">{content.locationPlaceholder.value}</option>
                    {cities.map(city => (
                      <option key={city.value} value={city.label}>{city.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <textarea name="description" className="form-control" placeholder={content.briefDescriptionPlaceholder.value} value={form.description} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">{content.genderLabel.value}</label><br />
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="gender" id="gender-male" value="мужчина" checked={form.gender === 'мужчина'} onChange={handleChange} required />
                    <label className="form-check-label" htmlFor="gender-male">{content.genderMale.value}</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="gender" id="gender-female" value="женщина" checked={form.gender === 'женщина'} onChange={handleChange} required />
                    <label className="form-check-label" htmlFor="gender-female">{content.genderFemale.value}</label>
                  </div>
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" name="isDemanded" id="isDemanded" checked={form.isDemanded} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="isDemanded">
                    {content.demanded.value}
                  </label>
                </div>
                {error && <div className="text-danger mb-2">{error}</div>}
                <button className="btn btn-primary" type="submit">{content.nextButton.value}</button>
              </form>
            )}
            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">{content.languagesLabel.value}</label><br />
                  {languageOptions.map(opt => (
                    <div className="form-check form-check-inline" key={opt.value}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="languages"
                        value={opt.value}
                        checked={form.languages.includes(opt.value)}
                        onChange={handleChange}
                        id={`lang-${opt.value}`}
                      />
                      <label className="form-check-label" htmlFor={`lang-${opt.value}`}>{opt.label}</label>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <label className="form-label">{content.nativeLanguageLabel.value}</label><br />
                  {form.languages.map(lang => (
                    <div className="form-check form-check-inline" key={lang}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="nativeLanguage"
                        value={lang}
                        checked={form.nativeLanguage === lang}
                        onChange={handleChange}
                        id={`native-${lang}`}
                      />
                      <label className="form-check-label" htmlFor={`native-${lang}`}>{lang}</label>
                    </div>
                  ))}
                </div>
                <div className="mb-3">
                  <select
                    name="category"
                    className="form-control"
                    value={form.category}
                    onChange={handleChange}
                    required
                    disabled={loadingCategories}
                  >
                    <option value="">{content.categoryPlaceholder.value}</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.label}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <select
                    name="employment"
                    className="form-control"
                    value={form.employment}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{content.employmentTypePlaceholder.value}</option>
                    {employmentOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <select
                    name="documentType"
                    className="form-control"
                    value={form.documentType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{content.documentTypePlaceholder.value}</option>
                    {documentTypeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <textarea name="announcement" className="form-control" placeholder={content.announcementPlaceholder.value} value={form.announcement} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <textarea name="note" className="form-control" placeholder={content.notePlaceholder.value} value={form.note} onChange={handleChange} />
                </div>
                {error && <div className="text-danger mb-2">{error}</div>}
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={handleBack}>{content.backButton.value}</button>
                  <button className="btn btn-success" type="submit">{content.saveButton.value}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );

} 
AddSeekerModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};