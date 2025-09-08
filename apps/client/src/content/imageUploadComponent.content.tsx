import { t, type Dictionary } from "intlayer";

const imageUploadComponentContent = {
  key: "imageUploadComponent",
  content: {
    jobImage: t({
      ru: "Фото работы",
      en: "Job image",
      he: "תמונת עבודה",
      ar: "صورة العمل",
      uk: "Фото роботи",
    }),
    optional: t({
      ru: "Необязательно",
      en: "Optional",
      he: "אופציונלי",
      ar: "اختياري",
      uk: "Необов'язково",
    }),
    clickToUpload: t({
      ru: "Нажмите для загрузки",
      en: "Click to upload",
      he: "לחץ להעלאה",
      ar: "انقر للتحميل",
      uk: "Натисніть для завантаження",
    }),
    uploading: t({
      ru: "Загружается...",
      en: "Uploading...",
      he: "מעלה...",
      ar: "جاري التحميل...",
      uk: "Завантажується...",
    }),
    changeImage: t({
      ru: "Изменить фото",
      en: "Change image",
      he: "שנה תמונה",
      ar: "تغيير الصورة",
      uk: "Змінити фото",
    }),
    removeImage: t({
      ru: "Удалить фото",
      en: "Remove image",
      he: "הסר תמונה",
      ar: "إزالة الصورة",
      uk: "Видалити фото",
    }),
    imageUploadSuccess: t({
      ru: "Фото успешно загружено",
      en: "Image uploaded successfully",
      he: "התמונה הועלתה בהצלחה",
      ar: "تم تحميل الصورة بنجاح",
      uk: "Фото успішно завантажено",
    }),
    imageUploadError: t({
      ru: "Ошибка загрузки фото",
      en: "Image upload error",
      he: "שגיאת העלאת תמונה",
      ar: "خطأ في تحميل الصورة",
      uk: "Помилка завантаження фото",
    }),
    imageUploadHint: t({
      ru: "Поддерживаются форматы: JPG, PNG, GIF. Максимальный размер: 5MB",
      en: "Supported formats: JPG, PNG, GIF. Maximum size: 5MB",
      he: "פורמטים נתמכים: JPG, PNG, GIF. גודל מקסימלי: 5MB",
      ar: "الصيغ المدعومة: JPG, PNG, GIF. الحد الأقصى للحجم: 5MB",
      uk: "Підтримувані формати: JPG, PNG, GIF. Максимальний розмір: 5MB",
    }),
    imageModerationError: t({
      ru: "Фото отклонено модерацией",
      en: "Image rejected by moderation",
      he: "התמונה נדחתה על ידי המערכת",
      ar: "تم رفض الصورة بواسطة الإشراف",
      uk: "Фото відхилено модерацією",
    }),
    imageModerationErrorDescription: t({
      ru: "Фото не соответствует требованиям платформы",
      en: "Image does not meet platform requirements",
      he: "התמונה לא עומדת בדרישות הפלטפורמה",
      ar: "الصورة لا تفي بمتطلبات المنصة",
      uk: "Фото не відповідає вимогам платформи",
    }),
    imageDeletedSuccess: t({
      ru: "Фото успешно удалено",
      en: "Image deleted successfully",
      he: "התמונה נמחקה בהצלחה",
      ar: "تم حذف الصورة بنجاح",
      uk: "Фото успішно видалено",
    }),
    imageDeleteError: t({
      ru: "Ошибка удаления фото",
      en: "Image delete error",
      he: "שגיאת מחיקת תמונה",
      ar: "خطأ في حذف الصورة",
      uk: "Помилка видалення фото",
    }),
  },
} satisfies Dictionary;

export default imageUploadComponentContent;
