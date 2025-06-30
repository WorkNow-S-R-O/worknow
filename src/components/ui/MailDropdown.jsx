import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL;

export default function MailDropdown() {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMailDropdown, setShowMailDropdown] = useState(false);
  const [mailMessages, setMailMessages] = useState([]);
  const [mailLoading, setMailLoading] = useState(false);
  const [openedMsgId, setOpenedMsgId] = useState(null);
  const mailRef = useRef();
  const { t } = useTranslation();

  // Polling на новые письма (без toast)
  useEffect(() => {
    if (!user) return;
    let timer;
    const fetchUnread = async () => {
      try {
        let res = await axios.get(`${API_URL}/messages?clerkUserId=${user.id}`);
        let msgs = res.data.messages || [];
        // Оставляем только 5 последних писем
        if (msgs.length > 5) {
          const toDelete = msgs.slice(5);
          for (const m of toDelete) {
            try {
              await axios.delete(`${API_URL}/messages/${m.id}`);
            } catch (e) {
              if (!(e.response && e.response.status === 404)) {
                console.error('Ошибка удаления сообщения:', e);
              }
              // Если 404 — игнорируем
            }
          }
          msgs = msgs.slice(0, 5);
        }
        const count = msgs.filter(m => !m.isRead).length;
        console.log('unreadCount:', count, msgs); // Лог для диагностики
        setMailMessages(msgs);
        setUnreadCount(count);
      } catch {
        // Ошибка загрузки писем
      }
    };
    fetchUnread();
    timer = setInterval(fetchUnread, 12000);
    return () => clearInterval(timer);
  }, [user]);

  // Получение последних писем для dropdown (только 5)
  const fetchMailMessages = async () => {
    if (!user) return;
    setMailLoading(true);
    try {
      const res = await axios.get(`${API_URL}/messages?clerkUserId=${user.id}`);
      let msgs = res.data.messages?.slice(0, 5) || [];
      setMailMessages(msgs);
    } catch {
      // Ошибка загрузки последних писем
    }
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

  // Открывать первое сообщение при открытии popover и помечать его как прочитанное (только при первом открытии)
  useEffect(() => {
    if (showMailDropdown && mailMessages.length > 0) {
      // Если popover только что открыт — выделяем первое письмо
      setOpenedMsgId(prev => prev ?? mailMessages[0].id);
      // Если первое письмо не прочитано — помечаем как прочитанное
      if (!mailMessages[0].isRead) {
        axios.patch(`${API_URL}/messages/${mailMessages[0].id}/read`).then(() => {
          setMailMessages(msgs => msgs.map(m => m.id === mailMessages[0].id ? { ...m, isRead: true } : m));
          setUnreadCount(count => count > 0 ? count - 1 : 0);
        });
      }
    } else if (!showMailDropdown) {
      // При закрытии popover сбрасываем выделение
      setOpenedMsgId(null);
    }
  }, [showMailDropdown, mailMessages]);

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
        <div className="shadow rounded bg-white position-absolute end-0 mt-2" style={{ minWidth: 340, zIndex: 9999, maxWidth: 400 }}>
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
                  className={`list-group-item px-3 py-2 ${openedMsgId === msg.id ? 'bg-primary-subtle' : ''}`}
                  style={{ cursor: 'pointer', borderLeft: openedMsgId === msg.id ? '4px solid #1976d2' : '4px solid transparent', transition: 'background 0.2s, border 0.2s' }}
                  onClick={async () => {
                    setOpenedMsgId(msg.id);
                    if (!msg.isRead) {
                      await axios.patch(`${API_URL}/messages/${msg.id}/read`);
                      setMailMessages(msgs => msgs.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
                      setUnreadCount(count => count > 0 ? count - 1 : 0);
                    }
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span style={{fontWeight: msg.isRead ? 400 : 600, color: msg.isRead ? '#333' : '#1976d2'}}>{msg.title}</span>
                    {!msg.isRead && <span className="badge bg-primary ms-2">{t('mail_new_badge')}</span>}
                  </div>
                  <div className="small text-muted mt-1">{new Date(msg.createdAt).toLocaleString()}</div>
                  {openedMsgId === msg.id && (
                    <div className="mt-2 small text-dark" style={{fontSize:15}} dangerouslySetInnerHTML={{ __html: msg.body }} />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
