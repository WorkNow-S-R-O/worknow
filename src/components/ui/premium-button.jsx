import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const PremiumButton = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [premiumUntil, setPremiumUntil] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/users/${user.id}`);
        setIsPremium(response.data.isPremium);
        setPremiumUntil(response.data.premiumUntil);
      } catch (error) {
        console.error('Ошибка получения данных пользователя:', error);
      }
    };

    fetchUser();
  }, [user]);

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/create-checkout-session', {
        userId: user.id,
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Ошибка при создании сессии оплаты:', error);
    }
  };

  return (
    <Sheet className="z-9999">
      <SheetTrigger asChild>
        <button type="button" className={`btn ${isPremium ? 'btn-success' : 'btn-warning'}`}>
          <i className="bi bi-gem me-2"></i>
          {isPremium ? t('premium_active') : t('premium')}
        </button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <SheetHeader>
            <SheetTitle>{t("premium_title")}</SheetTitle>
            <SheetDescription>
              {t("premium_description")}
            </SheetDescription>
          </SheetHeader>

          <div className="my-4 p-4 bg-primary rounded-lg shadow">
            <h3 className="text-lg font-bold text-white mb-2">{t("premium_benefits_title")}</h3>
            <ul className="list-disc list-inside text-white">
              <li>{t("premium_benefit_1")}</li>
              <li>{t("premium_benefit_3")}</li>
              <li>{t("premium_benefit_5")}</li>
              <li>{t("premium_benefit_2")}</li>
            </ul>
          </div>

          <div className="flex justify-center items-center my-4">
            <img
              src="./images/premium.png"
              alt="premium"
              className=""
            />
          </div>

          {premiumUntil && isPremium && (
            <p className="text-center text-muted">
              {t('premium_until')} {new Date(premiumUntil).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mt-auto">
          {isPremium ? (
            <button
              type="button"
              className="btn btn-success w-full py-3 text-lg"
              disabled
            >
              {t('premium_active')}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary w-full py-3 text-lg"
              onClick={handleCheckout}
            >
              {t('pay_now')} 99 ₪
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PremiumButton;
