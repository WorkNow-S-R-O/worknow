import { t, type Dictionary } from "intlayer";

const cancelPageContent = {
  key: "cancelPage",
  content: {
    payment_cancelled: t({
      ru: "Платеж отменен",
      en: "Payment Cancelled",
      he: "התשלום בוטל",
      ar: "تم إلغاء الدفع",
      uk: "Платіж скасовано",
    }),
    payment_cancelled_description: t({
      ru: "Ваш платеж был отменен. Вы можете попробовать снова или вернуться на главную страницу.",
      en: "Your payment has been cancelled. You can try again or return to the home page.",
      he: "התשלום שלך בוטל. אתה יכול לנסות שוב או לחזור לעמוד הבית.",
      ar: "تم إلغاء دفعتك. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.",
      uk: "Ваш платіж було скасовано. Ви можете спробувати знову або повернутися на головну сторінку.",
    }),
    try_again: t({
      ru: "Попробовать снова",
      en: "Try Again",
      he: "נסה שוב",
      ar: "حاول مرة أخرى",
      uk: "Спробувати знову",
    }),
    redirecting_soon: t({
      ru: "Перенаправление на главную страницу через несколько секунд...",
      en: "Redirecting to home page in a few seconds...",
      he: "מפנה לעמוד הבית בעוד כמה שניות...",
      ar: "إعادة التوجيه إلى الصفحة الرئيسية خلال بضع ثوان...",
      uk: "Перенаправлення на головну сторінку через кілька секунд...",
    }),
    payment_transaction_error: t({
      ru: "Ошибка при создании платежа",
      en: "Error creating payment",
      he: "שגיאה ביצירת תשלום",
      ar: "خطأ في إنشاء الدفع",
      uk: "Помилка створення платежу",
    }),
  },
} satisfies Dictionary;

export default cancelPageContent;
