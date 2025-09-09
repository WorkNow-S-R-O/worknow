import { t, type Dictionary } from 'intlayer';

const imageUploadContent = {
	key: 'imageUpload',
	content: {
		imageModerationError: t({
			ru: 'Ошибка модерации изображения',
			en: 'Image moderation error',
			he: 'שגיאת סינון תמונה',
			ar: 'خطأ في مراجعة الصورة',
			uk: 'Помилка модерації зображення',
		}),
		imageUploadError: t({
			ru: 'Ошибка загрузки изображения',
			en: 'Image upload error',
			he: 'שגיאת העלאת תמונה',
			ar: 'خطأ في رفع الصورة',
			uk: 'Помилка завантаження зображення',
		}),
	},
} satisfies Dictionary;

export default imageUploadContent;
