import { t, type Dictionary } from 'intlayer';

const createNewAdContent = {
	key: 'createNewAd',
	content: {
		createNewAdvertisementTab: t({
			ru: 'Создать новое объявление',
			en: 'Create new advertisement',
			he: 'צור מודעה חדשה',
			ar: 'إنشاء إعلان جديد',
			uk: 'Створити нове оголошення',
		}),
		createNewAdvertisementDescription: t({
			ru: 'Создать новое объявление | Worknow',
			en: 'Create new advertisement | Worknow',
			he: 'צור מודעה חדשה | Worknow',
			ar: 'إنشاء إعلان جديد | Worknow',
			uk: 'Створити нове оголошення | Worknow',
		}),
	},
} satisfies Dictionary;

export default createNewAdContent;
