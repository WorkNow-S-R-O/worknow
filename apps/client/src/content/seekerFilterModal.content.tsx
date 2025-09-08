import { t, type Dictionary } from "intlayer";

const seekerFilterModalContent = {
  key: "seekerFilterModal",
  content: {
    // Modal title and actions
    filterModalTitle: t({
      ru: "Фильтры соискателей",
      en: "Seeker filters",
      he: "מסנני מועמדים",
      ar: "فلاتر المرشحين",
      uk: "Фільтри шукачів роботи",
    }),
    reset: t({
      ru: "Сбросить",
      en: "Reset",
      he: "איפוס",
      ar: "إعادة تعيين",
      uk: "Скинути",
    }),
    save: t({
      ru: "Сохранить",
      en: "Save",
      he: "שמור",
      ar: "حفظ",
      uk: "Зберегти",
    }),
    
    // Basic fields
    category: t({
      ru: "Категория",
      en: "Category",
      he: "קטגוריה",
      ar: "الفئة",
      uk: "Категорія",
    }),
    city: t({
      ru: "Город",
      en: "City",
      he: "עיר",
      ar: "المدينة",
      uk: "Місто",
    }),
    employment: t({
      ru: "Занятость",
      en: "Employment",
      he: "תעסוקה",
      ar: "العمالة",
      uk: "Зайнятість",
    }),
    gender: t({
      ru: "Пол",
      en: "Gender",
      he: "מין",
      ar: "الجنس",
      uk: "Стать",
    }),
    languages: t({
      ru: "Языки",
      en: "Languages",
      he: "שפות",
      ar: "اللغات",
      uk: "Мови",
    }),
    demanded: t({
      ru: "Востребованный",
      en: "In demand",
      he: "מבוקש",
      ar: "مطلوب",
      uk: "Затребуваний",
    }),
    documentType: t({
      ru: "Тип документа",
      en: "Document type",
      he: "סוג מסמך",
      ar: "نوع الوثيقة",
      uk: "Тип документа",
    }),
    
    // Choose placeholders
    chooseCategory: t({
      ru: "Выберите категорию",
      en: "Choose category",
      he: "בחר קטגוריה",
      ar: "اختر الفئة",
      uk: "Оберіть категорію",
    }),
    chooseCity: t({
      ru: "Выберите город",
      en: "Choose city",
      he: "בחר עיר",
      ar: "اختر المدينة",
      uk: "Оберіть місто",
    }),
    chooseDocumentType: t({
      ru: "Выберите тип документа",
      en: "Choose document type",
      he: "בחר סוג מסמך",
      ar: "اختر نوع الوثيقة",
      uk: "Оберіть тип документа",
    }),
    chooseEmployment: t({
      ru: "Выберите тип занятости",
      en: "Choose employment type",
      he: "בחר סוג תעסוקה",
      ar: "اختر نوع العمالة",
      uk: "Оберіть тип зайнятості",
    }),
    chooseGender: t({
      ru: "Выберите пол",
      en: "Choose gender",
      he: "בחר מין",
      ar: "اختر الجنس",
      uk: "Оберіть стать",
    }),
    
    // Document types
    documentOther: t({
      ru: "Другое",
      en: "Other",
      he: "אחר",
      ar: "أخرى",
      uk: "Інше",
    }),
    documentTeudatZehut: t({
      ru: "Теудат зеут",
      en: "Teudat zehut",
      he: "תעודת זהות",
      ar: "هوية شخصية",
      uk: "Теудат зеут",
    }),
    documentVisaB1: t({
      ru: "Виза Б1",
      en: "Visa B1",
      he: "ויזה B1",
      ar: "فيزا B1",
      uk: "Віза Б1",
    }),
    documentVisaB2: t({
      ru: "Виза Б2",
      en: "Visa B2",
      he: "ויזה B2",
      ar: "فيزا B2",
      uk: "Віза Б2",
    }),
    documentWorkVisa: t({
      ru: "Рабочая виза",
      en: "Work visa",
      he: "ויזת עבודה",
      ar: "فيزا عمل",
      uk: "Робоча віза",
    }),
    
    // Employment types
    employmentFull: t({
      ru: "Полная",
      en: "Full-time",
      he: "מלא",
      ar: "دوام كامل",
      uk: "Повна",
    }),
    employmentPartial: t({
      ru: "Частичная",
      en: "Part-time",
      he: "חלקי",
      ar: "دوام جزئي",
      uk: "Часткова",
    }),
    
    // Gender types
    genderFemale: t({
      ru: "Женщина",
      en: "Female",
      he: "אישה",
      ar: "أنثى",
      uk: "Жінка",
    }),
    genderMale: t({
      ru: "Мужчина",
      en: "Male",
      he: "גבר",
      ar: "ذكر",
      uk: "Чоловік",
    }),
    
    // Languages
    languageArabic: t({
      ru: "Арабский",
      en: "Arabic",
      he: "ערבית",
      ar: "العربية",
      uk: "Арабська",
    }),
    languageEnglish: t({
      ru: "Английский",
      en: "English",
      he: "אנגלית",
      ar: "الإنجليزية",
      uk: "Англійська",
    }),
    languageHebrew: t({
      ru: "Иврит",
      en: "Hebrew",
      he: "עברית",
      ar: "العبرية",
      uk: "Іврит",
    }),
    languageRussian: t({
      ru: "Русский",
      en: "Russian",
      he: "רוסית",
      ar: "הרוסית",
      uk: "Російська",
    }),
  },
} satisfies Dictionary;

export default seekerFilterModalContent;