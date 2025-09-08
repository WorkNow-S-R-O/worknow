import { t, type Dictionary } from "intlayer";

const mailDropdownContent = {
  key: "mailDropdown",
  content: {
    loading: t({
      ru: "Загрузка",
      en: "Loading",
      he: "טוען",
      ar: "جاري التحميل",
      uk: "Завантаження",
    }),
    mailNewBadge: t({
      ru: "Новое",
      en: "New",
      he: "חדש",
      ar: "جديد",
      uk: "Нове",
    }),
  },
} satisfies Dictionary;

export default mailDropdownContent;
