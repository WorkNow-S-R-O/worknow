import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import {Footer} from "../components/Footer";
import { useUser } from "@clerk/clerk-react";

const API_URL = import.meta.env.VITE_API_URL; 

export default function SeekerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seeker, setSeeker] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const isPremium = user?.publicMetadata?.isPremium || false;

  useEffect(() => {
    fetch(`${API_URL}/seekers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSeeker(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!seeker || !seeker.description) return <div>Соискатель не найден</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: 600 }}>
        <a href="#" onClick={() => navigate(-1)} style={{ color: '#1976d2' }}>&larr; Вернуться к списку</a>
        <h2 className="mt-3 mb-2">Соискатели</h2>
        <div className="text-muted mb-2">Опубликовано {seeker.createdAt ? `${Math.floor((Date.now() - new Date(seeker.createdAt)) / (1000*60*60*24))} дней назад` : ''} {seeker.createdAt && new Date(seeker.createdAt).toLocaleDateString()}</div>
        <h3 className="mb-2">
          {seeker.name}
          {seeker.gender && <span className="badge bg-dark ms-2">{seeker.gender}</span>}
          {seeker.isDemanded && <span className="badge bg-primary ms-2">востребованный кандидат</span>}
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
        <button className="btn btn-dark mt-2">Распечатать</button>
      </div>
      <Footer />
    </>
  );
} 