import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";

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
    name: "Premium",
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
      priceId: undefined // для 99 — дефолтный тариф
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
      variant: "info",
      priceId: "price_1RfHjiCOLiDbHvw1repgIbnK"
    }
  }
];

const PremiumPage = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { redirectToSignIn } = useClerk();
  const [loading, setLoading] = useState(false);

  const handlePay = async (priceId) => {
    if (!user) {
      redirectToSignIn();
      return;
    }
    setLoading(true);
    try {
      const data = { clerkUserId: user.id };
      if (priceId) data.priceId = priceId;
      const response = await axios.post(
        `${API_URL}/payments/create-checkout-session`,
        data
      );
      window.location.href = response.data.url;
    } catch {
      alert("Ошибка оплаты. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container py-5 flex-grow-1">
        <h1 className="text-center mb-4">{t("premium_title") || "Премиум тарифы"}</h1>
        <p className="text-center mb-5 text-muted" style={{maxWidth: 600, margin: '0 auto'}}>
          Быстро и удобно выберите подходящий тариф для продвижения ваших объявлений и получения максимальных преимуществ на WorkNow.
        </p>
        <div className="row justify-content-center align-items-end g-4 mb-5">
          {plans.map((plan) => (
            <div className="col-12 col-md-6 col-lg-4" key={plan.name}>
              <div className={`card shadow-sm h-100 ${plan.highlight ? 'border-primary border-2' : ''}`}
                   style={plan.highlight ? {boxShadow: '0 0 0 2px #1976d2'} : {}}>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-center mb-3">{plan.name}</h5>
                  <h2 className="card-price text-center mb-3">
                    {plan.price === 0 ? '0' : `${plan.price}₪`}<small className="text-muted">{plan.period}</small>
                  </h2>
                  <ul className="list-unstyled mb-4">
                    {plan.features.map(f => <li key={f} className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i>{f}</li>)}
                  </ul>
                  {plan.price === 0 ? (
                    <button
                      className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                      onClick={() => plan.button.action(window.location)}
                    >
                      {plan.button.text}
                    </button>
                  ) : (
                    <button
                      className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                      onClick={() => handlePay(plan.button.priceId)}
                      disabled={loading}
                    >
                      {loading ? 'Загрузка...' : plan.button.text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center text-muted mt-4">
          <small>Сравните тарифы и выберите лучший для себя. Все цены указаны в шекелях (₪).</small>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PremiumPage; 