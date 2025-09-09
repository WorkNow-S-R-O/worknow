import { enUS, ruRU } from '@clerk/localizations';
import { create } from 'zustand';

// Создаём Zustand-хранилище для управления языком
const useLanguageStore = create((set) => {
	const storedLanguage = localStorage.getItem('language') || 'ru'; // Определяем язык из localStorage

	const getLocalization = (lang: string) => {
		switch (lang) {
			case 'en':
				return enUS;
			case 'he':
			case 'ar':
				// For Hebrew and Arabic, we'll use English localization as fallback
				// since Clerk doesn't have specific localizations for these languages
				return enUS;
			default:
				return ruRU;
		}
	};

	return {
		language: storedLanguage,
		localization: getLocalization(storedLanguage), // Устанавливаем локализацию сразу

		changeLanguage: (lang: string) => {
			const newLocalization = getLocalization(lang);
			localStorage.setItem('language', lang);
			set({ language: lang, localization: newLocalization });

			// Перезагружаем страницу, чтобы Clerk обновился
			window.location.reload();
		},
	};
});

export default useLanguageStore;
