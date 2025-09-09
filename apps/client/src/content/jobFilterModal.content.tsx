import { t, type Dictionary } from 'intlayer';

const jobFilterModalContent = {
	key: 'jobFilterModal',
	content: {
		filterModalTitle: t({
			ru: 'Фильтры',
			en: 'Filters',
			he: 'מסננים',
			ar: 'مرشحات',
			uk: 'Фільтри',
		}),
		category: t({
			ru: 'Категория',
			en: 'Category',
			he: 'קטגוריה',
			ar: 'فئة',
			uk: 'Категорія',
		}),
		chooseCategory: t({
			ru: 'Выберите категорию',
			en: 'Choose category',
			he: 'בחר קטגוריה',
			ar: 'اختر الفئة',
			uk: 'Оберіть категорію',
		}),
		filterSalaryLabel: t({
			ru: 'Зарплата от',
			en: 'Salary from',
			he: 'שכר מ',
			ar: 'الراتب من',
			uk: 'Зарплата від',
		}),
		filterSalaryPlaceholder: t({
			ru: 'Введите сумму',
			en: 'Enter amount',
			he: 'הזן סכום',
			ar: 'أدخل المبلغ',
			uk: 'Введіть суму',
		}),
		shuttle: t({
			ru: 'Трансфер',
			en: 'Shuttle',
			he: 'הסעה',
			ar: 'النقل',
			uk: 'Трансфер',
		}),
		meals: t({
			ru: 'Питание',
			en: 'Meals',
			he: 'ארוחות',
			ar: 'الوجبات',
			uk: 'Харчування',
		}),
		reset: t({
			ru: 'Сбросить',
			en: 'Reset',
			he: 'איפוס',
			ar: 'إعادة تعيين',
			uk: 'Скинути',
		}),
		save: t({
			ru: 'Сохранить',
			en: 'Save',
			he: 'שמור',
			ar: 'حفظ',
			uk: 'Зберегти',
		}),
		categoriesLoadError: t({
			ru: 'Ошибка загрузки категорий',
			en: 'Error loading categories',
			he: 'שגיאה בטעינת קטגוריות',
			ar: 'خطأ في تحميل الفئات',
			uk: 'Помилка завантаження категорій',
		}),
	},
} satisfies Dictionary;

export default jobFilterModalContent;
