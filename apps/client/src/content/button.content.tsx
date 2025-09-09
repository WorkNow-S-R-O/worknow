import { type Dictionary, t } from 'intlayer';

const buttonContent = {
	key: 'button',
	content: {
		buttonCreateNewAdvertisement: t({
			ru: 'Создать объявление',
			en: 'Create advertisement',
			he: 'צור מודעה',
			ar: 'إنشاء إعلان',
			uk: 'Створити оголошення',
		}),
		messageLoginToViewAds: t({
			ru: 'Войдите, чтобы просматривать объявления',
			en: 'Sign in to view advertisements',
			he: 'התחבר כדי לצפות במודעות',
			ar: 'سجل الدخول لعرض الإعلانات',
			uk: 'Увійдіть, щоб переглядати оголошення',
		}),
	},
} satisfies Dictionary;

export default buttonContent;
