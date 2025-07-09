import { create } from "zustand";
import { ruRU, enUS } from "@clerk/localizations";

// Создаём Zustand-хранилище для управления языком
const useLanguageStore = create((set) => {
  const storedLanguage = localStorage.getItem("language") || "ru"; // Определяем язык из localStorage

  return {
    language: storedLanguage,
    localization: storedLanguage === "en" ? enUS : ruRU, // Устанавливаем локализацию сразу

    changeLanguage: (lang) => {
      const newLocalization = lang === "en" ? enUS : ruRU;
      localStorage.setItem("language", lang);
      set({ language: lang, localization: newLocalization });

      // Перезагружаем страницу, чтобы Clerk обновился
      window.location.reload();
    },
  };
});

export default useLanguageStore;
