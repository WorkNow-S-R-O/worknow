import { t, type Dictionary } from 'intlayer';

const editJobFieldsContent = {
	key: 'editJobFields',
	content: {
		jobTitle: t({
			ru: 'Название вакансии',
			en: 'Job title',
			he: 'כותרת המשרה',
			ar: 'عنوان الوظيفة',
			uk: 'Назва вакансії',
		}),
		salaryPerHour: t({
			ru: 'Зарплата в час',
			en: 'Salary per hour',
			he: 'שכר לשעה',
			ar: 'الراتب في الساعة',
			uk: 'Зарплата на годину',
		}),
		location: t({
			ru: 'Местоположение',
			en: 'Location',
			he: 'מיקום',
			ar: 'الموقع',
			uk: 'Місцезнаходження',
		}),
		chooseCity: t({
			ru: 'Выберите город',
			en: 'Choose city',
			he: 'בחר עיר',
			ar: 'اختر المدينة',
			uk: 'Оберіть місто',
		}),
		category: t({
			ru: 'Категория',
			en: 'Category',
			he: 'קטגוריה',
			ar: 'الفئة',
			uk: 'Категорія',
		}),
		chooseCategory: t({
			ru: 'Выберите категорию',
			en: 'Choose category',
			he: 'בחר קטגוריה',
			ar: 'اختر الفئة',
			uk: 'Оберіть категорію',
		}),
		phoneNumber: t({
			ru: 'Телефон',
			en: 'Phone number',
			he: 'טלפון',
			ar: 'رقم الهاتف',
			uk: 'Телефон',
		}),
		description: t({
			ru: 'Описание',
			en: 'Description',
			he: 'תיאור',
			ar: 'الوصف',
			uk: 'Опис',
		}),
		shuttle: t({
			ru: 'Подвозка',
			en: 'Shuttle',
			he: 'הסעות',
			ar: 'مواصلات',
			uk: 'Підвезення',
		}),
		meals: t({
			ru: 'Питание',
			en: 'Meals',
			he: 'ארוחות',
			ar: 'وجبات',
			uk: 'Харчування',
		}),
	},
} satisfies Dictionary;

export default editJobFieldsContent;
