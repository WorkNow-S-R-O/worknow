import { t, type Dictionary } from 'intlayer';

const jobCardContent = {
	key: 'jobCard',
	content: {
		premiumBadge: t({
			ru: 'Премиум',
			en: 'Premium',
			he: 'פרימיום',
			ar: 'بريميوم',
			uk: 'Преміум',
		}),
		salaryPerHourCard: t({
			ru: 'Зарплата в час:',
			en: 'Salary per hour:',
			he: 'שכר לשעה:',
			ar: 'الراتب في الساعة:',
			uk: 'Зарплата на годину:',
		}),
		locationCard: t({
			ru: 'Местоположение:',
			en: 'Location:',
			he: 'מיקום:',
			ar: 'الموقع:',
			uk: 'Місцезнаходження:',
		}),
		phoneNumberCard: t({
			ru: 'Номер телефона:',
			en: 'Phone number:',
			he: 'מספר טלפון:',
			ar: 'رقم الهاتف:',
			uk: 'Номер телефону:',
		}),
		shuttle: t({
			ru: 'Подвозка',
			en: 'Shuttle',
			he: 'הסעה',
			ar: 'النقل',
			uk: 'Підвезення',
		}),
		meals: t({
			ru: 'Питание',
			en: 'Meals',
			he: 'ארוחות',
			ar: 'الوجبات',
			uk: 'Харчування',
		}),
		yes: t({
			ru: 'Да',
			en: 'Yes',
			he: 'כן',
			ar: 'نعم',
			uk: 'Так',
		}),
		no: t({
			ru: 'Нет',
			en: 'No',
			he: 'לא',
			ar: 'لا',
			uk: 'Ні',
		}),
		notSpecified: t({
			ru: 'Не указано',
			en: 'Not specified',
			he: 'לא צוין',
			ar: 'غير محدد',
			uk: 'Не вказано',
		}),
		phoneNotSpecified: t({
			ru: 'Не указан',
			en: 'Not specified',
			he: 'לא צוין',
			ar: 'غير محدد',
			uk: 'Не вказано',
		}),
		descriptionMissing: t({
			ru: 'Описание отсутствует',
			en: 'No description',
			he: 'אין תיאור',
			ar: 'لا يوجد وصف',
			uk: 'Опис відсутній',
		}),
	},
} satisfies Dictionary;

export default jobCardContent;
