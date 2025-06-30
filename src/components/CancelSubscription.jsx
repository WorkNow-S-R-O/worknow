import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const CancelSubscription = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(null);

  useEffect(() => {
    const fetchPremium = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${API_URL}/users/${user.id}`);
        setIsPremium(res.data.isPremium);
      } catch {
        setIsPremium(false);
      }
    };
    fetchPremium();
  }, [user]);

  const handleCancel = async () => {
    if (!user || !isPremium) return;
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_URL}/payments/cancel-auto-renewal`, {
        clerkUserId: user.id,
      });
      setSuccess(true);
    } catch (e) {
      setError("Ошибка при отмене подписки. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480, margin: '0 auto', paddingTop: 60 }}>
      <h2 className="text-center mb-4">Отмена подписки</h2>
      {success ? (
        <div className="alert alert-success text-center">Автопродление успешно отключено!</div>
      ) : (
        <>
          <p className="mb-4 text-center">Вы действительно хотите отменить автопродление подписки?</p>
          <button
            className="btn btn-danger w-100"
            onClick={handleCancel}
            disabled={loading || !user || !isPremium}
          >
            {loading ? "Отмена..." : "Отменить подписку"}
          </button>
          {!isPremium && isPremium !== null && (
            <div className="alert alert-info mt-3 text-center">У вас нет активной премиум-подписки.</div>
          )}
          {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
        </>
      )}
    </div>
  );
};

export default CancelSubscription; 