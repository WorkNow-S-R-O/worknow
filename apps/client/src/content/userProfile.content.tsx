import { t, type Dictionary } from "intlayer";

const userProfileContent = {
  key: "userProfile",
  content: {
    user_profile_title: t({
      ru: "Профиль пользователя",
      en: "User Profile",
      he: "פרופיל משתמש",
      ar: "ملف المستخدم",
      uk: "Профіль користувача",
    }),
    user_not_found: t({
      ru: "Пользователь не найден",
      en: "User not found",
      he: "משתמש לא נמצא",
      ar: "المستخدم غير موجود",
      uk: "Користувача не знайдено",
    }),
    profile_description: t({
      ru: "Профиль пользователя",
      en: "User profile",
      he: "פרופיל משתמש",
      ar: "ملف المستخدم",
      uk: "Профіль користувача",
    }),
    user_jobs: t({
      ru: "Объявления пользователя",
      en: "User jobs",
      he: "משרות המשתמש",
      ar: "وظائف المستخدم",
      uk: "Оголошення користувача",
    }),
    user_profile_not_found_description: t({
      ru: "Профиль пользователя не найден или был удален",
      en: "User profile not found or has been deleted",
      he: "פרופיל המשתמש לא נמצא או נמחק",
      ar: "ملف المستخدم غير موجود أو تم حذفه",
      uk: "Профіль користувача не знайдено або було видалено",
    }),
    user_no_jobs: t({
      ru: "У пользователя пока нет объявлений",
      en: "User has no job postings yet",
      he: "למשתמש עדיין אין מודעות עבודה",
      ar: "المستخدم ليس لديه إعلانات عمل بعد",
      uk: "У користувача поки немає оголошень",
    }),
  },
} satisfies Dictionary;

export default userProfileContent;
