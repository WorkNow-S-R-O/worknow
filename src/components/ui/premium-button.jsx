import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import React from "react";
import PremiumBenefitsCard from './PremiumBenefitsCard';

const API_URL = import.meta.env.VITE_API_URL;

const PremiumButtonSkeleton = React.forwardRef((props, ref) => (
  <div ref={ref} className="relative h-10 w-32 bg-gray-200 rounded animate-pulse" {...props}>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
    </div>
  </div>
));
PremiumButtonSkeleton.displayName = "PremiumButtonSkeleton";


const PremiumButton = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { redirectToSignIn } = useClerk(); // Функция для редиректа на страницу входа
  const [isPremium, setIsPremium] = useState(false);
  const [isAutoRenewal, setIsAutoRenewal] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPremium2, setExpandedPremium2] = useState(false);
  const [selectedTariff, setSelectedTariff] = useState('99');

  useEffect(() => {
    // Предварительная загрузка изображения
    const preloadImage = new Image();
    preloadImage.src = "/images/premium.png";
  }, []);

  useEffect(() => {
    const fetchUserPremiumStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/users/${user.id}`);
        setIsPremium(response.data.isPremium);
        setIsAutoRenewal(response.data.isAutoRenewal);
      } catch (error) {
        console.error("Ошибка получения статуса Premium:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPremiumStatus();
  }, [user]);

  const handleCheckout = async () => {
    if (!user) {
      // Если пользователь не авторизован, перенаправляем его на страницу входа
      redirectToSignIn();
      return;
    }

    try {
      const data = { clerkUserId: user.id };
      if (selectedTariff === '199') {
        data.priceId = 'price_1RfHjiCOLiDbHvw1repgIbnK';
      }
      const response = await axios.post(
        `${API_URL}/payments/create-checkout-session`,
        data
      );

      window.location.href = response.data.url;
    } catch {
      toast.error(t("payment_error"));
    }
  };

  const handleCancelAutoRenewal = async () => {
    try {
      await axios.post(`${API_URL}/payments/cancel-auto-renewal`, {
        clerkUserId: user.id,
      });

      setIsAutoRenewal(false);
      toast.success("Автопродление успешно отключено!");
    } catch (error) {
      console.error("Ошибка отмены автопродления:", error);
      toast.error("Ошибка при отмене автопродления.");
    }
  };

  // Бенефиты для тарифов
  const benefits99 = [
    { key: 'b1', value: t("premium_benefit_1") },
    { key: 'b2', value: <a href="https://t.me/WORKNOW_JOBS" target="_blank" rel="noopener noreferrer" className="underline text-white">{t("premium_benefit_3")}</a> },
    { key: 'b3', value: t("premium_benefit_5") },
    { key: 'b4', value: <a href="https://www.facebook.com/groups/763040732570299" target="_blank" rel="noopener noreferrer" className="underline text-white">{t("premium_benefit_2")}</a> },
  ];
  const benefits199 = [
    t("premium_benefit_1"),
    t("premium_benefit_5"),
    t("premium_benefit_3"),
    t("premium_benefit_2"),
    t("premium_benefit_4") || 'Доступ к функциям ИИ',
    t("premium_benefit_extra") || 'Персональный менеджер',
  ];

  return (
    <Sheet className="z-9999">
      <SheetTrigger asChild>
        {isLoading ? (
          <PremiumButtonSkeleton />
        ) : (
          <button
            type="button"
            className={`btn ${isPremium ? "btn-primary" : "btn-warning"}`}
          >
            <i className="bi bi-gem me-2"></i>
            {isPremium ? t("premium_active") : t("premium")}
          </button>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <SheetHeader>
            <SheetTitle>{t("premium_title")}</SheetTitle>
            <SheetDescription>{t("premium_description")}</SheetDescription>
          </SheetHeader>

          {/* Первая плашка — всегда раскрыта */}
          <PremiumBenefitsCard
            title={t("premium_benefits_title") + " (99₪)"}
            benefits={benefits99.map(b => ({...b}))}
            color="#1976d2"
            expanded={!expandedPremium2}
            price={t("purchase")}
            onToggle={() => {
              setExpandedPremium2(false);
              setSelectedTariff('99');
            }}
          />

          {/* Вторая плашка — раскрывается по клику */}
          <PremiumBenefitsCard
            title={t("premium_benefits_title") + " (199₪)"}
            benefits={benefits199}
            color="#1565c0"
            expanded={expandedPremium2}
            onToggle={() => {
              setExpandedPremium2(v => {
                const next = !v;
                setSelectedTariff(next ? '199' : '99');
                return next;
              });
            }}
            price={t("purchase_199") || "Приобрести за 199 ₪"}
          >
            {/* Можно добавить спец. описание или иконку */}
          </PremiumBenefitsCard>

          <div className="flex justify-center items-center my-4">
            <img src="/images/premium.png" alt="premium" className="" />
          </div>

          <div className="text-center my-4">
            <a
              href="https://foggy-macrame-d24.notion.site/1a281d115acf801eabf3e8a40c9f0a84?pvs=4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {t("how_it_works")}
            </a>
          </div>
        </div>

        <div className="mt-auto text-center text-lg font-semibold text-primary">
          {isPremium ? (
            isAutoRenewal ? (
              <button
                type="button"
                className="btn btn-danger w-full py-3 text-lg"
                onClick={handleCancelAutoRenewal}
              >
                {t("cancel_subscription")}
              </button>
            ) : (
              <p className="text-danger">Автопродление отключено</p>
            )
          ) : (
            <button
              type="button"
              className="btn btn-primary w-full py-3 text-lg"
              onClick={handleCheckout}
            >
              {selectedTariff === '199'
                ? (t("purchase_199") || 'Приобрести за 199 ₪')
                : t("purchase")}
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PremiumButton;
