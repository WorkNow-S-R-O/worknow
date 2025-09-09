import { type Dictionary, t } from 'intlayer';

const cityDropdownContent = {
	key: 'cityDropdown',
	content: {
		chooseCity: t({
			ru: 'Выберите город',
			en: 'Choose city',
			he: 'בחר עיר',
			ar: 'اختر المدينة',
			uk: 'Оберіть місто',
		}),
		cityAll: t({
			ru: 'Все города',
			en: 'All cities',
			he: 'כל הערים',
			ar: 'جميع المدن',
			uk: 'Всі міста',
		}),
	},
} satisfies Dictionary;

export default cityDropdownContent;
