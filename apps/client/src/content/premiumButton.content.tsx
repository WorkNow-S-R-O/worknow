import { t, type Dictionary } from "intlayer";

const premiumButtonContent = {
  key: "premiumButton",
  content: {
    premium: t({
      ru: "Премиум",
      en: "Premium",
      he: "פרמיום",
      ar: "بريميوم",
      uk: "Преміум",
    }),
  },
} satisfies Dictionary;

export default premiumButtonContent;
