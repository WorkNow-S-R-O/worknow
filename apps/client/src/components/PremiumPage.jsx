import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { useUserSync } from "../hooks/useUserSync.js";
import { useTranslation } from "react-i18next";
import { useLoadingProgress } from '../hooks/useLoadingProgress';

const API_URL = import.meta.env.VITE_API_URL;

const plans = [
  {
    name: "Free",
    price: 0,
    period: "/mo",
    features: [
      "10 объявлений",
      "Обычная выдача",
      "Базовая поддержка",
    ],
    button: {
      text: "Использовать бесплатно",
      variant: "outline-primary",
      action: (navigate) => navigate("/create-new-advertisement")
    }
  },
  {
    name: "Pro",
    price: 99,
    period: "/mo",
    features: [
      "Неограниченно объявлений",
      "Вакансии в топе",
      "Публикации в Telegram",
      "Выделение цветом",
      "Продвижение в Facebook",
      "Приоритетная поддержка"
    ],
    button: {
      text: "Купить Premium",
      variant: "primary",
      priceId: undefined
    },
    highlight: true
  },
  {
    name: "Enterprise",
    price: 199,
    period: "/mo",
    features: [
      "Все из Premium",
      "Персональный менеджер",
      "Доступ к AI-инструментам",
      "Спец. условия для компаний"
    ],
    button: {
      text: "Купить Enterprise",
      variant: "primary",
      priceId: "price_1Qt63NCOLiDbHvw13PRhpenX" // Test mode price ID for 99 ILS
    }
  }
];

const PremiumPage = () => {
  const { user } = useUser();
  const { redirectToSignIn } = useClerk();
  const [loading, setLoading] = useState(false);
  const { dbUser, loading: userLoading, error: userError } = useUserSync();
  const { startLoadingWithProgress, completeLoading } = useLoadingProgress();
  const { t } = useTranslation();

  const handlePay = async (priceId) => {
    if (!user) {
      redirectToSignIn();
      return;
    }
    setLoading(true);
    startLoadingWithProgress(2000); // Start progress bar for payment process
    
    try {
      const data = { clerkUserId: user.id };
      if (priceId) data.priceId = priceId;
      
      console.log('Creating checkout session with data:', data);
      
      const response = await axios.post(
        `${API_URL}/api/payments/create-checkout-session`,
        data
      );
      
      console.log('Checkout session created:', response.data);
      completeLoading(); // Complete progress when checkout session is created
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Payment error:', error);
      completeLoading(); // Complete progress even on error
      if (error.response?.status === 404) {
        alert("Пользователь не найден. Попробуйте войти заново.");
      } else if (error.response?.data?.error) {
        alert(`Ошибка оплаты: ${error.response.data.error}`);
      } else {
        alert("Ошибка оплаты. Попробуйте позже.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 40 }}>
      <h1 className="text-center mb-3" style={{fontSize:48, fontWeight:700}}>{t('pricing_title')}</h1>
      <p className="text-center mb-5 text-muted" style={{maxWidth: 600, margin: '0 auto', fontSize:20}}>
        {t('pricing_description')}
      </p>
      {/* Показываем спиннер только если user есть, но dbUser ещё не загружен */}
      {user && userLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : userError ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
          <div className="alert alert-warning" role="alert">
            Ошибка загрузки данных пользователя: {userError}
          </div>
        </div>
      ) : (
        <div className="row justify-content-center align-items-stretch g-4 mb-5">
          {plans.map((plan) => {
            let isActive = false;
            let displayPrice = plan.price;
            let buttonText = plan.button.text;
            let priceId = plan.button.priceId;
            // Логика апгрейда
            if (plan.name === "Enterprise" && dbUser?.isPremium && !dbUser?.premiumDeluxe) {
              displayPrice = 100;
              buttonText = "Улучшить до Enterprise";
              priceId = "price_1Qt63NCOLiDbHvw13PRhpenX"; // Test mode price ID
            }
            if (plan.name === "Pro") {
              isActive = dbUser?.isPremium || dbUser?.premiumDeluxe;
            }
            if (plan.name === "Enterprise" && dbUser?.premiumDeluxe) isActive = true;
            return (
              <div className="col-12 col-md-6 col-lg-4 d-flex" key={plan.name}>
                <div className="card shadow-sm flex-fill d-flex flex-column h-100" style={{minWidth:0}}>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-center mb-3" style={{fontWeight:600, fontSize:24}}>{plan.name}</h5>
                    <h2 className="card-price text-center mb-3" style={{fontSize:40, fontWeight:700}}>
                      {displayPrice === 0 ? "0" : `${displayPrice}₪`}<small className="text-muted">{plan.period}</small>
                    </h2>
                    <ul className="list-unstyled mb-4">
                      {plan.features.map(f => <li key={f} className="mb-2 text-center">{f}</li>)}
                    </ul>
                    <div className="mt-auto">
                      {plan.price === 0 ? (
                        !user ? (
                          <button
                            className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                            onClick={() => redirectToSignIn()}
                          >
                            Использовать бесплатно
                          </button>
                        ) : (
                          <button
                            className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                            disabled
                          >
                            Активен
                          </button>
                        )
                      ) : (
                        <button
                          className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                          onClick={() => handlePay(priceId)}
                          disabled={loading || isActive}
                        >
                          {isActive ? 'Активен' : (loading ? 'Загрузка...' : buttonText)}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PremiumPage; 