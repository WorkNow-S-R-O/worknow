import { t, type Dictionary } from 'intlayer';

const newsletterAdminContent = {
	key: 'newsletterAdmin',
	content: {
		active: t({
			ru: 'Активный',
			en: 'Active',
			he: 'פעיל',
			ar: 'نشط',
			uk: 'Активний',
		}),
		inactive: t({
			ru: 'Неактивный',
			en: 'Inactive',
			he: 'לא פעיל',
			ar: 'غير نشط',
			uk: 'Неактивний',
		}),
		loading: t({
			ru: 'Загрузка',
			en: 'Loading',
			he: 'טוען',
			ar: 'جاري التحميل',
			uk: 'Завантаження',
		}),
	},
} satisfies Dictionary;

export default newsletterAdminContent;
