import { type Dictionary, t } from 'intlayer';

const billingPageContent = {
	key: 'billingPage',
	content: {
		billing_title: t({
			ru: 'Выставление счетов',
			en: 'Billing',
			he: 'חיוב',
			ar: 'الفواتير',
			uk: 'Виставлення рахунків',
		}),
		cancel_subscription: t({
			ru: 'Отмена подписки',
			en: 'Cancel subscription',
			he: 'ביטול מנוי',
			ar: 'إلغاء الاشتراك',
			uk: 'Скасування підписки',
		}),
		payment_history: t({
			ru: 'История платежей',
			en: 'Payment history',
			he: 'היסטוריית תשלומים',
			ar: 'تاريخ المدفوعات',
			uk: 'Історія платежів',
		}),
		no_transaction_history: t({
			ru: 'Нет истории транзакций. Пожалуйста,',
			en: 'No transaction history. Please',
			he: 'אין היסטוריית עסקאות. אנא',
			ar: 'لا يوجد تاريخ معاملات. من فضلك',
			uk: 'Немає історії транзакцій. Будь ласка,',
		}),
		sign_in: t({
			ru: 'Войдите на сайт',
			en: 'Sign in',
			he: 'התחבר לאתר',
			ar: 'تسجيل الدخول',
			uk: 'Увійдіть на сайт',
		}),
		loading: t({
			ru: 'Загрузка...',
			en: 'Loading...',
			he: 'טוען...',
			ar: 'جاري التحميل...',
			uk: 'Завантаження...',
		}),
		no_payments: t({
			ru: 'Нет платежей',
			en: 'No payments',
			he: 'אין תשלומים',
			ar: 'لا توجد مدفوعات',
			uk: 'Немає платежів',
		}),
		month: t({
			ru: 'Месяц',
			en: 'Month',
			he: 'חודש',
			ar: 'الشهر',
			uk: 'Місяць',
		}),
		amount: t({
			ru: 'Сумма',
			en: 'Amount',
			he: 'סכום',
			ar: 'المبلغ',
			uk: 'Сума',
		}),
		subscription_type: t({
			ru: 'Тип подписки',
			en: 'Subscription type',
			he: 'סוג מנוי',
			ar: 'نوع الاشتراك',
			uk: 'Тип підписки',
		}),
		date: t({
			ru: 'Дата',
			en: 'Date',
			he: 'תאריך',
			ar: 'التاريخ',
			uk: 'Дата',
		}),
		previous: t({
			ru: 'Предыдущая',
			en: 'Previous',
			he: 'הקודם',
			ar: 'السابق',
			uk: 'Попередня',
		}),
		next: t({
			ru: 'Следующая',
			en: 'Next',
			he: 'הבא',
			ar: 'التالي',
			uk: 'Наступна',
		}),
		error_loading_history: t({
			ru: 'Ошибка загрузки истории платежей',
			en: 'Error loading payment history',
			he: 'שגיאה בטעינת היסטוריית התשלומים',
			ar: 'خطأ في تحميل تاريخ المدفوعات',
			uk: 'Помилка завантаження історії платежів',
		}),
	},
} satisfies Dictionary;

export default billingPageContent;
