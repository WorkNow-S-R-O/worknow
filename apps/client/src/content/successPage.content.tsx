import { type Dictionary, t } from 'intlayer';

const successPageContent = {
	key: 'successPage',
	content: {
		title: t({
			ru: 'Платеж успешно обработан!',
			en: 'Payment Successfully Processed!',
			he: 'התשלום עובד בהצלחה!',
			ar: 'تم معالجة الدفع بنجاح!',
			uk: 'Платіж успішно оброблено!',
		}),
		subtitle: t({
			ru: 'Ваша подписка активирована',
			en: 'Your subscription has been activated',
			he: 'המנוי שלך הופעל',
			ar: 'تم تفعيل اشتراكك',
			uk: 'Ваша підписка активована',
		}),
		processing: t({
			ru: 'Обработка платежа',
			en: 'Processing payment',
			he: 'מעבד תשלום',
			ar: 'معالجة الدفع',
			uk: 'Обробка платежу',
		}),
		waitMessage: t({
			ru: 'Пожалуйста, подождите, пока мы активируем вашу подписку Premium. Это займет всего несколько секунд.',
			en: 'Please wait while we activate your Premium subscription. This will only take a few seconds.',
			he: 'אנא המתן בזמן שאנו מפעילים את מנוי הפרימיום שלך. זה ייקח רק כמה שניות.',
			ar: 'يرجى الانتظار بينما نقوم بتفعيل اشتراكك المميز. سيستغرق هذا بضع ثوانٍ فقط.',
			uk: 'Будь ласка, зачекайте, поки ми активуємо вашу підписку Premium. Це займе лише кілька секунд.',
		}),
		redirecting: t({
			ru: 'Перенаправление на страницу Premium...',
			en: 'Redirecting to Premium page...',
			he: 'מפנה לעמוד פרימיום...',
			ar: 'إعادة توجيه إلى صفحة المميز...',
			uk: 'Перенаправлення на сторінку Premium...',
		}),
	},
} satisfies Dictionary;

export default successPageContent;
