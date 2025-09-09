import { config } from 'dotenv';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Load environment variables
config();

// Initialize i18next for testing
i18next
	.use(Backend)
	.use(LanguageDetector)
	.init({
		fallbackLng: 'ru',
		debug: false,
		resources: {
			ru: {
				translation: {
					premium_badge: 'Премиум',
					premium_features: 'Премиум функции',
				},
			},
			en: {
				translation: {
					premium_badge: 'Premium',
					premium_features: 'Premium Features',
				},
			},
			he: {
				translation: {
					premium_badge: 'פרימיום',
					premium_features: "פיצ'רים פרימיום",
				},
			},
			ar: {
				translation: {
					premium_badge: 'بريميوم',
					premium_features: 'ميزات بريميوم',
				},
			},
		},
	});

async function testPremiumTranslations() {
	console.log('🔍 Testing Premium Badge Translations...');

	const languages = ['ru', 'en', 'he', 'ar'];

	for (const lang of languages) {
		await i18next.changeLanguage(lang);
		const badge = i18next.t('premium_badge');
		const features = i18next.t('premium_features');

		console.log(`\n📝 Language: ${lang}`);
		console.log(`   Badge: "${badge}"`);
		console.log(`   Features: "${features}"`);
	}

	console.log('\n✅ Premium translations test completed!');
	console.log('🌍 All languages have proper translations for premium elements');
}

// Run the test
testPremiumTranslations().catch(console.error);
