import { Locales, type IntlayerConfig } from 'intlayer';

// Function to get the default locale from localStorage or browser
const getDefaultLocale = () => {
	if (typeof window !== 'undefined') {
		// Check localStorage first
		const savedLanguage = localStorage.getItem('worknow-language');
		if (savedLanguage) {
			return savedLanguage as any;
		}

		// Auto-detect browser language
		const browserLang = navigator.language || navigator.languages[0];
		let detectedLang = 'ru'; // Default fallback

		// Map browser language codes to our supported languages
		if (browserLang.startsWith('en')) {
			detectedLang = 'en';
		} else if (browserLang.startsWith('he') || browserLang.startsWith('iw')) {
			detectedLang = 'he';
		} else if (browserLang.startsWith('ar')) {
			detectedLang = 'ar';
		} else if (browserLang.startsWith('uk') || browserLang.startsWith('ua')) {
			detectedLang = 'uk';
		} else if (browserLang.startsWith('ru')) {
			detectedLang = 'ru';
		}

		return detectedLang as any;
	}

	return Locales.RUSSIAN; // Server-side fallback
};

const config: IntlayerConfig = {
	internationalization: {
		locales: [
			Locales.RUSSIAN,
			Locales.ENGLISH,
			Locales.HEBREW,
			Locales.ARABIC,
			Locales.UKRAINIAN,
		],
		defaultLocale: getDefaultLocale(),
		// Use strict mode to ensure all locales are properly implemented
		strictMode: 'inclusive',
	},
};

export default config;
