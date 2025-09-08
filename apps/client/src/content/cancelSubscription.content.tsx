import { t, type Dictionary } from "intlayer";

const cancelSubscriptionContent = {
  key: "cancelSubscription",
  content: {
    cancel_subscription_title: t({
      ru: "Отмена подписки",
      en: "Cancel Subscription",
      he: "ביטול מנוי",
      ar: "إلغاء الاشتراك",
      uk: "Скасування підписки",
    }),
    no_active_subscription: t({
      ru: "Нет действующей подписки. Пожалуйста,",
      en: "No active subscription. Please",
      he: "אין מנוי פעיל. אנא",
      ar: "لا يوجد اشتراك نشط. من فضلك",
      uk: "Немає активної підписки. Будь ласка,",
    }),
    sign_in_to_account: t({
      ru: "Войдите в аккаунт",
      en: "Sign in to account",
      he: "התחבר לחשבון",
      ar: "تسجيل الدخول إلى الحساب",
      uk: "Увійдіть в акаунт",
    }),
    auto_renewal_disabled: t({
      ru: "Автопродление успешно отключено!",
      en: "Auto-renewal successfully disabled!",
      he: "חידוש אוטומטי הושבת בהצלחה!",
      ar: "تم إلغاء التجديد التلقائي بنجاح!",
      uk: "Автопродовження успішно вимкнено!",
    }),
    enable_loading: t({
      ru: "Включение...",
      en: "Enabling...",
      he: "מאפשר...",
      ar: "تفعيل...",
      uk: "Увімкнення...",
    }),
    renew_subscription: t({
      ru: "Возобновить подписку",
      en: "Renew subscription",
      he: "חדש מנוי",
      ar: "تجديد الاشتراك",
      uk: "Поновлення підписки",
    }),
    confirm_cancel_auto_renewal: t({
      ru: "Вы действительно хотите отменить автопродление подписки?",
      en: "Do you really want to cancel subscription auto-renewal?",
      he: "האם אתה באמת רוצה לבטל את חידוש המנוי האוטומטי?",
      ar: "هل تريد حقاً إلغاء التجديد التلقائي للاشتراك؟",
      uk: "Ви дійсно хочете скасувати автопродовження підписки?",
    }),
    cancel_loading: t({
      ru: "Отмена...",
      en: "Cancelling...",
      he: "מבטל...",
      ar: "إلغاء...",
      uk: "Скасування...",
    }),
    cancel_subscription_button: t({
      ru: "Отменить подписку",
      en: "Cancel subscription",
      he: "בטל מנוי",
      ar: "إلغاء الاشتراك",
      uk: "Скасувати підписку",
    }),
    no_premium_subscription: t({
      ru: "У вас нет премиум подписки",
      en: "You don't have a premium subscription",
      he: "אין לך מנוי פרימיום",
      ar: "ليس لديك اشتراك مميز",
      uk: "У вас немає преміум підписки",
    }),
    error_cancel_subscription: t({
      ru: "Ошибка при отмене подписки. Попробуйте позже.",
      en: "Error cancelling subscription. Please try again later.",
      he: "שגיאה בביטול המנוי. נסה שוב מאוחר יותר.",
      ar: "خطأ في إلغاء الاشتراك. يرجى المحاولة مرة أخرى لاحقاً.",
      uk: "Помилка скасування підписки. Спробуйте пізніше.",
    }),
    error_renew_subscription: t({
      ru: "Ошибка при возобновлении подписки. Попробуйте позже.",
      en: "Error renewing subscription. Please try again later.",
      he: "שגיאה בחידוש המנוי. נסה שוב מאוחר יותר.",
      ar: "خطأ في تجديد الاشتراك. يرجى المحاولة مرة أخرى لاحقاً.",
      uk: "Помилка поновлення підписки. Спробуйте пізніше.",
    }),
  },
} satisfies Dictionary;

export default cancelSubscriptionContent;
