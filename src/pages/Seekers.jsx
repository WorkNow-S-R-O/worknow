import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import {Footer} from "../components/Footer";
import {Navbar} from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL;

export default function Seekers() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPremium = user?.publicMetadata?.isPremium || false;
  const isAdmin = user && user.emailAddresses?.[0]?.emailAddress === 'worknow.notifications@gmail.com';
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', city: '', description: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/seekers`)
      .then(res => setSeekers(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Ошибка загрузки соискателей"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddSeeker = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axios.post(`${API_URL}/seekers`, {
        ...form,
        slug: (form.name + '-' + form.description.split('\n')[0])
          .toLowerCase()
          .replace(/[^a-zа-я0-9]+/gi, '-')
          .replace(/^-+|-+$/g, ''),
      });
      setForm({ name: '', contact: '', city: '', description: '' });
      setShowForm(false);
      // Обновить список после добавления
      setLoading(true);
      axios.get(`${API_URL}/seekers`)
        .then(res => setSeekers(Array.isArray(res.data) ? res.data : []))
        .catch(() => setError("Ошибка загрузки соискателей"))
        .finally(() => setLoading(false));
    } catch {
      alert('Ошибка при добавлении соискателя');
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2>{t("seekers") || "Соискатели"}</h2>
        {isAdmin && (
          <>
            <button className="btn btn-success mb-3" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Скрыть форму' : 'Добавить соискателя'}
            </button>
            {showForm && (
              <form onSubmit={handleAddSeeker} className="mb-4 p-3 border rounded" style={{ maxWidth: 500, width: '100%' }}>
                <div className="mb-2">
                  <input required className="form-control" placeholder="Имя" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="mb-2">
                  <input required className="form-control" placeholder="Контакт" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
                </div>
                <div className="mb-2">
                  <input required className="form-control" placeholder="Город" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div className="mb-2">
                  <textarea required className="form-control" placeholder="Описание" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <button className="btn btn-primary" type="submit" disabled={adding}>Сохранить</button>
              </form>
            )}
          </>
        )}
        {loading && <div>Загрузка...</div>}
        {error && <div className="text-danger">{error}</div>}
        {!loading && !error && seekers.length === 0 && <div>Нет соискателей</div>}
        {!loading && !error && seekers.length > 0 && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Контакт</th>
                <th>Город</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              {seekers.map(seeker => (
                <tr key={seeker.id}>
                  <td>{seeker.name}</td>
                  <td>{isPremium ? seeker.contact : "****"}</td>
                  <td>{seeker.city}</td>
                  <td>{seeker.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
}