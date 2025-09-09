import { getHTMLTextDir } from 'intlayer';
import { useEffect } from 'react';
import { useLocale } from 'react-intlayer';

/**
 * Updates the HTML <html> element's `lang` and `dir` attributes based on the current locale.
 * Also dynamically loads the appropriate Bootstrap CSS (LTR or RTL) based on the locale.
 * - `lang`: Informs browsers and search engines of the page's language.
 * - `dir`: Ensures the correct reading order (e.g., 'ltr' for English, 'rtl' for Arabic).
 *
 * This dynamic update is essential for proper text rendering, accessibility, and SEO.
 */
export const useI18nHTMLAttributes = () => {
	const { locale } = useLocale();

	useEffect(() => {
		// Update the language attribute to the current locale.
		document.documentElement.lang = locale;

		// Set the text direction based on the current locale.
		// For Hebrew and Arabic, we need to explicitly set RTL
		let textDir = getHTMLTextDir(locale);
		if (locale === 'he' || locale === 'ar') {
			textDir = 'rtl';
		} else if (textDir === 'auto') {
			textDir = 'ltr'; // Default to LTR for auto
		}

		document.documentElement.dir = textDir;

		// Dynamically load Bootstrap CSS based on locale
		const isRTL = textDir === 'rtl';
		const bootstrapCSSId = 'bootstrap-css';

		// Remove existing Bootstrap CSS (both local and CDN)
		const existingCSS = document.getElementById(bootstrapCSSId);
		if (existingCSS) {
			existingCSS.remove();
		}

		// Also remove any existing Bootstrap CSS from the head
		const existingBootstrapLinks = document.querySelectorAll(
			'link[href*="bootstrap"]',
		);
		existingBootstrapLinks.forEach((link) => {
			if (link.id !== bootstrapCSSId) {
				link.remove();
			}
		});

		// Create new link element for Bootstrap CSS
		const link = document.createElement('link');
		link.id = bootstrapCSSId;
		link.rel = 'stylesheet';
		link.href = isRTL
			? 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css'
			: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css';

		// Add to head
		document.head.appendChild(link);

		// Cleanup function
		return () => {
			const cssToRemove = document.getElementById(bootstrapCSSId);
			if (cssToRemove) {
				cssToRemove.remove();
			}
		};
	}, [locale]);
};
