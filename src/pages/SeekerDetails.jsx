import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import {Footer} from "../components/Footer";
import { useUser } from "@clerk/clerk-react";
import '../css/seeker-details-mobile.css';

const API_URL = import.meta.env.VITE_API_URL; 

export default function SeekerDetails() {
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

  useEffect(() => {
    setSeeker(null);
    setLoading(true);
    const clerkUserId = user?.id;
    const url = clerkUserId ? `${API_URL}/seekers/${id}?clerkUserId=${clerkUserId}` : `${API_URL}/seekers/${id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSeeker(data);
        setIsPremium(!!data.isPremium);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, user]);

  if (loading) return <div>Загрузка...</div>;
  if (!seeker || !seeker.description) return <div>Соискатель не найден</div>;

  return (
    <>
      <Navbar />
      <div className="container" style={{ maxWidth: 600, paddingTop: '100px' }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="fs-4 mb-0">Соискатели</h2>
          <Link to="/seekers" style={{ color: '#1976d2', textDecoration: 'underline', whiteSpace: 'nowrap' }}>&larr; Вернуться к списку</Link>
        </div>
        <div className="text-muted mb-2">Опубликовано {seeker.createdAt ? `${Math.floor((Date.now() - new Date(seeker.createdAt)) / (1000*60*60*24))} дней назад` : ''} {seeker.createdAt && new Date(seeker.createdAt).toLocaleDateString()}</div>
        <h3 className="mb-2">
          <span className="d-flex align-items-center flex-wrap gap-2">
            {seeker.name}
            {seeker.gender && <span className="badge bg-dark">{seeker.gender}</span>}
            {seeker.isDemanded && <span className="badge bg-primary">востребованный кандидат</span>}
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
            контакты доступны для платного тарифа
          </div>
        )}
        <div className="mb-2">
          <strong>Занятость:</strong> {seeker.employment && <span className="badge bg-secondary">{seeker.employment}</span>}
        </div>
        <div className="mb-2">
          <strong>Категория:</strong> {seeker.category && <span className="badge bg-secondary">{seeker.category}</span>}
        </div>
        <div className="mb-2">
          <strong>Языки:</strong> {Array.isArray(seeker.languages) && seeker.languages.map(lang => (
            <span key={lang} className="badge bg-light text-dark border mx-1">
              {lang}{seeker.nativeLanguage === lang && ' (родной)'}
            </span>
          ))}
        </div>
        <div className="mb-2">
          <strong>Документы:</strong> {seeker.documents}
        </div>
        <div className="mb-2">
          <strong>Объявление:</strong>
          <div>{seeker.announcement}</div>
        </div>
        <div className="mb-2">
          <strong>Примечание:</strong> {seeker.note}
        </div>
        <button className="btn btn-dark mt-2" onClick={() => window.print()}>Распечатать</button>
        
        {seekerIds && (
        <div className="mt-4">
          <div className="text-muted mb-2">
            {`${currentIndex + 1}-й из ${seekerIds.length}`}
          </div>
          <div className="d-flex gap-2">
            {hasPrev && (
              <Link to={`/seekers/${prevSeekerId}`} state={{ seekerIds, currentIndex: currentIndex - 1 }} className="btn btn-primary">
                &larr; Назад
              </Link>
            )}
            {hasNext && (
              <Link to={`/seekers/${nextSeekerId}`} state={{ seekerIds, currentIndex: currentIndex + 1 }} className="btn btn-primary">
                Вперед &rarr;
              </Link>
            )}
          </div>
        </div>
        )}
      </div>
      <Footer />
    </>
  );
} 