import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const NewsletterModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
  const [subscriberData, setSubscriberData] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Filter preferences state
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedEmployment, setSelectedEmployment] = useState([]);
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [onlyDemanded, setOnlyDemanded] = useState(false);
  
  const modalRef = useRef();
  const { t } = useTranslation();
  const { user, isLoaded } = useUser();

  // Determine if mobile
  const isMobile = window.innerWidth <= 768;

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  // Filter options
  const languageOptions = [
    { value: 'русский', label: 'Русский' },
    { value: 'украинский', label: 'Украинский' },
    { value: 'английский', label: 'Английский' },
    { value: 'иврит', label: 'Иврит' },
  ];

  const employmentOptions = [
    { value: 'полная', label: 'Полная' },
    { value: 'частичная', label: 'Частичная' },
  ];

  const documentTypeOptions = [
    { value: 'Виза Б1', label: 'Виза Б1' },
    { value: 'Виза Б2', label: 'Виза Б2' },
    { value: 'Теудат Зеут', label: 'Теудат Зеут' },
    { value: 'Рабочая виза', label: 'Рабочая виза' },
    { value: 'Другое', label: 'Другое' },
  ];

  const genderOptions = [
    { value: 'мужчина', label: 'Мужчина' },
    { value: 'женщина', label: 'Женщина' },
  ];
  
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

  // Handle outside click for desktop
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  // Check subscription status for an email
  const checkSubscriptionStatus = async (email) => {
    if (!email || !email.trim() || !email.includes('@')) {
      setIsAlreadySubscribed(false);
      setSubscriberData(null);
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/api/newsletter/check-subscription`, {
        params: { email: email.trim() }
      });
      
      if (response.data.isSubscribed) {
        setIsAlreadySubscribed(true);
        setSubscriberData(response.data.subscriber);
        // Pre-fill the form with existing data
        if (response.data.subscriber) {
          setFirstName(response.data.subscriber.firstName || '');
          setLastName(response.data.subscriber.lastName || '');
          // Pre-fill filter preferences
          setSelectedCities(response.data.subscriber.preferredCities || []);
          setSelectedCategories(response.data.subscriber.preferredCategories || []);
          setSelectedEmployment(response.data.subscriber.preferredEmployment || []);
          setSelectedLanguages(response.data.subscriber.preferredLanguages || []);
          setSelectedGender(response.data.subscriber.preferredGender || '');
          setSelectedDocumentTypes(response.data.subscriber.preferredDocumentTypes || []);
          setOnlyDemanded(response.data.subscriber.onlyDemanded || false);
        }
      } else {
        setIsAlreadySubscribed(false);
        setSubscriberData(null);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsAlreadySubscribed(false);
      setSubscriberData(null);
    }
  };

  // Check for logged-in user's email when modal opens
  useEffect(() => {
    if (open && isLoaded) {
      if (user && user.primaryEmailAddress?.emailAddress) {
        const userEmail = user.primaryEmailAddress.emailAddress;
        setEmail(userEmail);
        checkSubscriptionStatus(userEmail);
      } else {
        // If no user is logged in, clear the form
        setEmail('');
        setFirstName('');
        setLastName('');
        setIsAlreadySubscribed(false);
        setSubscriberData(null);
      }
      
      // Fetch cities and categories for filter options
      Promise.all([
        fetch(`${API_URL}/api/cities?lang=ru`).then(res => res.json()),
        fetch(`${API_URL}/api/categories?lang=ru`).then(res => res.json())
      ]).then(([citiesData, categoriesData]) => {
        setCities(citiesData);
        setCategories(categoriesData);
      }).catch(error => {
        console.error('Error fetching filter data:', error);
        setCities([]);
        setCategories([]);
      });
    }
  }, [open, isLoaded, user]);

  const handleSubscribe = async () => {
    if (!email || !email.trim()) {
      toast.error(t('newsletter_email_required') || 'Пожалуйста, введите email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(t('newsletter_invalid_email') || 'Пожалуйста, введите корректный email');
      return;
    }

    setIsSubscribing(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/newsletter/subscribe`, {
        email: email.trim(),
        firstName: firstName.trim() || null,
        lastName: lastName.trim() || null,
        language: 'ru', // Default to Russian
        preferences: {},
        // Filter preferences
        preferredCities: selectedCities,
        preferredCategories: selectedCategories,
        preferredEmployment: selectedEmployment,
        preferredLanguages: selectedLanguages,
        preferredGender: selectedGender || null,
        preferredDocumentTypes: selectedDocumentTypes,
        onlyDemanded
      });

      if (response.data.success) {
        toast.success(t('newsletter_success') || 'Вы успешно подписались на рассылку!');
        // Set as subscribed after successful subscription
        setIsAlreadySubscribed(true);
        setSubscriberData(response.data.subscriber);
        onClose();
      } else {
        toast.error(response.data.message || t('newsletter_error') || 'Ошибка при подписке на рассылку');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      if (error.response?.status === 409) {
        toast.error('Этот email уже подписан на рассылку');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t('newsletter_error') || 'Ошибка при подписке на рассылку');
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle unsubscribe
  const handleUnsubscribe = async () => {
    if (!email || !email.trim()) {
      toast.error(t('newsletter_email_required') || 'Пожалуйста, введите email');
      return;
    }

    setIsUnsubscribing(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/newsletter/unsubscribe`, {
        email: email.trim()
      });

      if (response.data.success) {
        toast.success(t('newsletter_unsubscribe_success') || 'Вы успешно отписались от рассылки!');
        setIsAlreadySubscribed(false);
        setSubscriberData(null);
        setEmail('');
        setFirstName('');
        setLastName('');
        onClose();
      } else {
        toast.error(response.data.message || t('newsletter_unsubscribe_error') || 'Ошибка при отписке от рассылки');
      }
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t('newsletter_unsubscribe_error') || 'Ошибка при отписке от рассылки');
      }
    } finally {
      setIsUnsubscribing(false);
    }
  };

  // Handle email change (only for new subscriptions or when user is not logged in)
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Only check subscription status if user is not already subscribed
    if (!isAlreadySubscribed && newEmail && newEmail.includes('@')) {
      // Add a small delay to avoid too many API calls
      setTimeout(() => {
        checkSubscriptionStatus(newEmail);
      }, 500);
    }
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
        width: 900, 
        height: 900,
        maxWidth: '95vw',
        maxHeight: '95vh',
        boxShadow: '0 4px 32px rgba(0,0,0,0.15)', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      };

  if (!open) return null;

  return (
    <div 
      style={modalStyle}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
      onMouseDown={!isMobile ? handleOutsideClick : undefined}
    >
      <div ref={modalRef} style={contentStyle}>
        {isMobile ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h5 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
              {t('newsletter_title') || 'Подписка на рассылку'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={onClose} 
              style={{ fontSize: '24px' }}
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
                fontSize: '16px' 
              }}
            ></button>
            <h5 className='mb-4 font-size-10'>
              {t('newsletter_title') || 'Подписка на рассылку'}
            </h5>
          </>
        )}
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            {isAlreadySubscribed ? (
              // Already subscribed view
              <div style={{ 
                backgroundColor: '#e8f5e8', 
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                border: '1px solid #d4edda'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                  <i className="bi bi-check-circle-fill" style={{ color: '#28a745', fontSize: '24px', marginRight: '10px' }}></i>
                  <h6 style={{ margin: 0, color: '#155724' }}>
                    {t('newsletter_already_subscribed') || 'Вы уже подписаны на рассылку!'}
                  </h6>
                </div>
                <p style={{ margin: 0, color: '#155724', fontSize: '14px' }}>
                  {subscriberData?.firstName && subscriberData?.lastName 
                    ? `${subscriberData.firstName} ${subscriberData.lastName} (${email})`
                    : email
                  }
                </p>
              </div>
            ) : (
              // Subscribe view
              <p style={{ 
                fontSize: isMobile ? '16px' : '14px', 
                color: '#666', 
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                {t('newsletter_description') || 'Подпишитесь на нашу рассылку, чтобы получать уведомления о новых соискателях и обновлениях платформы.'}
              </p>
            )}
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                fontSize: isMobile ? '16px' : '14px', 
                fontWeight: '500', 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                {t('newsletter_first_name') || 'Имя (необязательно)'}
              </label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t('newsletter_first_name_placeholder') || 'Введите ваше имя'}
                style={{ 
                  fontSize: isMobile ? '16px' : '14px', 
                  padding: isMobile ? '12px' : '8px',
                  width: '100%'
                }}
                disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                fontSize: isMobile ? '16px' : '14px', 
                fontWeight: '500', 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                {t('newsletter_last_name') || 'Фамилия (необязательно)'}
              </label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t('newsletter_last_name_placeholder') || 'Введите вашу фамилию'}
                style={{ 
                  fontSize: isMobile ? '16px' : '14px', 
                  padding: isMobile ? '12px' : '8px',
                  width: '100%'
                }}
                disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                fontSize: isMobile ? '16px' : '14px', 
                fontWeight: '500', 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                {t('newsletter_email_label') || 'Email адрес *'}
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={handleEmailChange}
                placeholder={t('newsletter_email_placeholder') || 'Введите ваш email'}
                style={{ 
                  fontSize: isMobile ? '16px' : '14px', 
                  padding: isMobile ? '12px' : '8px',
                  width: '100%'
                }}
                disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
                required
              />
            </div>
            
            {/* Filter Preferences Section */}
            {!isAlreadySubscribed && (
              <div style={{ marginBottom: '20px' }}>
                <h6 style={{ marginBottom: '16px', fontSize: isMobile ? '16px' : '14px', fontWeight: '600', color: '#333' }}>
                  Получать уведомления о кандидатах:
                </h6>
                
                {isMobile ? (
                  // Mobile layout - single column
                  <>
                                          {/* Cities */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                          fontSize: '16px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('city') || 'Города'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                          {cities.map(city => (
                            <div key={city.id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`city-${city.id}`}
                                checked={selectedCities.includes(city.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCities([...selectedCities, city.name]);
                                  } else {
                                    setSelectedCities(selectedCities.filter(c => c !== city.name));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`city-${city.id}`} style={{ fontSize: '16px' }}>
                                {city.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Categories */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                          fontSize: '16px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('category') || 'Категории'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                          {categories.map(cat => (
                            <div key={cat.id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`cat-${cat.id}`}
                                checked={selectedCategories.includes(cat.label || cat.name)}
                                onChange={(e) => {
                                  const value = cat.label || cat.name;
                                  if (e.target.checked) {
                                    setSelectedCategories([...selectedCategories, value]);
                                  } else {
                                    setSelectedCategories(selectedCategories.filter(c => c !== value));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`cat-${cat.id}`} style={{ fontSize: '16px' }}>
                                {cat.label || cat.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Employment Types */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                          fontSize: '16px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('employment') || 'Тип занятости'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                          {employmentOptions.map(option => (
                            <div key={option.value} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`emp-${option.value}`}
                                checked={selectedEmployment.includes(option.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedEmployment([...selectedEmployment, option.value]);
                                  } else {
                                    setSelectedEmployment(selectedEmployment.filter(emp => emp !== option.value));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`emp-${option.value}`} style={{ fontSize: '16px' }}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Document Types */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                          fontSize: '16px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('document_type') || 'Тип документа'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                          {documentTypeOptions.map(option => (
                            <div key={option.value} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`doc-${option.value}`}
                                checked={selectedDocumentTypes.includes(option.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDocumentTypes([...selectedDocumentTypes, option.value]);
                                  } else {
                                    setSelectedDocumentTypes(selectedDocumentTypes.filter(doc => doc !== option.value));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`doc-${option.value}`} style={{ fontSize: '16px' }}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Gender */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                          fontSize: '16px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('gender') || 'Пол'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                          {genderOptions.map(option => (
                            <div key={option.value} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`gender-${option.value}`}
                                checked={selectedGender.includes(option.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedGender([...selectedGender, option.value]);
                                  } else {
                                    setSelectedGender(selectedGender.filter(g => g !== option.value));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`gender-${option.value}`} style={{ fontSize: '16px' }}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    
                    {/* Languages */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ 
                        fontSize: '16px', 
                        fontWeight: '500', 
                        marginBottom: '8px', 
                        display: 'block' 
                      }}>
                        {t('languages') || 'Языки'}
                      </label>
                      <div style={{ marginLeft: '8px' }}>
                        {languageOptions.map((option) => (
                          <div className="form-check" key={option.value}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`lang-${option.value}`}
                              checked={selectedLanguages.includes(option.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLanguages([...selectedLanguages, option.value]);
                                } else {
                                  setSelectedLanguages(selectedLanguages.filter(lang => lang !== option.value));
                                }
                              }}
                              disabled={isSubscribing || isUnsubscribing}
                              style={{ 
                                transform: 'scale(1.2)', 
                                zIndex: 10,
                                position: 'relative'
                              }}
                            />
                            <label className="form-check-label" htmlFor={`lang-${option.value}`} style={{ fontSize: '16px' }}>
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Only Demanded */}
                    <div style={{ marginBottom: '20px' }}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="onlyDemanded"
                          checked={onlyDemanded}
                          onChange={(e) => setOnlyDemanded(e.target.checked)}
                          disabled={isSubscribing || isUnsubscribing}
                          style={{ 
                            transform: 'scale(1.2)', 
                            zIndex: 10,
                            position: 'relative'
                          }}
                        />
                        <label className="form-check-label" htmlFor="onlyDemanded" style={{ fontSize: '16px' }}>
                          {t('demanded') || 'Востребованный кандидат'}
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  // Desktop layout - two columns
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Left Column */}
                    <div>
                      {/* Cities */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('city') || 'Города'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                          {cities.map(city => (
                            <div key={city.id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`city-${city.id}`}
                                checked={selectedCities.includes(city.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCities([...selectedCities, city.name]);
                                  } else {
                                    setSelectedCities(selectedCities.filter(c => c !== city.name));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`city-${city.id}`} style={{ fontSize: '14px' }}>
                                {city.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Categories */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('category') || 'Категории'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                          {categories.map(cat => (
                            <div key={cat.id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`cat-${cat.id}`}
                                checked={selectedCategories.includes(cat.label || cat.name)}
                                onChange={(e) => {
                                  const value = cat.label || cat.name;
                                  if (e.target.checked) {
                                    setSelectedCategories([...selectedCategories, value]);
                                  } else {
                                    setSelectedCategories(selectedCategories.filter(c => c !== value));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`cat-${cat.id}`} style={{ fontSize: '14px' }}>
                                {cat.label || cat.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Employment Types */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('employment') || 'Тип занятости'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                          {employmentOptions.map(option => (
                            <div key={option.value} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`emp-${option.value}`}
                                checked={selectedEmployment.includes(option.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedEmployment([...selectedEmployment, option.value]);
                                  } else {
                                    setSelectedEmployment(selectedEmployment.filter(emp => emp !== option.value));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`emp-${option.value}`} style={{ fontSize: '14px' }}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Document Types */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('document_type') || 'Тип документа'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                          {documentTypeOptions.map(option => (
                            <div key={option.value} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`doc-${option.value}`}
                                checked={selectedDocumentTypes.includes(option.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDocumentTypes([...selectedDocumentTypes, option.value]);
                                  } else {
                                    setSelectedDocumentTypes(selectedDocumentTypes.filter(doc => doc !== option.value));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`doc-${option.value}`} style={{ fontSize: '14px' }}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Column */}
                    <div>
                      {/* Gender */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                          fontSize: '14px', 
                          fontWeight: '500', 
                          marginBottom: '8px', 
                          display: 'block' 
                        }}>
                          {t('gender') || 'Пол'}
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                          {genderOptions.map(option => (
                            <div key={option.value} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`gender-${option.value}`}
                                checked={selectedGender.includes(option.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedGender([...selectedGender, option.value]);
                                  } else {
                                    setSelectedGender(selectedGender.filter(g => g !== option.value));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
                                style={{ 
                                  transform: 'scale(1.2)', 
                                  zIndex: 10,
                                  position: 'relative'
                                }}
                              />
                              <label className="form-check-label" htmlFor={`gender-${option.value}`} style={{ fontSize: '14px' }}>
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Languages */}
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
                          {languageOptions.map((option) => (
                            <div className="form-check" key={option.value}>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`lang-${option.value}`}
                                checked={selectedLanguages.includes(option.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLanguages([...selectedLanguages, option.value]);
                                  } else {
                                    setSelectedLanguages(selectedLanguages.filter(lang => lang !== option.value));
                                  }
                                }}
                                disabled={isSubscribing || isUnsubscribing}
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
                          ))}
                        </div>
                      </div>
                      
                      {/* Only Demanded */}
                      <div style={{ marginBottom: '16px' }}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="onlyDemanded"
                            checked={onlyDemanded}
                            onChange={(e) => setOnlyDemanded(e.target.checked)}
                            disabled={isSubscribing || isUnsubscribing}
                            style={{ 
                              transform: 'scale(1.2)', 
                              zIndex: 10,
                              position: 'relative'
                            }}
                          />
                          <label className="form-check-label" htmlFor="onlyDemanded" style={{ fontSize: '14px' }}>
                            {t('demanded') || 'Востребованный кандидат'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
            <div className="d-flex justify-content-between mt-4" style={{ 
              marginTop: '20px', 
              paddingTop: '20px',
              borderTop: '1px solid #e0e0e0'
            }}>
              {isAlreadySubscribed ? (
                // Show unsubscribe button and "Вы уже подписаны" text
                <>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#666',
                    fontSize: isMobile ? '16px' : '14px'
                  }}>
                    <i className="bi bi-info-circle me-2" style={{ color: '#17a2b8' }}></i>
                    {t('newsletter_already_subscribed') || 'Вы уже подписаны'}
                  </div>
                  <button 
                    className="btn btn-danger"
                    onClick={handleUnsubscribe}
                    disabled={isUnsubscribing}
                    style={{ 
                      fontSize: isMobile ? '16px' : '14px', 
                      padding: isMobile ? '12px 20px' : '8px 16px' 
                    }}
                  >
                    {isUnsubscribing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('newsletter_unsubscribing') || 'Отписка...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-envelope-x me-2"></i>
                        {t('unsubscribe') || 'Отписаться'}
                      </>
                    )}
                  </button>
                </>
              ) : (
                // Show only subscribe button (no reset button for new subscriptions)
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <button 
                    className="btn btn-primary px-4"
                    onClick={handleSubscribe}
                    disabled={isSubscribing || !email.trim()}
                    style={{ 
                      fontSize: isMobile ? '16px' : '14px', 
                      padding: isMobile ? '12px 24px' : '8px 16px',
                      minWidth: '200px'
                    }}
                  >
                    {isSubscribing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('newsletter_subscribing') || 'Подписка...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-envelope-plus me-2"></i>
                        {t('newsletter_subscribe') || 'Подписаться'}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
      </div>
    </div>
  );
};

NewsletterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NewsletterModal; 