import { create } from "zustand";
import { ruRU, enUS } from "@clerk/localizations";

// Создаём хранилище Zustand для управления языком
const useLanguageStore = create((set) => ({
  language: localStorage.getItem("language") || "ru",
  localization:
    (localStorage.getItem("language") || "ru") === "en" ? enUS : ruRU,
  changeLanguage: (lang) => {
    const newLocalization = lang === "en" ? enUS : ruRU;
    localStorage.setItem("language", lang);
    set({ language: lang, localization: newLocalization });
  },
}));

export default useLanguageStore;
