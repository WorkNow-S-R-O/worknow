import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export default function Inbox() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    axios.get(`${API_URL}/messages?userId=${user.id}`)
      .then(res => setMessages(res.data.messages || []))
      .catch(() => toast.error('Ошибка загрузки сообщений'))
      .finally(() => setLoading(false));
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_URL}/messages/${id}/read`);
      setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch {
      toast.error('Ошибка отметки как прочитанного');
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <div className="container py-4 flex-grow-1">
        <h2 className="mb-4">{t('inbox') || 'Входящие'}</h2>
        {loading ? <div>Загрузка...</div> : (
          <div className="row">
            <div className="col-md-4 mb-3">
              <ul className="list-group">
                {messages.length === 0 && <li className="list-group-item">Нет сообщений</li>}
                {messages.map(msg => (
                  <li
                    key={msg.id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${!msg.isRead ? 'fw-bold bg-primary-subtle' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelected(msg)}
                  >
                    <span>{msg.title}</span>
                    {!msg.isRead && <span className="badge bg-primary">NEW</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-8">
              {selected ? (
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{selected.title}</h5>
                    <div className="card-text" dangerouslySetInnerHTML={{ __html: selected.body }} />
                    <div className="text-muted mt-2" style={{ fontSize: 13 }}>{new Date(selected.createdAt).toLocaleString()}</div>
                    {!selected.isRead && (
                      <button className="btn btn-sm btn-success mt-3" onClick={() => markAsRead(selected.id)}>
                        Отметить как прочитанное
                      </button>
                    )}
                  </div>
                </div>
              ) : <div className="text-muted">Выберите сообщение</div>}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 