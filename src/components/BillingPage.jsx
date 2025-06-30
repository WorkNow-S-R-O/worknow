import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const BillingPage = () => {
  const { user } = useUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_URL}/payments/history?clerkUserId=${user.id}`);
        setHistory(res.data.payments || []);
      } catch {
        setError("Ошибка загрузки истории платежей");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="container" style={{ maxWidth: 600, margin: '0 auto', paddingTop: 60 }}>
      <h2 className="text-center mb-4">Выставление счетов</h2>
      <div className="mb-4 text-center">
        <Link to="/cancel-subscription" className="text-secondary" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
          Отмена подписки
        </Link>
      </div>
      <h5 className="mb-3">История платежей</h5>
      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : history.length === 0 ? (
        <div className="alert alert-info">Нет платежей</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Месяц</th>
              <th>Сумма</th>
              <th>Тип подписки</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={idx}>
                <td>{item.month || '-'}</td>
                <td>{item.amount ? `${item.amount}₪` : '-'}</td>
                <td>{item.type === 199 ? 'Enterprise' : 'Premium'}</td>
                <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillingPage; 