import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 10;

const BillingPage = () => {
  const { user } = useUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageStack, setPageStack] = useState([]); // для keyset пагинации (массив id)
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const fetchHistory = async (startingAfter = null, page = 0) => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      let url = `${API_URL}/payments/stripe-history?clerkUserId=${user.id}&limit=${PAGE_SIZE}`;
      if (startingAfter) url += `&starting_after=${startingAfter}`;
      const res = await axios.get(url);
      setHistory(res.data.payments || []);
      setHasNext((res.data.payments || []).length === PAGE_SIZE);
      setHasPrev(page > 0);
    } catch {
      setError("Ошибка загрузки истории платежей");
      setHistory([]);
      setHasNext(false);
      setHasPrev(page > 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageStack([]);
    setCurrentPage(0);
    fetchHistory(null, 0);
    // eslint-disable-next-line
  }, [user]);

  const handleNext = () => {
    if (history.length === 0) return;
    const lastId = history[history.length - 1].id;
    setPageStack(prev => [...prev, lastId]);
    setCurrentPage(prev => prev + 1);
    fetchHistory(lastId, currentPage + 1);
  };

  const handlePrev = () => {
    if (pageStack.length === 0) return;
    const newStack = [...pageStack];
    newStack.pop();
    setPageStack(newStack);
    setCurrentPage(prev => prev - 1);
    fetchHistory(newStack[newStack.length - 1] || null, currentPage - 1);
  };

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
        <>
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
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.period ? item.period.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) : '-'}</td>
                  <td>{item.amount ? `${item.amount}₪` : '-'}</td>
                  <td>{item.type || '-'}</td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-outline-secondary" onClick={handlePrev} disabled={!hasPrev}>
              Предыдущая страница
            </button>
            <button className="btn btn-outline-secondary" onClick={handleNext} disabled={!hasNext}>
              Следующая страница
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BillingPage; 