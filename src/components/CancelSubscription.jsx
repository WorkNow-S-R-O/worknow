import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const CancelSubscription = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(null);
  const [isAutoRenewal, setIsAutoRenewal] = useState(null);
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewError, setRenewError] = useState("");

  // Получаем статус премиума и автопродления с сервера
  const fetchUserStatus = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`${API_URL}/users/${user.id}`);
      setIsPremium(res.data.isPremium);
      setIsAutoRenewal(res.data.isAutoRenewal);
    } catch {
      setIsPremium(false);
      setIsAutoRenewal(false);
    }
  };

  useEffect(() => {
    fetchUserStatus();
    // eslint-disable-next-line
  }, [user]);

  const handleCancel = async () => {
    if (!user || !isPremium || !isAutoRenewal) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/payments/cancel-auto-renewal`, {
        clerkUserId: user.id,
      });
      await fetchUserStatus();
    } catch (e) {
      setError("Ошибка при отмене подписки. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!user) return;
    setRenewLoading(true);
    setRenewError("");
    try {
      await axios.post(`${API_URL}/payments/renew-auto-renewal`, {
        clerkUserId: user.id,
      });
      await fetchUserStatus();
    } catch (e) {
      setRenewError("Ошибка при возобновлении подписки. Попробуйте позже.");
    } finally {
      setRenewLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, margin: '0 auto', paddingTop: 60 }}>
      <h2 className="text-center mb-4">Отмена подписки</h2>
      {isPremium && isAutoRenewal === false && (
        <div className="alert alert-success text-center mb-4">Автопродление успешно отключено!</div>
      )}
      {isPremium && isAutoRenewal === false && (
        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handleRenew}
          disabled={renewLoading}
        >
          {renewLoading ? "Включение..." : "Возобновить подписку"}
        </button>
      )}
      {renewError && <div className="alert alert-danger text-center mb-3">{renewError}</div>}
      {isPremium && isAutoRenewal && (
        <>
          <p className="mb-4 text-center">Вы действительно хотите отменить автопродление подписки?</p>
          <button
            className="btn btn-danger w-100"
            onClick={handleCancel}
            disabled={loading || !user || !isPremium}
          >
            {loading ? "Отмена..." : "Отменить подписку"}
          </button>
          {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
        </>
      )}
      {!isPremium && isPremium !== null && (
        <div className="alert alert-info mt-3 text-center">У вас нет активной премиум-подписки.</div>
      )}
    </div>
  );
};

export default CancelSubscription; 