import { t, type Dictionary } from 'intlayer';

const jobFormContent = {
	key: 'jobForm',
	content: {
		createNewAdvertisement: t({
			ru: 'Создать новое объявление',
			en: 'Create new advertisement',
			he: 'צור מודעה חדשה',
			ar: 'إنشاء إعلان جديد',
			uk: 'Створити нове оголошення',
		}),
		jobCreatedSuccess: t({
			ru: 'Объявление успешно создано!',
			en: 'Advertisement created successfully!',
			he: 'המודעה נוצרה בהצלחה!',
			ar: 'تم إنشاء الإعلان بنجاح!',
			uk: 'Оголошення успішно створено!',
		}),
		mustBeAuthorized: t({
			ru: 'Вы должны быть авторизованы!',
			en: 'You must be authorized!',
			he: 'עליך להיות מורשה!',
			ar: 'يجب أن تكون مخولاً!',
			uk: 'Ви повинні бути авторизовані!',
		}),
	},
} satisfies Dictionary;

export default jobFormContent;
