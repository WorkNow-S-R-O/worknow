import { type Dictionary, t } from 'intlayer';

const accessDeniedPageContent = {
	key: 'accessDeniedPage',
	content: {
		accessDenied: t({
			ru: 'Доступ запрещен',
			en: 'Access Denied',
			he: 'גישה נדחתה',
			ar: 'تم رفض الوصول',
			uk: 'Доступ заборонено',
		}),
		backToHome: t({
			ru: 'Вернуться на главную',
			en: 'Back to Home',
			he: 'חזרה לעמוד הבית',
			ar: 'العودة إلى الصفحة الرئيسية',
			uk: 'Повернутися на головну',
		}),
	},
} satisfies Dictionary;

export default accessDeniedPageContent;
