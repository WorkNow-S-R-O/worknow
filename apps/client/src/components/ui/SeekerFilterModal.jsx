import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useLanguageStore from '../../store/languageStore';
import { useTranslation } from 'react-i18next';

const SeekerFilterModal = ({ open, onClose, onApply, currentFilters = {} }) => {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState(currentFilters.city || '');
  const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || '');
  const [selectedEmployment, setSelectedEmployment] = useState(currentFilters.employment || '');
  const [selectedDocumentType, setSelectedDocumentType] = useState(currentFilters.documentType || '');
  const [selectedLanguages, setSelectedLanguages] = useState(currentFilters.languages || []);
  const [selectedGender, setSelectedGender] = useState(currentFilters.gender || '');
  const [isDemanded, setIsDemanded] = useState(currentFilters.isDemanded || false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const modalRef = useRef();
  const language = useLanguageStore((state) => state.language) || 'ru';
  const { t } = useTranslation();

  const API_URL = import.meta.env.VITE_API_URL;

  // Language options with translations
  const languageOptions = [
    { value: 'русский', label: t('language_russian') || 'Русский' },
    { value: 'арабский', label: t('language_arabic') || 'Арабский' },
    { value: 'английский', label: t('language_english') || 'Английский' },
    { value: 'иврит', label: t('language_hebrew') || 'Иврит' },
  ];

  // Employment options with translations
  const employmentOptions = [
    { value: 'полная', label: t('employment_full') || 'Полная' },
    { value: 'частичная', label: t('employment_partial') || 'Частичная' },
  ];

  // Document type options with translations
  const documentTypeOptions = [
    { value: 'Виза Б1', label: t('document_visa_b1') || 'Виза Б1' },
    { value: 'Виза Б2', label: t('document_visa_b2') || 'Виза Б2' },
    { value: 'Теудат Зеут', label: t('document_teudat_zehut') || 'Теудат Зеут' },
    { value: 'Рабочая виза', label: t('document_work_visa') || 'Рабочая виза' },
    { value: 'Другое', label: t('document_other') || 'Другое' },
  ];

  // Gender options with translations
  const genderOptions = [
    { value: 'мужчина', label: t('gender_male') || 'Мужчина' },
    { value: 'женщина', label: t('gender_female') || 'Женщина' },
  ];

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
      setSelectedCity(currentFilters.city || '');
      setSelectedCategory(currentFilters.category || '');
      setSelectedEmployment(currentFilters.employment || '');
      setSelectedDocumentType(currentFilters.documentType || '');
      setSelectedLanguages(currentFilters.languages || []);
      setSelectedGender(currentFilters.gender || '');
      setIsDemanded(currentFilters.isDemanded || false);
      
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
      
      // Fetch cities and categories
      Promise.all([
        fetch(`${API_URL}/api/cities?lang=${language}`).then(res => res.json()),
        fetch(`${API_URL}/api/categories?lang=${language}`).then(res => res.json())
      ]).then(([citiesData, categoriesData]) => {
        console.log('🏙️ Cities data:', citiesData);
        console.log('📂 Categories data:', categoriesData);
        setCities(citiesData);
        setCategories(categoriesData);
      }).catch(error => {
        console.error('❌ Error fetching data:', error);
        setCities([]);
        setCategories([]);
      });
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

  const handleLanguageChange = (languageValue, checked) => {
    console.log('🗣️ Language change:', languageValue, checked);
    if (checked) {
      setSelectedLanguages(prev => {
        const newValue = [...prev, languageValue];
        console.log('➕ Adding language, new array:', newValue);
        return newValue;
      });
    } else {
      setSelectedLanguages(prev => {
        const newValue = prev.filter(lang => lang !== languageValue);
        console.log('➖ Removing language, new array:', newValue);
        return newValue;
      });
    }
  };

  const handleApply = () => {
    console.log('🔍 Modal state values when applying:', {
      selectedCity,
      selectedCategory,
      selectedEmployment,
      selectedDocumentType,
      selectedLanguages,
      selectedGender,
      isDemanded
    });
    
    const filtersToApply = {
      city: selectedCity && selectedCity.trim() !== '' ? selectedCity : undefined,
      category: selectedCategory && selectedCategory.trim() !== '' ? selectedCategory : undefined,
      employment: selectedEmployment && selectedEmployment.trim() !== '' ? selectedEmployment : undefined,
      documentType: selectedDocumentType && selectedDocumentType.trim() !== '' ? selectedDocumentType : undefined,
      languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
      gender: selectedGender && selectedGender.trim() !== '' ? selectedGender : undefined,
      isDemanded: isDemanded ? true : undefined,
    };
    
    console.log('🎯 Filters to apply:', filtersToApply);
    onApply(filtersToApply);
    onClose();
  };

  const handleReset = () => {
    setSelectedCity('');
    setSelectedCategory('');
    setSelectedEmployment('');
    setSelectedDocumentType('');
    setSelectedLanguages([]);
    setSelectedGender('');
    setIsDemanded(false);
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
        padding: 20, 
        width: 800, 
        height: 700,
        maxWidth: '90vw',
        maxHeight: '90vh',
        boxShadow: '0 4px 32px rgba(0,0,0,0.15)', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      };

  const renderCheckbox = (label, checked, onChange, id) => (
    <div className="form-check mb-3" style={{ marginLeft: '8px' }}>
      <input
        className="form-check-input"
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        style={{ 
          transform: 'scale(1.2)', 
          zIndex: 10,
          position: 'relative'
        }}
      />
      <label className="form-check-label" htmlFor={id} style={{ fontSize: isMobile ? '16px' : '14px' }}>
        {label}
      </label>
    </div>
  );



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
            <h5 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>{t('filter_modal_title') || 'Фильтры'}</h5>
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
            <h5 className='mb-4 font-size-10'>{t('filter_modal_title') || 'Фильтры'}</h5>
          </>
        )}
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {console.log('🏙️ Cities:', cities)}
          {console.log('📂 Categories:', categories)}
          {console.log('💼 Employment options:', employmentOptions)}
          {console.log('📄 Document type options:', documentTypeOptions)}
          {console.log('👤 Gender options:', genderOptions)}
          {console.log('🗣️ Language options:', languageOptions)}
          
          {isMobile ? (
            // Mobile layout - single column
            <>
              {/* City Select */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  marginBottom: '8px', 
                  display: 'block' 
                }}>
                  {t('city') || 'Город'}
                </label>
                <select 
                  className="form-select" 
                  value={selectedCity || ''} 
                  onChange={(e) => {
                    console.log('🏙️ City changed:', e.target.value);
                    setSelectedCity(e.target.value);
                  }}
                  style={{ 
                    fontSize: '16px', 
                    padding: '12px', 
                    margin: '0 8px', 
                    width: '90%' 
                  }}
                >
                  <option value="">{t('choose_city') || 'Выбрать город'}</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Category Select */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  marginBottom: '8px', 
                  display: 'block' 
                }}>
                  {t('category') || 'Категория'}
                </label>
                <select 
                  className="form-select" 
                  value={selectedCategory || ''} 
                  onChange={(e) => {
                    console.log('📂 Category changed:', e.target.value);
                    setSelectedCategory(e.target.value);
                  }}
                  style={{ 
                    fontSize: '16px', 
                    padding: '12px', 
                    margin: '0 8px', 
                    width: '90%' 
                  }}
                >
                  <option value="">{t('choose_category') || 'Выбрать категорию'}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.label || cat.name}>
                      {cat.label || cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Employment Select */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  marginBottom: '8px', 
                  display: 'block' 
                }}>
                  {t('employment') || 'Тип занятости'}
                </label>
                <select 
                  className="form-select" 
                  value={selectedEmployment || ''} 
                  onChange={(e) => {
                    console.log('💼 Employment changed:', e.target.value);
                    setSelectedEmployment(e.target.value);
                  }}
                  style={{ 
                    fontSize: '16px', 
                    padding: '12px', 
                    margin: '0 8px', 
                    width: '90%' 
                  }}
                >
                  <option value="">{t('choose_employment') || 'Выбрать тип занятости'}</option>
                  {employmentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Document Type Select */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  marginBottom: '8px', 
                  display: 'block' 
                }}>
                  {t('document_type') || 'Тип документа'}
                </label>
                <select 
                  className="form-select" 
                  value={selectedDocumentType || ''} 
                  onChange={(e) => {
                    console.log('📄 Document type changed:', e.target.value);
                    setSelectedDocumentType(e.target.value);
                  }}
                  style={{ 
                    fontSize: '16px', 
                    padding: '12px', 
                    margin: '0 8px', 
                    width: '90%' 
                  }}
                >
                  <option value="">{t('choose_document_type') || 'Выбрать тип документа'}</option>
                  {documentTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              

              
              {/* Gender Select */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '500', 
                  marginBottom: '8px', 
                  display: 'block' 
                }}>
                  {t('gender') || 'Пол'}
                </label>
                <select 
                  className="form-select" 
                  value={selectedGender || ''} 
                  onChange={(e) => {
                    console.log('👤 Gender changed:', e.target.value);
                    setSelectedGender(e.target.value);
                  }}
                  style={{ 
                    fontSize: '16px', 
                    padding: '12px', 
                    margin: '0 8px', 
                    width: '90%' 
                  }}
                >
                  <option value="">{t('choose_gender') || 'Выбрать пол'}</option>
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {renderCheckbox(
                t('demanded') || 'Востребованный кандидат',
                isDemanded,
                e => {
                  console.log('⭐ Demanded changed:', e.target.checked);
                  setIsDemanded(e.target.checked);
                },
                'demandedSwitch'
              )}
            </>
          ) : (
            // Desktop layout - two columns
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Left Column */}
              <div>
                {/* City Select */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    {t('city') || 'Город'}
                  </label>
                  <select 
                    className="form-select" 
                    value={selectedCity || ''} 
                    onChange={(e) => {
                      console.log('🏙️ City changed:', e.target.value);
                      setSelectedCity(e.target.value);
                    }}
                    style={{ 
                      fontSize: '14px', 
                      padding: '8px', 
                      margin: '0 8px', 
                      width: '90%' 
                    }}
                  >
                    <option value="">{t('choose_city') || 'Выбрать город'}</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Category Select */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    {t('category') || 'Категория'}
                  </label>
                  <select 
                    className="form-select" 
                    value={selectedCategory || ''} 
                    onChange={(e) => {
                      console.log('📂 Category changed:', e.target.value);
                      setSelectedCategory(e.target.value);
                    }}
                    style={{ 
                      fontSize: '14px', 
                      padding: '8px', 
                      margin: '0 8px', 
                      width: '90%' 
                    }}
                  >
                    <option value="">{t('choose_category') || 'Выбрать категорию'}</option>
                                      {categories.map(cat => (
                    <option key={cat.id} value={cat.label || cat.name}>
                      {cat.label || cat.name}
                    </option>
                  ))}
                  </select>
                </div>
                
                {/* Employment Select */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    {t('employment') || 'Тип занятости'}
                  </label>
                  <select 
                    className="form-select" 
                    value={selectedEmployment || ''} 
                    onChange={(e) => {
                      console.log('💼 Employment changed:', e.target.value);
                      setSelectedEmployment(e.target.value);
                    }}
                    style={{ 
                      fontSize: '14px', 
                      padding: '8px', 
                      margin: '0 8px', 
                      width: '90%' 
                    }}
                  >
                    <option value="">{t('choose_employment') || 'Выбрать тип занятости'}</option>
                    {employmentOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Document Type Select */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    {t('document_type') || 'Тип документа'}
                  </label>
                  <select 
                    className="form-select" 
                    value={selectedDocumentType || ''} 
                    onChange={(e) => {
                      console.log('📄 Document type changed:', e.target.value);
                      setSelectedDocumentType(e.target.value);
                    }}
                    style={{ 
                      fontSize: '14px', 
                      padding: '8px', 
                      margin: '0 8px', 
                      width: '90%' 
                    }}
                  >
                    <option value="">{t('choose_document_type') || 'Выбрать тип документа'}</option>
                    {documentTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Right Column */}
              <div>
                {/* Gender Select */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    {t('gender') || 'Пол'}
                  </label>
                  <select 
                    className="form-select" 
                    value={selectedGender || ''} 
                    onChange={(e) => {
                      console.log('👤 Gender changed:', e.target.value);
                      setSelectedGender(e.target.value);
                    }}
                    style={{ 
                      fontSize: '14px', 
                      padding: '8px', 
                      margin: '0 8px', 
                      width: '90%' 
                    }}
                  >
                    <option value="">{t('choose_gender') || 'Выбрать пол'}</option>
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Languages Section */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    {t('languages') || 'Языки'}
                  </label>
                  <div style={{ marginLeft: '8px' }}>
                    {languageOptions.map((option) => {
                      console.log(`🗣️ Rendering language option:`, option, `checked:`, selectedLanguages.includes(option.value));
                      return (
                        <div className="form-check" key={option.value}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`lang-${option.value}`}
                            checked={selectedLanguages.includes(option.value)}
                            onChange={(e) => {
                              console.log(`🗣️ Language checkbox clicked:`, option.value, e.target.checked);
                              handleLanguageChange(option.value, e.target.checked);
                            }}
                            style={{ 
                              transform: 'scale(1.2)', 
                              zIndex: 10,
                              position: 'relative'
                            }}
                          />
                          <label className="form-check-label" htmlFor={`lang-${option.value}`} style={{ fontSize: '14px' }}>
                            {option.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Demanded Checkbox */}
                {renderCheckbox(
                  t('demanded') || 'Востребованный кандидат',
                  isDemanded,
                  e => {
                    console.log('⭐ Demanded changed:', e.target.checked);
                    setIsDemanded(e.target.checked);
                  },
                  'demandedSwitch'
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="d-flex justify-content-between mt-4" style={{ marginTop: isMobile ? 'auto' : '16px', paddingTop: isMobile ? '20px' : '0' }}>
          <button 
            className="btn btn-outline-secondary" 
            onClick={handleReset}
            style={{ fontSize: isMobile ? '16px' : '14px', padding: isMobile ? '12px 20px' : '8px 16px' }}
          >
            {t('reset') || 'Сбросить'}
          </button>
          <button 
            className="btn btn-primary px-4" 
            onClick={handleApply}
            style={{ fontSize: isMobile ? '16px' : '14px', padding: isMobile ? '12px 24px' : '8px 16px' }}
          >
            {t('save') || 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

SeekerFilterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  currentFilters: PropTypes.shape({
    city: PropTypes.string,
    category: PropTypes.string,
    employment: PropTypes.string,
    documentType: PropTypes.string,
    languages: PropTypes.array,
    gender: PropTypes.string,
    isDemanded: PropTypes.bool,
  }),
};

export default SeekerFilterModal; 