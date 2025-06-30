import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  console.log('user:', user);
  console.log('user.publicMetadata:', user?.publicMetadata);
  const { redirectToSignIn } = useClerk();
  const [loading, setLoading] = useState(false);
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API_URL}/users/${user.id}`)
      .then(res => setDbUser(res.data))
      .catch(() => setDbUser(null));
  }, [user]);

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
    <div className="container" style={{ paddingTop: 80, paddingBottom: 40 }}>
      <h1 className="text-center mb-4">{t("premium_title") || "Премиум тарифы"}</h1>
      {/* Показываем спиннер только если user есть, но dbUser ещё не загружен */}
      {user && dbUser === null ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : (
        <>
          <p className="text-center mb-5 text-muted" style={{maxWidth: 600, margin: '0 auto'}}>
            Быстро и удобно выберите подходящий тариф для продвижения ваших объявлений и получения максимальных преимуществ на WorkNow.
          </p>
          <div className="row justify-content-center align-items-end g-4 mb-5">
            {plans.map((plan) => {
              let isActive = false;
              let displayPrice = plan.price;
              let buttonText = plan.button.text;
              let priceId = plan.button.priceId;
              // Логика апгрейда
              if (plan.name === "Enterprise" && dbUser?.isPremium && !dbUser?.premiumDeluxe) {
                displayPrice = 100;
                buttonText = "Улучшить до Enterprise";
                priceId = "price_1Rfli2COLiDbHvw1xdMaguLf";
              }
              if (plan.name === "Premium" && dbUser?.isPremium) isActive = true;
              if (plan.name === "Enterprise" && dbUser?.premiumDeluxe) isActive = true;
              if (plan.name === "Premium" && dbUser?.premiumDeluxe) isActive = true;
              return (
                <div className="col-12 col-sm-10 col-md-6 col-lg-4 mb-4 mx-auto" key={plan.name}>
                  <div className={`card shadow-sm h-100 ${plan.highlight ? 'border-primary border-2' : ''}`}
                       style={plan.highlight ? {boxShadow: '0 0 0 2px #1976d2'} : {}}>
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-center mb-3">{plan.name}</h5>
                      <h2 className="card-price text-center mb-3">
                        {displayPrice === 0 ? '0' : `${displayPrice}₪`}<small className="text-muted">{plan.period}</small>
                      </h2>
                      <ul className="list-unstyled mb-4">
                        {plan.features.map(f => <li key={f} className="mb-2"><i className="bi bi-check2-circle text-success me-2"></i>{f}</li>)}
                      </ul>
                      {plan.price === 0 ? (
                        !user ? (
                          <button
                            className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                            onClick={() => redirectToSignIn()}
                          >
                            Войдите бесплатно
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
              );
            })}
          </div>
          <div className="text-center text-muted mt-4">
            <small>Сравните тарифы и выберите лучший для себя. Все цены указаны в шекелях (₪).</small>
          </div>
        </>
      )}
    </div>
  );
};

export default PremiumPage; 