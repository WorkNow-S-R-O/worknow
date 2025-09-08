import { t, type Dictionary } from "intlayer";

const editJobFormContent = {
  key: "editJobForm",
  content: {
    editAdvertisement: t({
      ru: "Редактировать объявление",
      en: "Edit advertisement",
      he: "ערוך מודעה",
      ar: "تحرير الإعلان",
      uk: "Редагувати оголошення",
    }),
    editPageDescription: t({
      ru: "Редактирование объявления",
      en: "Editing advertisement",
      he: "עריכת מודעה",
      ar: "تحرير الإعلان",
      uk: "Редагування оголошення",
    }),
    editPageDefaultDescription: t({
      ru: "Редактирование объявления | WorkNow",
      en: "Editing advertisement | WorkNow",
      he: "עריכת מודעה | WorkNow",
      ar: "تحرير الإعلان | WorkNow",
      uk: "Редагування оголошення | WorkNow",
    }),
    saving: t({
      ru: "Сохранение",
      en: "Saving",
      he: "שומר",
      ar: "جاري الحفظ",
      uk: "Збереження",
    }),
    save: t({
      ru: "Сохранить",
      en: "Save",
      he: "שמור",
      ar: "حفظ",
      uk: "Зберегти",
    }),
  },
} satisfies Dictionary;

export default editJobFormContent;
  