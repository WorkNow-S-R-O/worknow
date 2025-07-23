import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import '../css/seeker-details-mobile.css';
import '../css/ripple.css';

const API_URL = import.meta.env.VITE_API_URL; 

export default function SeekerDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const [seeker, setSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);

  const { seekerIds, currentIndex } = location.state || {};
  
  const hasNext = seekerIds && currentIndex < seekerIds.length - 1;
  const hasPrev = seekerIds && currentIndex > 0;
  
  const nextSeekerId = hasNext ? seekerIds[currentIndex + 1] : null;
  const prevSeekerId = hasPrev ? seekerIds[currentIndex - 1] : null;

  const getGenderLabel = (gender) => {
    if (!gender) return '';
    if (["мужчина", "male"].includes(gender.toLowerCase())) return t('seeker_profile_male');
    if (["женщина", "female"].includes(gender.toLowerCase())) return t('seeker_profile_female');
    return gender;
  };

  const getEmploymentLabel = (employment) => {
    if (!employment) return '';
    const key = `employment_${employment.toLowerCase()}`;
    const translated = t(key);
    return translated === key ? employment : translated;
  };

  const getCategoryLabel = (category) => {
    if (!category) return '';
    const key = `category_${category.toLowerCase()}`;
    const translated = t(key);
    return translated === key ? category : translated;
  };

  const getLangLabel = (lang) => {
    if (!lang) return '';
    const key = `lang_${lang.toLowerCase()}`;
    const translated = t(key);
    return translated === key ? lang : translated;
  };

  useEffect(() => {
    setSeeker(null);
    setLoading(true);
    const clerkUserId = user?.id;
    const url = clerkUserId ? `${API_URL}/api/seekers/${id}?clerkUserId=${clerkUserId}` : `${API_URL}/seekers/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSeeker(data);
        setIsPremium(!!data.isPremium);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, user]);

  if (loading) return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
      <div className="ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );

  if (!seeker || !seeker.description) return <div>{t('seeker_profile_not_found')}</div>;

  const daysAgo = seeker.createdAt ? Math.floor((Date.now() - new Date(seeker.createdAt)) / (1000*60*60*24)) : 0;
  const formattedDate = seeker.createdAt ? new Date(seeker.createdAt).toLocaleDateString() : '';

  return (
    <>
      <div className="container" style={{ maxWidth: 600, paddingTop: '100px' }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="fs-4 mb-0">{t('seeker_profile_title')}</h2>
          <Link to="/seekers" style={{ color: '#1976d2', textDecoration: 'underline', whiteSpace: 'nowrap' }}>&larr; {t('seeker_profile_back')}</Link>
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
            <i className="bi bi-telephone me-2" />{seeker.contact && <span style={{marginRight:8}}>{seeker.contact}</span>}
            {seeker.facebook && (
              <a href={seeker.facebook} target="_blank" rel="noopener noreferrer" style={{color:'#1976d2'}}>
                <i className="bi bi-facebook" style={{fontSize:22,verticalAlign:'middle'}} />
              </a>
            )}
          </div>
        )}
        {!isPremium && (seeker.contact || seeker.facebook) && (
          <div className="bg-light p-2 mb-2" style={{ fontWeight: 600, fontSize: 18 }}>
            {t('seeker_profile_contacts_premium')}
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
          <strong>{t('seeker_profile_documents')}:</strong> {seeker.documentType}
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
        
        {seekerIds && (
        <div className="mt-4">
          <div className="text-muted mb-2">
            {t('seeker_profile_of', { current: currentIndex + 1, total: seekerIds.length })}
          </div>
          <div className="d-flex gap-2">
            {hasPrev && (
              <Link to={`/seekers/${prevSeekerId}`} state={{ seekerIds, currentIndex: currentIndex - 1 }} className="btn btn-primary">
                &larr; {t('seeker_profile_prev')}
              </Link>
            )}
            {hasNext && (
              <Link to={`/seekers/${nextSeekerId}`} state={{ seekerIds, currentIndex: currentIndex + 1 }} className="btn btn-primary">
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