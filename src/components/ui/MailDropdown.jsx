import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export default function MailDropdown() {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMailDropdown, setShowMailDropdown] = useState(false);
  const [mailMessages, setMailMessages] = useState([]);
  const [mailLoading, setMailLoading] = useState(false);
  const [openedMsgId, setOpenedMsgId] = useState(null);
  const mailRef = useRef();
  const prevUnread = useRef(0);

  // Polling на новые письма + toast
  useEffect(() => {
    if (!user) return;
    let timer;
    const fetchUnread = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages?userId=${user.id}`);
        const msgs = res.data.messages || [];
        const count = msgs.filter(m => !m.isRead).length;
        prevUnread.current = unreadCount;
        setUnreadCount(count);
        if (count > unreadCount) {
          toast(() => (
            <span>
              📩 Новое сообщение!{' '}
              {/* Можно добавить действие по клику */}
            </span>
          ), { id: 'new-mail', duration: 7000 });
        }
      } catch {}
    };
    fetchUnread();
    timer = setInterval(fetchUnread, 30000);
    return () => clearInterval(timer);
  }, [user, unreadCount]);

  // Получение последних писем для dropdown
  const fetchMailMessages = async () => {
    if (!user) return;
    setMailLoading(true);
    try {
      const res = await axios.get(`${API_URL}/messages?userId=${user.id}`);
      setMailMessages(res.data.messages?.slice(0, 7) || []);
    } catch {}
    setMailLoading(false);
  };

  // Закрытие dropdown при клике вне
  useEffect(() => {
    if (!showMailDropdown) return;
    const handler = (e) => {
      if (mailRef.current && !mailRef.current.contains(e.target)) {
        setShowMailDropdown(false);
        setOpenedMsgId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMailDropdown]);

  return (
    <div ref={mailRef} className="position-relative me-2">
      <button
        className="btn btn-link p-0 position-relative"
        title="Почта"
        onClick={async () => {
          setShowMailDropdown(v => !v);
          if (!showMailDropdown) await fetchMailMessages();
        }}
        style={{ outline: 'none', boxShadow: 'none' }}
      >
        <i className="bi bi-envelope" style={{ fontSize: 20, color: '#6c757d' }}></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: 12 }}>
            {unreadCount}
          </span>
        )}
      </button>
      {showMailDropdown && (
        <div className="shadow rounded bg-white position-absolute end-0 mt-2" style={{ minWidth: 320, zIndex: 9999, maxWidth: 400 }}>
          <div className="p-2 border-bottom fw-bold">Входящие</div>
          {mailLoading ? (
            <div className="p-3 text-center text-muted">Загрузка...</div>
          ) : mailMessages.length === 0 ? (
            <div className="p-3 text-center text-muted">Нет сообщений</div>
          ) : (
            <ul className="list-group list-group-flush" style={{maxHeight: 350, overflowY: 'auto'}}>
              {mailMessages.map(msg => (
                <li
                  key={msg.id}
                  className={`list-group-item px-3 py-2 ${!msg.isRead ? 'fw-bold bg-primary-subtle' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpenedMsgId(openedMsgId === msg.id ? null : msg.id)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{msg.title}</span>
                    {!msg.isRead && <span className="badge bg-primary ms-2">NEW</span>}
                  </div>
                  {openedMsgId === msg.id && (
                    <div className="mt-2 small text-dark" dangerouslySetInnerHTML={{ __html: msg.body }} />
                  )}
                  <div className="text-muted small mt-1">{new Date(msg.createdAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
