import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useLoadingProgress } from '../hooks/useLoadingProgress';
import { useTranslationHelpers } from '../utils/translationHelpers';
import '../css/seeker-details-mobile.css';
import '../css/ripple.css';

const API_URL = import.meta.env.VITE_API_URL; 

// Helper function to parse contact field and extract Facebook link
const parseContactField = (contact) => {
  if (!contact) return { phone: '', facebook: null };
  
  // Split by comma to separate phone and Facebook
  const parts = contact.split(',').map(part => part.trim());
  
  let phone = '';
  let facebook = null;
  
  parts.forEach(part => {
    if (part.includes('facebook.com') || part.includes('fb.com')) {
      // Extract Facebook URL
      let fbUrl = part;
      if (!fbUrl.startsWith('http')) {
        fbUrl = 'https://' + fbUrl;
      }
      facebook = fbUrl;
    } else {
      // This is likely a phone number
      phone = part;
    }
  });
  
  return { phone, facebook };
};

// Helper function to render contact information
const renderContactInfo = (contact, facebook) => {
  // Parse contact field to extract Facebook if it's embedded there
  const { phone: parsedPhone, facebook: parsedFacebook } = parseContactField(contact);
  
  // Use dedicated facebook field if available, otherwise use parsed facebook
  const facebookUrl = facebook || parsedFacebook;
  const displayContact = parsedPhone || contact;
  
  return (
    <div className="d-flex align-items-center">
      {displayContact && (
        <span style={{marginRight: '16px'}}>{displayContact}</span>
      )}
      {facebookUrl && (
        <a 
          href={facebookUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{
            color: '#1976d2', 
            textDecoration: 'underline'
          }}
        >
          {facebookUrl.replace(/^https?:\/\//, '')}
        </a>
      )}
    </div>
  );
};

export default function SeekerDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const [seeker, setSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const { startLoadingWithProgress, completeLoading, stopLoadingImmediately } = useLoadingProgress();
  const {
    getGenderLabel,
    getEmploymentLabel,
    getCategoryLabel,
    getLangLabel,
    getDocumentTypeLabel,
    getCityLabel
  } = useTranslationHelpers();

  const { seekerIds, currentIndex, returnToPage } = location.state || {};
  
  // Calculate the global index across all pages
  const globalIndex = seekerIds ? (returnToPage - 1) * 10 + currentIndex : 0;
  

  
  // Navigation logic - only show prev/next if we have the full context
  const hasNext = seekerIds && currentIndex !== undefined && currentIndex < seekerIds.length - 1;
  const hasPrev = seekerIds && currentIndex !== undefined && currentIndex > 0;
  
  const nextSeekerId = hasNext ? seekerIds[currentIndex + 1] : null;
  const prevSeekerId = hasPrev ? seekerIds[currentIndex - 1] : null;

  useEffect(() => {
    setSeeker(null);
    setLoading(true);
    startLoadingWithProgress(1500); // Start progress bar for 1.5 seconds
    
    const clerkUserId = user?.id;
    const url = clerkUserId ? `${API_URL}/api/seekers/${id}?clerkUserId=${clerkUserId}` : `${API_URL}/api/seekers/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSeeker(data);
        setIsPremium(!!data.isPremium);
        setLoading(false);
        completeLoading(); // Complete the progress bar
      })
      .catch(() => {
        setLoading(false);
        stopLoadingImmediately(); // Stop progress bar on error
      });
  }, [id, user]);

  if (loading) return (
    <>
      <Helmet>
        <title>{t('seeker_profile_loading') || "Загрузка..."} - {t('seeker_profile_title')}</title>
      </Helmet>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
        <div className="ripple">
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );

  if (!seeker || !seeker.description) return (
    <>
      <Helmet>
        <title>{t('seeker_profile_not_found') || "Не найдено"} - {t('seeker_profile_title')}</title>
      </Helmet>
      <div>{t('seeker_profile_not_found')}</div>
    </>
  );

  const daysAgo = seeker.createdAt ? Math.floor((Date.now() - new Date(seeker.createdAt)) / (1000*60*60*24)) : 0;
  const formattedDate = seeker.createdAt ? new Date(seeker.createdAt).toLocaleDateString() : '';

  return (
    <>
      <Helmet>
        <title>
          {`${seeker.name} - ${t('seeker_profile_title')}`}
        </title>
        <meta name="description" content={seeker.description} />
        <meta name="keywords" content={`${seeker.name}, ${seeker.employment || ''}, ${seeker.category || ''}, ${Array.isArray(seeker.languages) ? seeker.languages.join(', ') : ''}`} />
      </Helmet>
      <div className="container" style={{ maxWidth: 600, paddingTop: '100px' }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="fs-4 mb-0">{t('seeker_profile_title')}</h2>
          <Link 
            to="/seekers" 
            state={{ 
              returnToPage: (returnToPage && typeof returnToPage === 'number') ? returnToPage : (parseInt(localStorage.getItem('seekersCurrentPage')) || 1)
            }}
            style={{ color: '#1976d2', textDecoration: 'underline', whiteSpace: 'nowrap' }}
          >
            &larr; {t('seeker_profile_back')}
          </Link>
        </div>
        <div className="text-muted mb-2">{t('seeker_profile_published', { days: daysAgo, date: formattedDate })}</div>
        <h3 className="mb-2">
          <span className="d-flex align-items-center flex-wrap gap-2">
            {seeker.name}
            {seeker.gender && <span className="badge bg-dark">{getGenderLabel(seeker.gender)}</span>}
            {seeker.isDemanded && <span className="badge bg-primary">{t('seeker_profile_demanded')}</span>}
          </span>
        </h3>
        {isPremium && (seeker.contact || seeker.facebook) && (
          <div className="bg-light p-2 mb-2" style={{ fontWeight: 600, fontSize: 18 }}>
            <div className="d-flex align-items-center">
              <i className="bi bi-telephone me-2" />
              {renderContactInfo(seeker.contact, seeker.facebook)}
            </div>
          </div>
        )}
        {!isPremium && (seeker.contact || seeker.facebook) && (
          <div className="bg-light p-2 mb-2" style={{ fontWeight: 600, fontSize: 18 }}>
            {t('seeker_profile_contacts_premium')}
          </div>
        )}
        {seeker.city && (
          <div className="mb-2">
            <div className="d-flex align-items-center">
              <i className="bi bi-geo-alt me-2" style={{ color: '#6c757d' }}></i>
              <span>{getCityLabel(seeker.city)}</span>
            </div>
          </div>
        )}
        <div className="mb-2">
          <strong>{t('seeker_profile_employment')}:</strong> {seeker.employment && <span className="badge bg-secondary">{getEmploymentLabel(seeker.employment)}</span>}
        </div>
        <div className="mb-2">
          <strong>{t('seeker_profile_category')}:</strong> {seeker.category && <span className="badge bg-secondary">{getCategoryLabel(seeker.category)}</span>}
        </div>
        <div className="mb-2">
          <strong>{t('seeker_profile_languages')}:</strong> {Array.isArray(seeker.languages) && seeker.languages.map(lang => (
            <span key={lang} className="badge bg-light text-dark border mx-1">
              {getLangLabel(lang)}{seeker.nativeLanguage === lang && ` ${t('seeker_profile_native')}`}
            </span>
          ))}
        </div>
        <div className="mb-2">
          <strong>{t('seeker_profile_documents')}:</strong> {seeker.documentType && <span className="badge bg-secondary">{getDocumentTypeLabel(seeker.documentType)}</span>}
        </div>
        <div className="mb-2">
          <strong>{t('seeker_profile_announcement')}:</strong>
          <div>{seeker.announcement}</div>
        </div>
        {isPremium && (
          <div className="mb-2">
            <strong>{t('seeker_profile_note')}:</strong> {seeker.note || ''}
          </div>
        )}
        {!isPremium && (
          <div className="mb-2">
            <strong>{t('seeker_profile_note')}:</strong>
            <div className="bg-light p-2" style={{ fontWeight: 600, fontSize: 18 }}>
              <i className="bi bi-info-circle me-2"></i>
              {t('seeker_profile_note_premium')}
            </div>
          </div>
        )}
        <button className="btn btn-dark mt-2" onClick={() => window.print()}>{t('seeker_profile_print')}</button>
        
                {seekerIds && returnToPage && (
        <div className="mt-4">
          <div className="text-muted mb-2">
            {t('seeker_profile_of', { current: globalIndex + 1, total: seekerIds.length })}

          </div>
          <div className="d-flex gap-2">
            {hasPrev && (
              <Link 
                to={`/seekers/${prevSeekerId}`} 
                state={{ 
                  seekerIds, 
                  currentIndex: currentIndex - 1, 
                  returnToPage: (returnToPage && typeof returnToPage === 'number') ? returnToPage : (parseInt(localStorage.getItem('seekersCurrentPage')) || 1)
                }} 
                className="btn btn-primary"
              >
                &larr; {t('seeker_profile_prev')}
              </Link>
            )}
            {hasNext && (
              <Link 
                to={`/seekers/${nextSeekerId}`} 
                state={{ 
                  seekerIds, 
                  currentIndex: currentIndex + 1, 
                  returnToPage: (returnToPage && typeof returnToPage === 'number') ? returnToPage : (parseInt(localStorage.getItem('seekersCurrentPage')) || 1)
                }} 
                className="btn btn-primary"
              >
                {t('seeker_profile_next')} &rarr;
              </Link>
            )}
          </div>
        </div>
        )}
      </div>
    </>
  );
} 