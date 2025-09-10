import { t, type Dictionary } from 'intlayer';

const successPageContent = {
	key: 'successPage',
	content: {
		title: t({
			ru: 'Платеж успешно обработан!',
			en: 'Payment successfully processed!',
			he: 'התשלום עובד בהצלחה!',
			ar: 'تم معالجة الدفع بنجاح!',
			uk: 'Платіж успішно оброблено!',
		}),
		subtitle: t({
			ru: 'Ваш премиум аккаунт активируется в течение нескольких минут',
			en: 'Your premium account will be activated within a few minutes',
			he: 'חשבון הפרימיום שלך יופעל תוך מספר דקות',
			ar: 'سيتم تفعيل حسابك المميز خلال بضع دقائق',
			uk: 'Ваш преміум акаунт буде активовано протягом кількох хвилин',
		}),
		processing: t({
			ru: 'Обработка платежа',
			en: 'Processing payment',
			he: 'מעבד תשלום',
			ar: 'معالجة الدفع',
			uk: 'Обробка платежу',
		}),
		waitMessage: t({
			ru: 'Пожалуйста, подождите, пока мы обрабатываем ваш платеж и активируем премиум функции',
			en: 'Please wait while we process your payment and activate premium features',
			he: 'אנא המתן בזמן שאנו מעבדים את התשלום שלך ומפעילים תכונות פרימיום',
			ar: 'يرجى الانتظار بينما نعالج دفعتك ونفعل الميزات المميزة',
			uk: 'Будь ласка, зачекайте, поки ми обробляємо ваш платіж і активуємо преміум функції',
		}),
		redirecting: t({
			ru: 'Перенаправление на страницу премиум...',
			en: 'Redirecting to premium page...',
			he: 'מפנה לעמוד פרימיום...',
			ar: 'إعادة توجيه إلى صفحة المميزة...',
			uk: 'Перенаправлення на сторінку преміум...',
		}),
		premiumActivated: t({
			ru: '🎉 Premium активирован!',
			en: '🎉 Premium activated!',
			he: '🎉 פרימיום הופעל!',
			ar: '🎉 تم تفعيل المميز!',
			uk: '🎉 Преміум активовано!',
		}),
		activationError: t({
			ru: 'Ошибка активации Premium',
			en: 'Premium activation error',
			he: 'שגיאה בהפעלת פרימיום',
			ar: 'خطأ في تفعيل المميز',
			uk: 'Помилка активації преміум',
		}),
	},
} satisfies Dictionary;

export default successPageContent;
