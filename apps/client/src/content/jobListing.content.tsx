import { t, type Dictionary } from "intlayer";

const jobListingContent = {
  key: "jobListing",
  content: {
    chooseCityDashboard: t({
      ru: "Выбрать город",
      en: "Choose city",
      he: "בחר עיר",
      ar: "اختر المدينة",
      uk: "Обрати місто",
    }),
    latestJobs: t({
      ru: "WorkNow — Работа в Израиле, вакансии от работодателей",
      en: "WorkNow — Jobs in Israel, vacancies from employers",
      he: "WorkNow — עבודות בישראל, משרות ממעסיקים",
      ar: "WorkNow — الوظائف في إسرائيل، الوظائف من أصحاب العمل",
      uk: "WorkNow — Робота в Ізраїлі, вакансії від роботодавців",
    }),
    jobsIn: t({
      ru: "Работа в {{city}}",
      en: "Jobs in {{city}}",
      he: "עבודות ב{{city}}",
      ar: "الوظائف في {{city}}",
      uk: "Робота в {{city}}",
    }),
    findJobsIn: t({
      ru: "Найти работы в {{city}}",
      en: "Find jobs in {{city}}",
      he: "מצא עבודות ב{{city}}",
      ar: "ابحث عن الوظائف في {{city}}",
      uk: "Знайти роботу в {{city}}",
    }),
    newVacanciesFromEmployers: t({
      ru: "Новые вакансии от работодателей",
      en: "New vacancies from employers",
      he: "משרות חדשות ממעסיקים",
      ar: "وظائف جديدة من أصحاب العمل",
      uk: "Нові вакансії від роботодавців",
    }),
    jobSearchPlatform: t({
      ru: "Платформа поиска работы",
      en: "Job search platform",
      he: "פלטפורמת חיפוש עבודה",
      ar: "منصة البحث عن عمل",
      uk: "Платформа пошуку роботи",
    }),
    findLatestJobs: t({
      ru: "Поиск последних вакансий",
      en: "Search latest jobs",
      he: "חיפוש משרות אחרונות",
      ar: "البحث عن أحدث الوظائف",
      uk: "Пошук останніх вакансій",
    }),
    boardSettings: t({
      ru: "Фильтровать",
      en: "Filter",
      he: "סנן",
      ar: "تصفية",
      uk: "Фільтрувати",
    }),
    jobPostingTitle: t({
      ru: "Работа в {{city}}",
      en: "Jobs in {{city}}",
      he: "עבודות ב{{city}}",
      ar: "الوظائف في {{city}}",
      uk: "Робота в {{city}}",
    }),
    jobPostingTitleDefault: t({
      ru: "Работа в Израиле",
      en: "Jobs in Israel",
      he: "עבודות בישראל",
      ar: "الوظائف في إسرائيل",
      uk: "Робота в Ізраїлі",
    }),
    jobLocationDefault: t({
      ru: "Израиль",
      en: "Israel",
      he: "ישראל",
      ar: "إسرائيل",
      uk: "Ізраїль",
    }),
  },
} satisfies Dictionary;

export default jobListingContent;