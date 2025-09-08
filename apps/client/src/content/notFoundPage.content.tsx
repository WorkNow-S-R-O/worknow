import { t, type Dictionary } from "intlayer";

const notFoundPageContent = {
  key: "notFoundPage",
  content: {
    pageNotFound: t({
      ru: "Страница не найдена",
      en: "Page not found",
      he: "הדף לא נמצא",
      ar: "الصفحة غير موجودة",
      uk: "Сторінку не знайдено",
    }),
    backToHome: t({
      ru: "Вернуться на главную",
      en: "Back to home",
      he: "חזור לעמוד הבית",
      ar: "العودة إلى الصفحة الرئيسية",
      uk: "Повернутися на головну",
    }),
  },
} satisfies Dictionary;

export default notFoundPageContent;