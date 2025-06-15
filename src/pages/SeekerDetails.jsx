import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import {Footer} from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL;

export default function SeekerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seeker, setSeeker] = useState(null);
  const [loading, setLoading] = useState(true);

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
  if (!seeker) return <div>Соискатель не найден</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: 600 }}>
        <a href="#" onClick={() => navigate(-1)} style={{ color: '#1976d2' }}>&larr; Вернуться к списку</a>
        <h2 className="mt-3 mb-2">Соискатели</h2>
        <div className="text-muted mb-2">Опубликовано 0 дней назад {new Date().toLocaleDateString()}</div>
        <h3 className="mb-2">{seeker.name} <span className="badge bg-dark">женщина</span></h3>
        <div className="bg-light p-2 mb-2" style={{ fontWeight: 600, fontSize: 18 }}>
          <i className="bi bi-info-circle me-2" />
          контакты доступны для платного тарифа
        </div>
        <div className="mb-2">
          <strong>Ссылки:</strong> <i className="bi bi-facebook" />
        </div>
        <div className="mb-2">
          <strong>Занятость:</strong> <i className="bi bi-clock" /> полная
        </div>
        <div className="mb-2">
          <strong>Категория:</strong> <span className="badge bg-secondary">уход-за-пожилыми</span>
        </div>
        <div className="mb-2">
          <strong>Языки:</strong> <i className="bi bi-globe" /> ru: родной
        </div>
        <div className="mb-2">
          <strong>Документы:</strong> <i className="bi bi-file-earmark" />
        </div>
        <div className="mb-2">
          <strong>Объявление:</strong>
          <div>{seeker.description.split("\n").slice(1).join(" ")}</div>
        </div>
        <div className="mb-2">
          <strong>Примечание:</strong>
        </div>
        <button className="btn btn-dark mt-2">Распечатать</button>
      </div>
      <Footer />
    </>
  );
} 