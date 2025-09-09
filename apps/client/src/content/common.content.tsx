import { t, type Dictionary } from 'intlayer';

const commonContent = {
	key: 'common',
	content: {
		// Navigation
		login: t({
			ru: 'Войти',
			en: 'Login',
			he: 'התחבר',
			ar: 'تسجيل الدخول',
			uk: 'Увійти',
		}),
		premium: t({
			ru: 'Тарифы',
			en: 'Premium',
			he: 'פרימיום',
			ar: 'بريميوم',
			uk: 'Тарифи',
		}),
		vacancies: t({
			ru: 'Вакансии',
			en: 'Vacancies',
			he: 'משרות',
			ar: 'الوظائف',
			uk: 'Вакансії',
		}),
		jobs: t({
			ru: 'Мои объявления',
			en: 'My Jobs',
			he: 'המודעות שלי',
			ar: 'وظائفي',
			uk: 'Мої оголошення',
		}),
		facebookGroup: t({
			ru: 'Группа Facebook',
			en: 'Facebook Group',
			he: 'קבוצת פייסבוק',
			ar: 'مجموعة فيسبوك',
			uk: 'Група Facebook',
		}),
		backToHome: t({
			ru: 'Вернуться на главную',
			en: 'Back to home',
			he: 'חזרה לעמוד הבית',
			ar: 'العودة للصفحة الرئيسية',
			uk: 'Повернутися на головну',
		}),
		signIn: t({
			ru: 'Войти',
			en: 'Sign In',
			he: 'התחבר',
			ar: 'تسجيل الدخول',
			uk: 'Увійти',
		}),

		// Job Management
		createNewAdvertisement: t({
			ru: 'Создать новое объявление',
			en: 'Create new advertisement',
			he: 'צור מודעה חדשה',
			ar: 'إنشاء إعلان جديد',
			uk: 'Створити нове оголошення',
		}),
		jobTitle: t({
			ru: 'Название вакансии',
			en: 'Job title',
			he: 'כותרת המשרה',
			ar: 'عنوان الوظيفة',
			uk: 'Назва вакансії',
		}),
		writeJobTitle: t({
			ru: 'Введите название вакансии',
			en: 'Enter job title',
			he: 'הזן כותרת משרה',
			ar: 'أدخل عنوان الوظيفة',
			uk: 'Введіть назву вакансії',
		}),
		salaryPerHour: t({
			ru: 'Зарплата в час',
			en: 'Salary per hour',
			he: 'שכר לשעה',
			ar: 'الراتب في الساعة',
			uk: 'Зарплата на годину',
		}),
		writeSalary: t({
			ru: 'Введите зарплату',
			en: 'Enter salary',
			he: 'הזן שכר',
			ar: 'أدخل الراتب',
			uk: 'Введіть зарплату',
		}),
		location: t({
			ru: 'Местоположение',
			en: 'Location',
			he: 'מיקום',
			ar: 'الموقع',
			uk: 'Місцезнаходження',
		}),
		writeCityOrDetailedAddress: t({
			ru: 'Введите город или точный адрес',
			en: 'Enter city or detailed address',
			he: 'הזן עיר או כתובת מפורטת',
			ar: 'أدخل المدينة أو العنوان التفصيلي',
			uk: 'Введіть місто або точну адресу',
		}),
		description: t({
			ru: 'Описание',
			en: 'Description',
			he: 'תיאור',
			ar: 'الوصف',
			uk: 'Опис',
		}),
		writeJobDescription: t({
			ru: 'Введите описание вакансии',
			en: 'Enter job description',
			he: 'הזן תיאור משרה',
			ar: 'أدخل وصف الوظيفة',
			uk: 'Введіть опис вакансії',
		}),
		create: t({
			ru: 'Опубликовать',
			en: 'Publish',
			he: 'פרסם',
			ar: 'نشر',
			uk: 'Опублікувати',
		}),
		phoneNumber: t({
			ru: 'Номер телефона',
			en: 'Phone number',
			he: 'מספר טלפון',
			ar: 'رقم الهاتف',
			uk: 'Номер телефону',
		}),
		writePhoneNumber: t({
			ru: 'Введите номер телефона',
			en: 'Enter phone number',
			he: 'הזן מספר טלפון',
			ar: 'أدخل رقم الهاتف',
			uk: 'Введіть номер телефону',
		}),
		improveWithAI: t({
			ru: 'Улучшить с помощью ИИ',
			en: 'Improve with AI',
			he: 'שפר עם AI',
			ar: 'تحسين بالذكاء الاصطناعي',
			uk: 'Покращити за допомогою ШІ',
		}),

		// Premium
		premiumTitle: t({
			ru: 'Премиум аккаунт',
			en: 'Premium account',
			he: 'חשבון פרימיום',
			ar: 'حساب بريميوم',
			uk: 'Преміум акаунт',
		}),
		premiumDescription: t({
			ru: 'Премиум подписка помогает вам как минимум в два раза быстрее найти рабочий персонал',
			en: 'Premium subscription helps you find staff at least twice as fast',
			he: 'מנוי פרימיום עוזר לך למצוא צוות לפחות פי שניים מהר יותר',
			ar: 'الاشتراك المميز يساعدك في العثور على الموظفين بسرعة مضاعفة على الأقل',
			uk: 'Преміум підписка допомагає вам як мінімум у два рази швидше знайти робочий персонал',
		}),
		premiumBenefitsTitle: t({
			ru: 'Что вы получите?',
			en: 'What will you get?',
			he: 'מה תקבל?',
			ar: 'ماذا ستحصل؟',
			uk: 'Що ви отримаєте?',
		}),
		premiumBenefit1: t({
			ru: 'Ваши вакансии будут в топе',
			en: 'Your jobs will be on top',
			he: 'המשרות שלך יהיו בראש',
			ar: 'ستكون وظائفك في المقدمة',
			uk: 'Ваші вакансії будуть в топі',
		}),
		premiumBenefit2: t({
			ru: 'Продвижение в Facebook',
			en: 'Facebook promotion',
			he: 'קידום בפייסבוק',
			ar: 'الترويج في فيسبوك',
			uk: 'Просування в Facebook',
		}),
		premiumBenefit3: t({
			ru: 'Публикации в телеграме',
			en: 'Telegram publications',
			he: 'פרסומים בטלגרם',
			ar: 'المنشورات في تلغرام',
			uk: 'Публікації в телеграмі',
		}),
		premiumBenefit5: t({
			ru: 'Ваши вакансии будут выделенны цветом',
			en: 'Your jobs will be highlighted in color',
			he: 'המשרות שלך יודגשו בצבע',
			ar: 'ستتميز وظائفك بالألوان',
			uk: 'Ваші вакансії будуть виділені кольором',
		}),

		// Common Actions
		save: t({
			ru: 'Сохранить',
			en: 'Save',
			he: 'שמור',
			ar: 'حفظ',
			uk: 'Зберегти',
		}),
		cancel: t({
			ru: 'Отмена',
			en: 'Cancel',
			he: 'בטל',
			ar: 'إلغاء',
			uk: 'Скасувати',
		}),
		delete: t({
			ru: 'Удалить',
			en: 'Delete',
			he: 'מחק',
			ar: 'حذف',
			uk: 'Видалити',
		}),
		edit: t({
			ru: 'Редактировать',
			en: 'Edit',
			he: 'ערוך',
			ar: 'تحرير',
			uk: 'Редагувати',
		}),
		loading: t({
			ru: 'Загрузка...',
			en: 'Loading...',
			he: 'טוען...',
			ar: 'جاري التحميل...',
			uk: 'Завантаження...',
		}),
		confirmDelete: t({
			ru: 'Подтвердите удаление',
			en: 'Confirm deletion',
			he: 'אשר מחיקה',
			ar: 'تأكيد الحذف',
			uk: 'Підтвердіть видалення',
		}),
		confirmDeleteText: t({
			ru: 'Вы точно хотите удалить это объявление? Это действие нельзя отменить.',
			en: 'Are you sure you want to delete this advertisement? This action cannot be undone.',
			he: 'האם אתה בטוח שברצונך למחוק את המודעה הזו? לא ניתן לבטל פעולה זו.',
			ar: 'هل أنت متأكد من أنك تريد حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.',
			uk: 'Ви точно хочете видалити це оголошення? Цю дію неможливо скасувати.',
		}),

		// Categories and Cities
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
		city: t({
			ru: 'Город',
			en: 'City',
			he: 'עיר',
			ar: 'المدينة',
			uk: 'Місто',
		}),
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

		// Seekers
		seekers: t({
			ru: 'Соискатели',
			en: 'Job seekers',
			he: 'מחפשי עבודה',
			ar: 'الباحثون عن عمل',
			uk: 'Шукачі роботи',
		}),
		seekersDescription: t({
			ru: 'Список соискателей на вакансии',
			en: 'List of job seekers',
			he: 'רשימת מחפשי עבודה',
			ar: 'قائمة الباحثين عن عمل',
			uk: 'Список шукачів роботи',
		}),
		noSeekersFound: t({
			ru: 'Соискатели не найдены',
			en: 'No seekers found',
			he: 'לא נמצאו מחפשי עבודה',
			ar: 'لم يتم العثور على باحثين عن عمل',
			uk: 'Шукачі роботи не знайдені',
		}),
		noSeekersDescription: t({
			ru: 'Попробуйте изменить фильтры или загляните позже',
			en: 'Try changing filters or check back later',
			he: 'נסה לשנות מסננים או בדוק מאוחר יותר',
			ar: 'حاول تغيير المرشحات أو تحقق لاحقاً',
			uk: 'Спробуйте змінити фільтри або загляньте пізніше',
		}),

		// Filters
		filters: t({
			ru: 'Фильтры',
			en: 'Filters',
			he: 'מסננים',
			ar: 'المرشحات',
			uk: 'Фільтри',
		}),
		reset: t({
			ru: 'Сбросить',
			en: 'Reset',
			he: 'איפוס',
			ar: 'إعادة تعيين',
			uk: 'Скинути',
		}),
		closeFilter: t({
			ru: 'Закрыть фильтр',
			en: 'Close filter',
			he: 'סגור מסנן',
			ar: 'إغلاق المرشح',
			uk: 'Закрити фільтр',
		}),
		notSpecified: t({
			ru: 'Не указано',
			en: 'Not specified',
			he: 'לא צוין',
			ar: 'غير محدد',
			uk: 'Не вказано',
		}),

		// Status
		active: t({
			ru: 'Активен',
			en: 'Active',
			he: 'פעיל',
			ar: 'نشط',
			uk: 'Активний',
		}),
		inactive: t({
			ru: 'Неактивен',
			en: 'Inactive',
			he: 'לא פעיל',
			ar: 'غير نشط',
			uk: 'Неактивний',
		}),
		premiumBadge: t({
			ru: 'Премиум',
			en: 'Premium',
			he: 'פרימיום',
			ar: 'بريميوم',
			uk: 'Преміум',
		}),

		// Yes/No
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

		// Close
		close: t({
			ru: 'Закрыть',
			en: 'Close',
			he: 'סגור',
			ar: 'إغلاق',
			uk: 'Закрити',
		}),
	},
} satisfies Dictionary;

export default commonContent;
