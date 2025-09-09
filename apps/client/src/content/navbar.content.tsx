import { t, type Dictionary } from 'intlayer';

const navbarContent = {
	key: 'navbar',
	content: {
		// Navigation items
		vacancies: t({
			ru: 'Вакансии',
			en: 'Vacancies',
			he: 'משרות',
			ar: 'الوظائف',
			uk: 'Вакансії',
		}),
		seekers: t({
			ru: 'Соискатели',
			en: 'Job seekers',
			he: 'מחפשי עבודה',
			ar: 'الباحثون عن عمل',
			uk: 'Шукачі роботи',
		}),
		jobs: t({
			ru: 'Мои объявления',
			en: 'My Jobs',
			he: 'המודעות שלי',
			ar: 'وظائفي',
			uk: 'Мої оголошення',
		}),
		support: t({
			ru: 'Поддержка',
			en: 'Support',
			he: 'תמיכה',
			ar: 'الدعم',
			uk: 'Підтримка',
		}),
		rules: t({
			ru: 'Пользовательское соглашение',
			en: 'Terms of Service',
			he: 'תנאי שירות',
			ar: 'شروط الخدمة',
			uk: 'Угода користувача',
		}),
		technicalSupport: t({
			ru: 'Техническая поддержка',
			en: 'Technical Support',
			he: 'תמיכה טכנית',
			ar: 'الدعم التقني',
			uk: 'Технічна підтримка',
		}),
		billing: t({
			ru: 'Выставление счетов',
			en: 'Billing',
			he: 'חיוב',
			ar: 'الفواتير',
			uk: 'Виставлення рахунків',
		}),
		signIn: t({
			ru: 'Войти',
			en: 'Sign In',
			he: 'התחבר',
			ar: 'تسجيل الدخول',
			uk: 'Увійти',
		}),

		// Language names
		languageNames: {
			ru: t({
				ru: 'Русский',
				en: 'Russian',
				he: 'רוסית',
				ar: 'الروسية',
				uk: 'Російська',
			}),
			en: t({
				ru: 'English',
				en: 'English',
				he: 'אנגלית',
				ar: 'الإنجليزية',
				uk: 'Англійська',
			}),
			he: t({
				ru: 'עברית',
				en: 'Hebrew',
				he: 'עברית',
				ar: 'العبرية',
				uk: 'Іврит',
			}),
			ar: t({
				ru: 'العربية',
				en: 'Arabic',
				he: 'ערבית',
				ar: 'العربية',
				uk: 'Арабська',
			}),
			uk: t({
				ru: 'Украинский',
				en: 'Ukrainian',
				he: 'אוקראינית',
				ar: 'الأوكرانية',
				uk: 'Українська',
			}),
		},
	},
} satisfies Dictionary;

export default navbarContent;
