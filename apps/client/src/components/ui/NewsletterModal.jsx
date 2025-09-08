import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntlayer, useLocale } from 'react-intlayer';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import VerificationModal from './VerificationModal.jsx';

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
  
  // Verification state
  const [showVerification, setShowVerification] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  
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
  const content = useIntlayer("newsletterModal");
  const { locale } = useLocale();
  const { user, isLoaded } = useUser();

  // Determine if mobile
  const isMobile = window.innerWidth <= 768;

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  // Filter options with translations
  const languageOptions = [
    { value: 'русский', label: content.languageRussian.value },
    { value: 'украинский', label: content.languageUkrainian.value },
    { value: 'английский', label: content.languageEnglish.value },
    { value: 'иврит', label: content.languageHebrew.value },
  ];

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

  const genderOptions = [
    { value: 'мужчина', label: content.genderMale.value },
    { value: 'женщина', label: content.genderFemale.value },
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
        fetch(`${API_URL}/api/cities?lang=${language}`).then(res => res.json()),
        fetch(`${API_URL}/api/categories?lang=${language}`).then(res => res.json())
      ]).then(([citiesData, categoriesData]) => {
        setCities(citiesData);
        setCategories(categoriesData);
      }).catch(error => {
        console.error('Error fetching filter data:', error);
        setCities([]);
        setCategories([]);
      });
    }
  }, [open, isLoaded, user, language]);

  const handleSubscribe = async () => {
    if (!email || !email.trim()) {
      toast.error(content.newsletterEmailRequired.value);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(content.newsletterInvalidEmail.value);
      return;
    }

    setIsSubscribing(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/newsletter/send-verification`, {
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
        toast.success(content.verificationCodeSent.value);
        // Store subscription data and show verification modal
        setSubscriptionData(response.data.subscriptionData);
        setShowVerification(true);
      } else {
        toast.error(response.data.message || content.newsletterError.value);
      }
    } catch (error) {
      console.error('Newsletter verification error:', error);
      if (error.response?.status === 409) {
        toast.error('Этот email уже подписан на рассылку');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(content.newsletterError.value);
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle unsubscribe
  const handleUnsubscribe = async () => {
    if (!email || !email.trim()) {
      toast.error(content.newsletterEmailRequired.value);
      return;
    }

    setIsUnsubscribing(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/newsletter/unsubscribe`, {
        email: email.trim()
      });

      if (response.data.success) {
        toast.success(content.newsletterUnsubscribeSuccess.value);
        setIsAlreadySubscribed(false);
        setSubscriberData(null);
        setEmail('');
        setFirstName('');
        setLastName('');
        onClose();
      } else {
        toast.error(response.data.message || content.newsletterUnsubscribeError.value);
      }
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(content.newsletterUnsubscribeError.value);
      }
    } finally {
      setIsUnsubscribing(false);
    }
  };

  // Handle verification success
  const handleVerificationSuccess = (subscriber) => {
    setIsAlreadySubscribed(true);
    setSubscriberData(subscriber);
    setShowVerification(false);
    onClose();
  };

  // Handle verification modal close
  const handleVerificationClose = () => {
    setShowVerification(false);
    setSubscriptionData(null);
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
    <>
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
              {content.newsletterTitle.value}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close" 
              onClick={onClose} 
              style={{ fontSize: '15px' }}
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
              {content.newsletterTitle.value}
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
                    {content.newsletterAlreadySubscribed.value}
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
                {content.newsletterDescription.value}
              </p>
            )}
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                fontSize: isMobile ? '16px' : '14px', 
                fontWeight: '500', 
                marginBottom: '8px', 
                display: 'block' 
              }}>
                {content.newsletterFirstName.value}
              </label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={content.newsletterFirstNamePlaceholder.value}
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
                {content.newsletterLastName.value}
              </label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={content.newsletterLastNamePlaceholder.value}
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
                {content.newsletterEmailLabel.value}
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={handleEmailChange}
                placeholder={content.newsletterEmailPlaceholder.value}
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
                          {content.city.value}
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
                          {content.category.value}
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
                          {content.employment.value}
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
                          {content.documentType.value}
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
                          {content.gender.value}
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
                        {content.languages.value}
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
                          {content.demanded.value}
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
                          {content.city.value}
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
                          {content.category.value}
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
                          {content.employment.value}
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
                          {content.documentType.value}
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
                          {content.gender.value}
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
                          {content.languages.value}
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
                            {content.demanded.value}
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
                    {content.newsletterAlreadySubscribed.value}
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
                        {content.newsletterUnsubscribing.value}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-envelope-x me-2"></i>
                        {content.unsubscribe.value}
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
                        {content.newsletterSubscribing.value}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-envelope-plus me-2"></i>
                        {content.newsletterSubscribe.value}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
      </div>
    </div>

    {/* Verification Modal */}
    <VerificationModal
      open={showVerification}
      onClose={handleVerificationClose}
      email={email}
      subscriptionData={subscriptionData}
      onVerificationSuccess={handleVerificationSuccess}
    />
  </>
  );
};

NewsletterModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NewsletterModal; 