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
      price: 200, // Base price for new users
      period: "/mo",
      features: [
        { textKey: "pricing_deluxe_all_from_pro", icon: "✨", color: "text-warning" },
        { textKey: "pricing_deluxe_personal_manager", icon: "👨‍💼", color: "text-primary" },
        { textKey: "pricing_deluxe_facebook_autoposting", icon: "⚡", color: "text-info" },
        { textKey: "pricing_deluxe_facebook_promotion", icon: "📢", color: "text-success" },
        { textKey: "pricing_deluxe_personal_mailing", icon: "📧", color: "text-primary" },
        { textKey: "pricing_deluxe_telegram_publications", icon: "🔥", color: "text-info" },
        { textKey: "pricing_deluxe_personal_candidate_selection", icon: "🎯", color: "text-warning" },
        { textKey: "pricing_deluxe_interview_organization", icon: "🤝", color: "text-success" },
      ],
      button: {
        textKey: "pricing_deluxe_buy_deluxe",
        variant: "primary",
        priceId: "price_1RqXuoCOLiDbHvw1LLew4Mo8" // Price ID for 200 ILS
      },
      bestResults: true
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
      {/* Enhanced Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark mb-4" style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
          lineHeight: 1.2
        }}>
          {t('pricing_title')}
        </h1>
        
        <div className="mx-auto" style={{ maxWidth: 700 }}>
          <p className="lead text-secondary" style={{
            fontSize: '1.25rem',
            lineHeight: 1.7,
            fontWeight: 400,
            color: '#6c757d',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            {t('pricing_description')}
          </p>
        </div>
      </div>

      {/* Показываем спиннер только если user есть, но dbUser ещё не загружен */}
      {user && userLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('loading')}</span>
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

            // Deluxe pricing logic
            if (plan.name === "Deluxe") {
              if (user && dbUser?.isPremium && !dbUser?.premiumDeluxe) {
                // User has Pro but not Deluxe - show upgrade price
                displayPrice = 100;
                buttonText = t('pricing_deluxe_upgrade_to_deluxe');
                priceId = "price_1RqXveCOLiDbHvw18RQxj2g6"; // Price ID for 100 ILS upgrade
              } else if (!user || !dbUser?.isPremium) {
                // New user or no Pro subscription - show full price
                displayPrice = 200;
                buttonText = t(plan.button.textKey);
                priceId = plan.button.priceId;
              }
              // If user already has Deluxe, isActive will be true and button will show "Active"
            }
            return (
              <div className="col-12 col-md-6 col-lg-4 d-flex" key={plan.name}>
                <div className={`card flex-fill d-flex flex-column h-100 pricing-card ${plan.highlight ? 'border-primary shadow-lg' : 'shadow-sm'}`} 
                     style={{
                       minWidth: 0,
                       border: plan.highlight ? '2px solid #0d6efd' : '1px solid #dee2e6',
                       borderRadius: '16px',
                       transition: 'all 0.3s ease',
                       cursor: 'pointer',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px)';
                       e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.15)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0)';
                       e.currentTarget.style.boxShadow = plan.highlight ? '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' : '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
                     }}>
                  <div className="card-body d-flex flex-column p-4 h-100" style={{
                    background: plan.highlight 
                      ? 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                  }}>
                    {/* Enhanced Badge Section */}
                    {plan.highlight && (
                      <div className="text-center mb-4">
                        <span className="badge px-4 py-2" style={{ 
                          fontSize: '0.9rem',
                          borderRadius: '25px',
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                          color: 'white',
                          boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          ⭐ {t('pricing_recommended')}
                        </span>
                      </div>
                    )}
                    {plan.bestResults && (
                      <div className="text-center mb-4">
                        <span className="badge px-4 py-2" style={{ 
                          fontSize: '0.9rem',
                          borderRadius: '25px',
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                          color: 'white',
                          boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          🏆 {t('pricing_best_results')}
                        </span>
                      </div>
                    )}
                    
                    {/* Enhanced Plan Title */}
                    <h5 className="card-title text-center mb-4" style={{
                      fontWeight: 700,
                      fontSize: '1.75rem',
                      color: '#2c3e50',
                      letterSpacing: '-0.01em',
                      textTransform: 'uppercase',
                      marginTop: plan.name === "Free" ? '50px' : '0'
                    }}>
                      {plan.name === "Free" ? t('pricing_free_title') : plan.name
                      }
                    </h5>
                    
                    {/* Enhanced Price Section */}
                    <div className="text-center mb-5" style={{
                      marginTop: plan.name === "Free" ? '0px' : '0'
                    }}>
                      <h2 className="mb-2" style={{
                        fontSize: '3.5rem',
                        fontWeight: 800,
                        color: '#2c3e50',
                        lineHeight: 1,
                        margin: 0
                      }}>
                        {displayPrice === 0 ? "0" : `${displayPrice}₪`}
                        <small className="d-block text-muted" style={{
                          fontSize: '0.4em',
                          fontWeight: 500,
                          marginTop: '5px',
                          opacity: 0.7
                        }}>
                          {plan.period}
                        </small>
                      </h2>
                      
                      {plan.name === "Deluxe" && user && dbUser?.isPremium && !dbUser?.premiumDeluxe && (
                        <div className="mt-3">
                          <span className="text-decoration-line-through text-muted me-3" style={{
                            fontSize: '1.2rem',
                            fontWeight: 500,
                            opacity: 0.6
                          }}>
                            200₪
                          </span>
                          <span className="badge px-3 py-2" style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #198754 0%, #157347 100%)',
                            color: 'white',
                            borderRadius: '20px'
                          }}>
                            -50%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Features List - Flexbox for consistent height */}
                    <div className="flex-grow-1 d-flex flex-column">
                      <ul className="list-unstyled mb-5 flex-grow-1" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        marginTop: plan.name === "Free" ? '0px' : '0'
                      }}>
                        {plan.features.map((feature, index) => (
                          <li key={index} className="mb-4 d-flex align-items-start" style={{ 
                            padding: '12px 0',
                            borderBottom: index < plan.features.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                          }}>
                            <div className="me-3 d-flex align-items-center justify-content-center" 
                                 style={{ 
                                   fontSize: '1.4rem', 
                                   minWidth: '40px',
                                   height: '40px',
                                   borderRadius: '50%',
                                   backgroundColor: feature.color === 'text-primary' ? '#e3f2fd' :
                                                  feature.color === 'text-success' ? '#e8f5e8' :
                                                  feature.color === 'text-warning' ? '#fff3cd' :
                                                  feature.color === 'text-info' ? '#e1f5fe' :
                                                  feature.color === 'text-danger' ? '#ffebee' : '#f5f5f5',
                                   boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                 }}>
                              <span className={feature.color} style={{ fontSize: '1.1rem' }}>{feature.icon}</span>
                            </div>
                            <span className="text-secondary" style={{ 
                              fontSize: '0.95rem', 
                              lineHeight: '1.6',
                              flex: 1,
                              fontWeight: 500,
                              color: '#495057'
                            }}>
                              {t(feature.textKey)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Enhanced Button Section */}
                    <div className="mt-auto">
                      {plan.price === 0 ? (
                        !user ? (
                          <button
                            className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                            onClick={() => redirectToSignIn()}
                            style={{
                              borderRadius: '12px',
                              fontWeight: '700',
                              transition: 'all 0.3s ease',
                              padding: '15px 20px',
                              fontSize: '1.1rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {t('pricing_free_use_free')}
                          </button>
                        ) : (
                          <button
                            className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                            disabled={isActive}
                            style={{
                              borderRadius: '12px',
                              fontWeight: '700',
                              transition: 'all 0.3s ease',
                              padding: '15px 20px',
                              fontSize: '1.1rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {isActive ? t('active') : buttonText}
                          </button>
                        )
                      ) : (
                        <button
                          className={`btn btn-lg w-100 btn-${plan.button.variant}`}
                          onClick={() => handlePay(priceId)}
                          disabled={loading || isActive}
                          style={{
                            borderRadius: '12px',
                            fontWeight: '700',
                            transition: 'all 0.3s ease',
                            padding: '15px 20px',
                            fontSize: '1.1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            boxShadow: plan.highlight ? '0 6px 20px rgba(13, 110, 253, 0.4)' : 'none'
                          }}
                        >
                          {isActive ? t('active') : (loading ? t('loading') : buttonText)}
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