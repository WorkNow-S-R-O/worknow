import { useState, useEffect } from "react";
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
      priceId: "price_1RfHjiCOLiDbHvw1repgIbnK"
    }
  }
];

const PremiumPage = () => {
  const { user } = useUser();
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
      <h1 className="text-center mb-3" style={{fontSize:48, fontWeight:700}}>Pricing</h1>
      <p className="text-center mb-5 text-muted" style={{maxWidth: 600, margin: '0 auto', fontSize:20}}>
        Quickly build an effective pricing table for your potential customers with this Bootstrap example. It&apos;s built with default Bootstrap components and utilities with little customization.
      </p>
      {/* Показываем спиннер только если user есть, но dbUser ещё не загружен */}
      {user && dbUser === null ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
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
              priceId = "price_1Rfli2COLiDbHvw1xdMaguLf";
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