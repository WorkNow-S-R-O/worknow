import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { useUserSync } from "../hooks/useUserSync.js";
import { useTranslation } from "react-i18next";
import { useLoadingProgress } from '../hooks/useLoadingProgress';

const API_URL = import.meta.env.VITE_API_URL;

const PremiumPage = () => {
  const { user } = useUser();
  const { redirectToSignIn } = useClerk();
  const [loading, setLoading] = useState(false);
  const { dbUser, loading: userLoading, error: userError, refreshUser } = useUserSync();
  const { startLoadingWithProgress, completeLoading } = useLoadingProgress();
  const { t } = useTranslation();

  // Create plans with translations
  const getPlans = () => [
    {
      name: "Free",
      price: 0,
      period: "/mo",
      features: [
        { textKey: "pricing_free_up_to_5_ads", icon: "📝", color: "text-primary" },
        { textKey: "pricing_free_daily_boost", icon: "📈", color: "text-success" },
        { textKey: "pricing_free_basic_support", icon: "💬", color: "text-info" },
      ],
      button: {
        textKey: "pricing_free_use_free",
        variant: "outline-primary",
        action: (navigate) => navigate("/create-new-advertisement")
      }
    },
    {
      name: "Pro",
      price: 99,
      period: "/mo",
      features: [
        { textKey: "pricing_pro_up_to_10_ads", icon: "📝", color: "text-primary" },
        { textKey: "pricing_pro_unlimited_seeker_data", icon: "👥", color: "text-success" },
        { textKey: "pricing_pro_top_jobs", icon: "⭐", color: "text-warning" },
        { textKey: "pricing_pro_color_highlighting", icon: "🎨", color: "text-info" },
        { textKey: "pricing_pro_advanced_filters", icon: "🔍", color: "text-primary" },
        { textKey: "pricing_pro_recruiter_community", icon: "🔒", color: "text-success" },
        { textKey: "pricing_pro_priority_support", icon: "🚀", color: "text-danger" },
      ],
      button: {
        textKey: "pricing_pro_buy_premium",
        variant: "primary",
        priceId: undefined
      },
      highlight: true
    },
    {
      name: "Deluxe",
      price: 199,
      period: "/mo",
      features: [
        { textKey: "pricing_deluxe_all_from_pro", icon: "✨", color: "text-warning" },
        { textKey: "pricing_deluxe_personal_manager", icon: "👨‍💼", color: "text-primary" },
        { textKey: "pricing_deluxe_facebook_autoposting", icon: "📱", color: "text-info" },
        { textKey: "pricing_deluxe_facebook_promotion", icon: "📢", color: "text-success" },
        { textKey: "pricing_deluxe_personal_mailing", icon: "📧", color: "text-primary" },
        { textKey: "pricing_deluxe_telegram_publications", icon: "📺", color: "text-info" },
        { textKey: "pricing_deluxe_personal_candidate_selection", icon: "🎯", color: "text-warning" },
        { textKey: "pricing_deluxe_interview_organization", icon: "🤝", color: "text-success" },
      ],
      button: {
        textKey: "pricing_deluxe_buy_deluxe",
        variant: "primary",
        priceId: "price_1RqXuoCOLiDbHvw1LLew4Mo8" // Test mode price ID for 99 ILS
      }
    }
  ];

  // Auto-refresh user data when coming from success page
  useEffect(() => {
    const fromSuccess = window.location.search.includes('fromSuccess=true');
    if (fromSuccess && user && !userLoading) {
      refreshUser();
      // Remove the parameter to prevent infinite refresh
      window.history.replaceState({}, '', '/premium');
    }
  }, [user, userLoading, refreshUser]);

  // Auto-refresh user data when coming from success page
  useEffect(() => {
    const fromSuccess = window.location.search.includes('fromSuccess=true');
    if (fromSuccess && user && !userLoading) {
      refreshUser();
      // Remove the parameter to prevent infinite refresh
      window.history.replaceState({}, '', '/premium');
    }
  }, [user, userLoading, refreshUser]);

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
      
      const response = await axios.post(
        `${API_URL}/api/payments/create-checkout-session`,
        data
      );
      completeLoading(); // Complete progress when checkout session is created
      window.location.href = response.data.url;
    } catch (error) {
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
          {getPlans().map((plan) => {
            let isActive = false;
            let displayPrice = plan.price;
            let buttonText = t(plan.button.textKey);
            let priceId = plan.button.priceId;

            // Determine plan status based on user subscription
            if (plan.name === "Free") {
              // Free plan is always active for logged-in users
              isActive = !!user;
            } else if (plan.name === "Pro") {
              isActive = dbUser?.isPremium || dbUser?.premiumDeluxe;
            } else if (plan.name === "Deluxe") {
              isActive = dbUser?.premiumDeluxe;
            }

            // Deluxe upgrade logic - only for logged-in users with Pro but not Deluxe
            if (plan.name === "Deluxe" && user && dbUser?.isPremium && !dbUser?.premiumDeluxe) {
              displayPrice = 100;
              buttonText = "Улучшить до Deluxe";
              priceId = "price_1RqXveCOLiDbHvw18RQxj2g6";
            }
            return (
              <div className="col-12 col-md-6 col-lg-4 d-flex" key={plan.name}>
                <div className={`card flex-fill d-flex flex-column h-100 pricing-card ${plan.highlight ? 'border-primary shadow-lg' : 'shadow-sm'}`} 
                     style={{
                       minWidth: 0,
                       border: plan.highlight ? '2px solid #0d6efd' : '1px solid #dee2e6',
                       borderRadius: '12px',
                       transition: 'all 0.3s ease',
                       cursor: 'pointer'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-5px)';
                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0)';
                       e.currentTarget.style.boxShadow = plan.highlight ? '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' : '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
                     }}>
                  <div className="card-body d-flex flex-column p-4" style={{
                    background: plan.highlight 
                      ? 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                  }}>
                    {plan.highlight && (
                      <div className="text-center mb-3">
                        <span className="badge bg-primary px-3 py-2" style={{ 
                          fontSize: '0.8rem',
                          borderRadius: '20px',
                          fontWeight: '600'
                        }}>
                          ⭐ {t('pricing_recommended')}
                        </span>
                      </div>
                    )}
                    <h5 className="card-title text-center mb-3" style={{fontWeight:600, fontSize:24}}>{plan.name}</h5>
                    <h2 className="card-price text-center mb-4" style={{fontSize:40, fontWeight:700}}>
                      {displayPrice === 0 ? "0" : `${displayPrice}₪`}<small className="text-muted" style={{fontSize: '0.5em'}}>{plan.period}</small>
                    </h2>
                    <ul className="list-unstyled mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="mb-3 d-flex align-items-start" style={{ padding: '8px 0' }}>
                          <div className="me-3 d-flex align-items-center justify-content-center" 
                               style={{ 
                                 fontSize: '1.3rem', 
                                 minWidth: '32px',
                                 height: '32px',
                                 borderRadius: '50%',
                                 backgroundColor: feature.color === 'text-primary' ? '#e3f2fd' :
                                                feature.color === 'text-success' ? '#e8f5e8' :
                                                feature.color === 'text-warning' ? '#fff3cd' :
                                                feature.color === 'text-info' ? '#e1f5fe' :
                                                feature.color === 'text-danger' ? '#ffebee' : '#f5f5f5'
                               }}>
                            <span className={feature.color} style={{ fontSize: '1rem' }}>{feature.icon}</span>
                          </div>
                          <span className="text-muted" style={{ 
                            fontSize: '0.9rem', 
                            lineHeight: '1.5',
                            flex: 1
                          }}>
                            {t(feature.textKey)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto">
                      {plan.price === 0 ? (
                        !user ? (
                          <button
                            className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                            onClick={() => redirectToSignIn()}
                            style={{
                              borderRadius: '8px',
                              fontWeight: '600',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {t('pricing_free_use_free')}
                          </button>
                        ) : (
                          <button
                            className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                            disabled={isActive}
                            style={{
                              borderRadius: '8px',
                              fontWeight: '600',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {isActive ? 'Активен' : buttonText}
                          </button>
                        )
                      ) : (
                        <button
                          className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                          onClick={() => handlePay(priceId)}
                          disabled={loading || isActive}
                          style={{
                            borderRadius: '8px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            boxShadow: plan.highlight ? '0 4px 12px rgba(13, 110, 253, 0.3)' : 'none'
                          }}
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