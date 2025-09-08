import { useState, useEffect } from 'react';
import { useIntlayer, useLocale } from 'react-intlayer';
import { toast } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserSync } from '../hooks/useUserSync.js';
import VerificationModal from '../components/ui/VerificationModal.jsx';

const API_URL = import.meta.env.VITE_API_URL;

const NewsletterSubscription = () => {
  const content = useIntlayer("newsletterSubscription");
  const { locale } = useLocale();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
  const [subscriberData, setSubscriberData] = useState(null);
  
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
  const [selectedGender, setSelectedGender] = useState([]);
  const [onlyDemanded, setOnlyDemanded] = useState(false);
  
  // Loading states
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { dbUser } = useUserSync();

  // Check if user has premium access
  const hasPremiumAccess = dbUser?.isPremium || dbUser?.premiumDeluxe;
  
  // Determine if premium fields should be disabled
  // Disable if: not premium OR already subscribed (can't modify preferences)
  const shouldDisablePremiumFields = !hasPremiumAccess || isAlreadySubscribed;
  
  // Determine if premium upgrade messages should be shown
  // Show messages only for non-premium users (not for premium users who are already subscribed)
  const shouldShowPremiumMessages = !hasPremiumAccess;

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

  // Check for logged-in user's email when component mounts
  useEffect(() => {
    if (isLoaded) {
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
        fetch(`${API_URL}/api/cities?lang=${locale}`).then(res => res.json()),
        fetch(`${API_URL}/api/categories?lang=${locale}`).then(res => res.json())
      ]).then(([citiesData, categoriesData]) => {
        setCities(citiesData);
        setCategories(categoriesData);
        setIsLoadingCities(false);
        setIsLoadingCategories(false);
      }).catch(error => {
        console.error('Error fetching filter data:', error);
        setCities([]);
        setCategories([]);
        setIsLoadingCities(false);
        setIsLoadingCategories(false);
      });
    }
  }, [isLoaded, user, locale]);

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
          setSelectedGender(response.data.subscriber.preferredGender ? [response.data.subscriber.preferredGender] : []);
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
        preferredGender: selectedGender.length > 0 ? selectedGender[0] : null,
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
        navigate('/seekers');
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

  // Handle verification success
  const handleVerificationSuccess = (subscriber) => {
    setIsAlreadySubscribed(true);
    setSubscriberData(subscriber);
    setShowVerification(false);
    navigate('/seekers');
  };

  // Handle verification modal close
  const handleVerificationClose = () => {
    setShowVerification(false);
    setSubscriptionData(null);
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <div style={{ 
        width: '100%',
        minHeight: '100vh', 
        backgroundColor: '#fff',
        marginTop: '80px', // Add margin to avoid navbar
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
      }}>
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        padding: '20px'
      }}>
        {/* Header */}
        <div className="text-center mb-5">
          <div className="mb-4">
            <i className="bi bi-envelope-heart" style={{ 
              fontSize: '48px', 
              color: '#007bff',
              marginBottom: '16px'
            }}></i>
          </div>
          <h2 className="mb-3" style={{ color: '#333', fontWeight: '600' }}>
            {content.newsletterTitle.value}
          </h2>
          <p className="text-muted" style={{ fontSize: '18px', lineHeight: '1.6' }}>
            {content.newsletterDescription.value}
          </p>
        </div>

        {/* Already Subscribed View */}
        {isAlreadySubscribed && (
          <div className="text-center mb-4">
            <div className="alert alert-success d-inline-block" style={{ 
              backgroundColor: 'rgba(40, 167, 69, 0.1)', 
              border: '1px solid rgba(40, 167, 69, 0.2)',
              borderRadius: '8px',
              padding: '12px 20px'
            }}>
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745', fontSize: '18px' }}></i>
                <span style={{ color: '#155724', fontWeight: '500' }}>
                  {content.newsletterAlreadySubscribed.value}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="row">
          {/* Left Column - Basic Info */}
          <div className="col-12 col-lg-6">
            <h4 className="mb-4" style={{ color: '#333', fontWeight: '600' }}>
              <i className="bi bi-person-circle me-2" style={{ color: '#007bff' }}></i>
              {content.newsletterBasicInfo.value}
            </h4>
            
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px' }}>
                <i className="bi bi-person me-2" style={{ color: '#6c757d' }}></i>
                {content.newsletterFirst_name.value}
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={content.newsletterFirst_namePlaceholder.value}
                  disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
                  style={{ padding: '12px', borderRadius: '0 8px 8px 0' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px' }}>
                <i className="bi bi-person-badge me-2" style={{ color: '#6c757d' }}></i>
                {content.newsletterLast_name.value}
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person-badge"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={content.newsletterLast_namePlaceholder.value}
                  disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
                  style={{ padding: '12px', borderRadius: '0 8px 8px 0' }}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px' }}>
                <i className="bi bi-envelope me-2" style={{ color: '#6c757d' }}></i>
                {content.newsletterEmailLabel.value}
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={content.newsletterEmailPlaceholder.value}
                  disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
                  required
                  style={{ padding: '12px', borderRadius: '0 8px 8px 0' }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Filter Preferences */}
          <div className="col-12 col-lg-6">
            <h4 className="mb-4" style={{ color: '#333', fontWeight: '600' }}>
              <i className="bi bi-gear me-2" style={{ color: '#007bff' }}></i>
              {content.newsletterNotificationSettings.value}
            </h4>
            
            {/* General Premium Upgrade Banner */}
            {shouldShowPremiumMessages && (
              <div className="alert alert-warning mb-4" style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div className="d-flex align-items-center">
                  <i className="bi bi-star-fill me-2" style={{ color: '#ffc107' }}></i>
                  <div>
                    <strong style={{ color: '#856404' }}>{content.premiumFeatures.value}</strong>
                    <br />
                    <small className="text-muted">
                      {content.newsletterPremiumUpgradeMessage.value}{' '}
                      <a href="/premium" className="text-decoration-none fw-bold" style={{ color: '#007bff' }}>{content.newsletterGoToPlans.value}</a>
                    </small>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px' }}>
                <i className="bi bi-geo-alt me-2" style={{ color: '#6c757d' }}></i>
                {content.city.value}
              </label>
              
              {isLoadingCities ? (
                <div className="row">
                  {[...Array(20)].map((_, index) => (
                    <div key={index} className="col-6 mb-2">
                      <div className="d-flex align-items-center">
                        <div 
                          className="skeleton-checkbox me-2" 
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '3px',
                            animation: 'pulse 1.5s ease-in-out infinite'
                          }}
                        ></div>
                        <div 
                          className="skeleton-text flex-grow-1"
                          style={{
                            height: '16px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '4px',
                            animation: 'pulse 1.5s ease-in-out infinite',
                            width: `${Math.random() * 40 + 60}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row">
                  {cities.map(city => (
                    <div key={city.id} className="col-6 mb-2">
                      <div className="form-check">
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
                          disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <label className="form-check-label" htmlFor={`city-${city.id}`}>
                          {city.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px' }}>
                <i className="bi bi-tags me-2" style={{ color: '#6c757d' }}></i>
                {content.newsletterCategories.value}
              </label>
              
              {isLoadingCategories ? (
                <div className="row">
                  {[...Array(12)].map((_, index) => (
                    <div key={index} className="col-6 mb-2">
                      <div className="d-flex align-items-center">
                        <div 
                          className="skeleton-checkbox me-2" 
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '3px',
                            animation: 'pulse 1.5s ease-in-out infinite'
                          }}
                        ></div>
                        <div 
                          className="skeleton-text flex-grow-1"
                          style={{
                            height: '16px',
                            backgroundColor: '#e9ecef',
                            borderRadius: '4px',
                            animation: 'pulse 1.5s ease-in-out infinite',
                            width: `${Math.random() * 40 + 60}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row">
                  {categories.map(cat => (
                    <div key={cat.id} className="col-6 mb-2">
                      <div className="form-check">
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
                          disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                          {cat.label || cat.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px' }}>
                <i className="bi bi-briefcase me-2" style={{ color: '#6c757d' }}></i>
                {content.newsletterEmploymentType.value}
              </label>
              <div className="row">
                {employmentOptions.map(option => (
                  <div key={option.value} className="col-6 mb-2">
                    <div className="form-check">
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
                        disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <label className="form-check-label" htmlFor={`emp-${option.value}`}>
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px' }}>
                <i className="bi bi-translate me-2" style={{ color: '#6c757d' }}></i>
                {content.languages.value}
              </label>
              
              {/* Premium Upgrade Message for Languages */}
              {shouldShowPremiumMessages && (
                <div className="alert alert-info mb-3" style={{ 
                  backgroundColor: '#e7f3ff', 
                  border: '1px solid #b3d9ff',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-info-circle me-2" style={{ color: '#007bff' }}></i>
                    <div>
                      <small className="text-muted">
                        {content.newsletterLanguagesPremiumMessage.value}{' '}
                        <a href="/premium" className="text-decoration-none fw-bold">{content.newsletterGoToPlans.value}</a>
                      </small>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="row">
                {languageOptions.map(option => (
                  <div key={option.value} className="col-6 mb-2">
                    <div className="form-check">
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
                        disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed || shouldDisablePremiumFields}
                        style={{ 
                          transform: 'scale(1.2)',
                          opacity: shouldDisablePremiumFields ? 0.5 : 1
                        }}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor={`lang-${option.value}`}
                        style={{ 
                          opacity: shouldDisablePremiumFields ? 0.6 : 1,
                          cursor: shouldDisablePremiumFields ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px' }}>
                <i className="bi bi-gender-ambiguous me-2" style={{ color: '#6c757d' }}></i>
                {content.gender.value}
              </label>
              
              {/* Premium Upgrade Message for Gender */}
              {shouldShowPremiumMessages && (
                <div className="alert alert-info mb-3" style={{ 
                  backgroundColor: '#e7f3ff', 
                  border: '1px solid #b3d9ff',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-info-circle me-2" style={{ color: '#007bff' }}></i>
                    <div>
                      <small className="text-muted">
                        {content.newsletterGenderPremiumMessage.value}{' '}
                        <a href="/premium" className="text-decoration-none fw-bold">{content.newsletterGoToPlans.value}</a>
                      </small>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="row">
                {genderOptions.map(option => (
                  <div key={option.value} className="col-6 mb-2">
                    <div className="form-check">
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
                        disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed || shouldDisablePremiumFields}
                        style={{ 
                          transform: 'scale(1.2)',
                          opacity: shouldDisablePremiumFields ? 0.5 : 1
                        }}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor={`gender-${option.value}`}
                        style={{ 
                          opacity: shouldDisablePremiumFields ? 0.6 : 1,
                          cursor: shouldDisablePremiumFields ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', marginBottom: '8px' }}>
                <i className="bi bi-file-earmark-text me-2" style={{ color: '#6c757d' }}></i>
                {content.documentType.value}
              </label>
              
              {/* Premium Upgrade Message for Document Types */}
              {shouldShowPremiumMessages && (
                <div className="alert alert-info mb-3" style={{ 
                  backgroundColor: '#e7f3ff', 
                  border: '1px solid #b3d9ff',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-info-circle me-2" style={{ color: '#007bff' }}></i>
                    <div>
                      <small className="text-muted">
                        {content.newsletterDocumentTypePremiumMessage.value}{' '}
                        <a href="/premium" className="text-decoration-none fw-bold">{content.newsletterGoToPlans.value}</a>
                      </small>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="row">
                {documentTypeOptions.map(option => (
                  <div key={option.value} className="col-6 mb-2">
                    <div className="form-check">
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
                        disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed || shouldDisablePremiumFields}
                        style={{ 
                          transform: 'scale(1.2)',
                          opacity: shouldDisablePremiumFields ? 0.5 : 1
                        }}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor={`doc-${option.value}`}
                        style={{ 
                          opacity: shouldDisablePremiumFields ? 0.6 : 1,
                          cursor: shouldDisablePremiumFields ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              {/* Premium Upgrade Message for Demanded Candidates */}
              {shouldShowPremiumMessages && (
                <div className="alert alert-info mb-3" style={{ 
                  backgroundColor: '#e7f3ff', 
                  border: '1px solid #b3d9ff',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-info-circle me-2" style={{ color: '#007bff' }}></i>
                    <div>
                      <small className="text-muted">
                        {content.newsletterDemandedPremiumMessage.value}{' '}
                        <a href="/premium" className="text-decoration-none fw-bold">{content.newsletterGoToPlans.value}</a>
                      </small>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="onlyDemanded"
                  checked={onlyDemanded}
                  onChange={(e) => setOnlyDemanded(e.target.checked)}
                  disabled={isSubscribing || isUnsubscribing || isAlreadySubscribed || shouldDisablePremiumFields}
                  style={{ 
                    transform: 'scale(1.2)',
                    opacity: shouldDisablePremiumFields ? 0.5 : 1
                  }}
                />
                <label 
                  className="form-check-label" 
                  htmlFor="onlyDemanded"
                  style={{ 
                    opacity: shouldDisablePremiumFields ? 0.6 : 1,
                    cursor: shouldDisablePremiumFields ? 'not-allowed' : 'pointer'
                  }}
                >
                  <i className="bi bi-star-fill me-2" style={{ color: '#ffc107' }}></i>
                  {content.newsletterDemandedCandidates.value}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Action Buttons */}
      <div style={{ 
        padding: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="text-center">
          {isAlreadySubscribed ? (
            <div className="d-flex justify-content-center align-items-center gap-4">
              <div className="text-muted">
                <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745' }}></i>
                {content.newsletterAlreadySubscribed.value}
              </div>
              <button 
                className="btn btn-danger"
                onClick={handleUnsubscribe}
                disabled={isUnsubscribing}
                style={{ padding: '12px 24px' }}
              >
                {isUnsubscribing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {content.newsletterUnsubscribing.value}
                  </>
                ) : (
                  <>
                    <i className="bi bi-envelope-x me-2"></i>
                    {content.newsletterUnsubscribe.value}
                  </>
                )}
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleSubscribe}
              disabled={isSubscribing || !email.trim()}
              style={{ 
                padding: '15px 40px', 
                fontSize: '18px',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,123,255,0.3)'
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

export default NewsletterSubscription; 