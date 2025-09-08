import { useIntlayer } from 'react-intlayer';

export const useTranslationHelpers = () => {
  const content = useIntlayer("translationHelpers");

  const getGenderLabel = (gender) => {
    if (!gender) return '';
    if (["мужчина", "male"].includes(gender.toLowerCase())) return content.seekerProfileMale.value;
    if (["женщина", "female"].includes(gender.toLowerCase())) return content.seekerProfileFemale.value;
    return gender;
  };

  const getEmploymentLabel = (employment) => {
    if (!employment) return '';
    // Handle both Russian and English values
    const employmentLower = employment.toLowerCase();
    if (employmentLower === 'полная' || employmentLower === 'full-time' || employmentLower === 'fulltime') {
      return content.employmentPolnaya.value;
    }
    if (employmentLower === 'частичная' || employmentLower === 'part-time' || employmentLower === 'parttime') {
      return content.employmentChastichnaya.value;
    }
    // Fallback to the original value if no match found
    return employment;
  };

  const getCategoryLabel = (category) => {
    if (!category) return '';
    // Handle common category values
    const categoryLower = category.toLowerCase();
    if (categoryLower === 'общепит' || categoryLower === 'public catering') {
      return content.categoryObschepit.value;
    }
    if (categoryLower === 'стройка' || categoryLower === 'construction') {
      return content.categoryStroika.value;
    }
    if (categoryLower === 'плотник' || categoryLower === 'carpenter') {
      return content.categoryPlotnik.value;
    }
    if (categoryLower === 'сварщик' || categoryLower === 'welder') {
      return content.categorySvarshchik.value;
    }
    if (categoryLower === 'электрик' || categoryLower === 'electrician') {
      return content.categoryElektrik.value;
    }
    if (categoryLower === 'ремонт' || categoryLower === 'repair') {
      return content.categoryRemont.value;
    }
    if (categoryLower === 'перевозка' || categoryLower === 'transportation') {
      return content.categoryPerevozka.value;
    }
    if (categoryLower === 'доставка' || categoryLower === 'delivery') {
      return content.categoryDostavka.value;
    }
    if (categoryLower === 'транспорт' || categoryLower === 'transport') {
      return content.categoryTransport.value;
    }
    if (categoryLower === 'склад' || categoryLower === 'warehouse') {
      return content.categorySklad.value;
    }
    if (categoryLower === 'завод' || categoryLower === 'factory') {
      return content.categoryZavod.value;
    }
    if (categoryLower === 'производство' || categoryLower === 'production') {
      return content.categoryProizvodstvo.value;
    }
    if (categoryLower === 'торговля' || categoryLower === 'trade') {
      return content.categoryTorgovlya.value;
    }
    if (categoryLower === 'офис' || categoryLower === 'office') {
      return content.categoryOfis.value;
    }
    if (categoryLower === 'гостиницы' || categoryLower === 'hotels') {
      return content.categoryGostinitsy.value;
    }
    if (categoryLower === 'уборка' || categoryLower === 'cleaning') {
      return content.categoryUborka.value;
    }
    if (categoryLower === 'медицина' || categoryLower === 'medicine') {
      return content.categoryMeditsina.value;
    }
    if (categoryLower === 'здоровье' || categoryLower === 'healthcare') {
      return content.categoryZdorove.value;
    }
    if (categoryLower === 'образование' || categoryLower === 'education') {
      return content.categoryObrazovanie.value;
    }
    if (categoryLower === 'няни' || categoryLower === 'babysitting') {
      return content.categoryNyani.value;
    }
    if (categoryLower === 'охрана' || categoryLower === 'security') {
      return content.categoryOkhrana.value;
    }
    if (categoryLower === 'бьюти-индустрия' || categoryLower === 'beauty industry') {
      return content.categoryByuti.value;
    }
    if (categoryLower === 'автосервис' || categoryLower === 'auto service') {
      return content.categoryAvtoservis.value;
    }
    // Fallback to the original value if no match found
    return category;
  };

  const getLangLabel = (lang) => {
    if (!lang) return '';
    // Handle common language values
    const langLower = lang.toLowerCase();
    if (langLower === 'русский' || langLower === 'russian') {
      return content.langRusskiy.value;
    }
    if (langLower === 'английский' || langLower === 'english') {
      return content.langAngliyskiy.value;
    }
    if (langLower === 'иврит' || langLower === 'hebrew') {
      return content.langIvrit.value;
    }
    if (langLower === 'украинский' || langLower === 'ukrainian') {
      return content.langUkrainskiy.value;
    }
    if (langLower === 'арабский' || langLower === 'arabic') {
      return content.langArabskiy.value;
    }
    // Fallback to the original value if no match found
    return lang;
  };

  const getDocumentTypeLabel = (documentType) => {
    if (!documentType) return '';
    // Handle common document type values
    const docLower = documentType.toLowerCase();
    if (docLower === 'виза б1' || docLower === 'visa b1' || docLower === 'виза б1') {
      return content.documentVisaB1.value;
    }
    if (docLower === 'виза б2' || docLower === 'visa b2' || docLower === 'виза б2') {
      return content.documentVisaB2.value;
    }
    if (docLower === 'теудат зеут' || docLower === 'teudat zehut' || docLower === 'תעודת זהות') {
      return content.documentTeudatZehut.value;
    }
    if (docLower === 'рабочая виза' || docLower === 'work visa' || docLower === 'ויזת עבודה') {
      return content.documentWorkVisa.value;
    }
    if (docLower === 'другое' || docLower === 'other' || docLower === 'אחר' || docLower === 'أخرى') {
      return content.documentOther.value;
    }
    // Fallback to the original value if no match found
    return documentType;
  };

  const getCityLabel = (city) => {
    if (!city) return '';
    // Handle common city values
    const cityLower = city.toLowerCase();
    if (cityLower === 'ашкелон' || cityLower === 'ashkelon' || cityLower === 'אשקלון' || cityLower === 'أشكلون') {
      return content.cityAshkelon.value;
    }
    if (cityLower === 'тель-авив' || cityLower === 'tel aviv' || cityLower === 'תל אביב' || cityLower === 'تل أبيب') {
      return content.cityTelAviv.value;
    }
    if (cityLower === 'иерусалим' || cityLower === 'jerusalem' || cityLower === 'ירושלים' || cityLower === 'القدس') {
      return content.cityJerusalem.value;
    }
    if (cityLower === 'хайфа' || cityLower === 'haifa' || cityLower === 'חיפה' || cityLower === 'حيفا') {
      return content.cityHaifa.value;
    }
    if (cityLower === 'ашдод' || cityLower === 'ashdod' || cityLower === 'אשדוד' || cityLower === 'أشدود') {
      return content.cityAshdod.value;
    }
    if (cityLower === 'ришон-ле-цион' || cityLower === 'rishon lezion' || cityLower === 'ראשון לציון' || cityLower === 'ريشون لتسيون') {
      return content.cityRishonLeTsion.value;
    }
    if (cityLower === 'петах-тиква' || cityLower === 'petah tikva' || cityLower === 'פתח תקווה' || cityLower === 'بتاح تكفا') {
      return content.cityPetahTikva.value;
    }
    if (cityLower === 'холон' || cityLower === 'holon' || cityLower === 'חולון' || cityLower === 'حولون') {
      return content.cityHolon.value;
    }
    if (cityLower === 'рамат-ган' || cityLower === 'ramat gan' || cityLower === 'רמת גן' || cityLower === 'رمات غان') {
      return content.cityRamatGan.value;
    }
    if (cityLower === 'гиватаим' || cityLower === 'givatayim' || cityLower === 'גבעתיים' || cityLower === 'جفعاتايم') {
      return content.cityGivatayim.value;
    }
    if (cityLower === 'кфар-саба' || cityLower === 'kfar saba' || cityLower === 'כפר סבא' || cityLower === 'كفار سابا') {
      return content.cityKfarSaba.value;
    }
    if (cityLower === 'беэр-шева' || cityLower === 'beer sheva' || cityLower === 'באר שבע' || cityLower === 'بئر السبع') {
      return content.cityBeerSheva.value;
    }
    if (cityLower === 'нетания' || cityLower === 'netanya' || cityLower === 'נתניה' || cityLower === 'نتانيا') {
      return content.cityNetanya.value;
    }
    if (cityLower === 'герцлия' || cityLower === 'herzliya' || cityLower === 'הרצליה' || cityLower === 'هرتسليا') {
      return content.cityHerzliya.value;
    }
    if (cityLower === 'раанана' || cityLower === 'raanana' || cityLower === 'רעננה' || cityLower === 'رعنانا') {
      return content.cityRaanana.value;
    }
    if (cityLower === 'модиин' || cityLower === 'modiin' || cityLower === 'מודיעין' || cityLower === 'موديعين') {
      return content.cityModiin.value;
    }
    if (cityLower === 'рош-ха-аин' || cityLower === 'rosh haayin' || cityLower === 'ראש העין' || cityLower === 'رأس العين') {
      return content.cityRoshHaayin.value;
    }
    if (cityLower === 'явне' || cityLower === 'yavne' || cityLower === 'יבנה' || cityLower === 'يبنة') {
      return content.cityYavne.value;
    }
    if (cityLower === 'рамла' || cityLower === 'ramla' || cityLower === 'רמלה' || cityLower === 'الرملة') {
      return content.cityRamla.value;
    }
    if (cityLower === 'лод' || cityLower === 'lod' || cityLower === 'לוד' || cityLower === 'اللد') {
      return content.cityLod.value;
    }
    if (cityLower === 'назарет' || cityLower === 'nazareth' || cityLower === 'נצרת' || cityLower === 'الناصرة') {
      return content.cityNazareth.value;
    }
    if (cityLower === 'акко' || cityLower === 'acre' || cityLower === 'עכו' || cityLower === 'عكا') {
      return content.cityAcre.value;
    }
    if (cityLower === 'тверия' || cityLower === 'tiberias' || cityLower === 'טבריה' || cityLower === 'طبريا') {
      return content.cityTiberias.value;
    }
    if (cityLower === 'цфат' || cityLower === 'safed' || cityLower === 'צפת' || cityLower === 'صفد') {
      return content.citySafed.value;
    }
    if (cityLower === 'эйлат' || cityLower === 'eilat' || cityLower === 'אילת' || cityLower === 'إيلات') {
      return content.cityEilat.value;
    }
    // Fallback to the original value if no match found
    return city;
  };

  return {
    getGenderLabel,
    getEmploymentLabel,
    getCategoryLabel,
    getLangLabel,
    getDocumentTypeLabel,
    getCityLabel
  };
}; 