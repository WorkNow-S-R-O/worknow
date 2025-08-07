import { useTranslation } from 'react-i18next';

export const useTranslationHelpers = () => {
  const { t } = useTranslation();

  const getGenderLabel = (gender) => {
    if (!gender) return '';
    if (["мужчина", "male"].includes(gender.toLowerCase())) return t('seeker_profile_male');
    if (["женщина", "female"].includes(gender.toLowerCase())) return t('seeker_profile_female');
    return gender;
  };

  const getEmploymentLabel = (employment) => {
    if (!employment) return '';
    // Handle both Russian and English values
    const employmentLower = employment.toLowerCase();
    if (employmentLower === 'полная' || employmentLower === 'full-time' || employmentLower === 'fulltime') {
      return t('employment_polnaya');
    }
    if (employmentLower === 'частичная' || employmentLower === 'part-time' || employmentLower === 'parttime') {
      return t('employment_chastichnaya');
    }
    // Fallback to the existing pattern
    const key = `employment_${employmentLower}`;
    const translated = t(key);
    return translated === key ? employment : translated;
  };

  const getCategoryLabel = (category) => {
    if (!category) return '';
    // Handle common category values
    const categoryLower = category.toLowerCase();
    if (categoryLower === 'общепит' || categoryLower === 'public catering') {
      return t('category_obschepit');
    }
    if (categoryLower === 'стройка' || categoryLower === 'construction') {
      return t('category_stroika');
    }
    if (categoryLower === 'плотник' || categoryLower === 'carpenter') {
      return t('category_plotnik');
    }
    if (categoryLower === 'сварщик' || categoryLower === 'welder') {
      return t('category_svarshchik');
    }
    if (categoryLower === 'электрик' || categoryLower === 'electrician') {
      return t('category_elektrik');
    }
    if (categoryLower === 'ремонт' || categoryLower === 'repair') {
      return t('category_remont');
    }
    if (categoryLower === 'перевозка' || categoryLower === 'transportation') {
      return t('category_perevozka');
    }
    if (categoryLower === 'доставка' || categoryLower === 'delivery') {
      return t('category_dostavka');
    }
    if (categoryLower === 'транспорт' || categoryLower === 'transport') {
      return t('category_transport');
    }
    if (categoryLower === 'склад' || categoryLower === 'warehouse') {
      return t('category_sklad');
    }
    if (categoryLower === 'завод' || categoryLower === 'factory') {
      return t('category_zavod');
    }
    if (categoryLower === 'производство' || categoryLower === 'production') {
      return t('category_proizvodstvo');
    }
    if (categoryLower === 'торговля' || categoryLower === 'trade') {
      return t('category_torgovlya');
    }
    if (categoryLower === 'офис' || categoryLower === 'office') {
      return t('category_ofis');
    }
    if (categoryLower === 'гостиницы' || categoryLower === 'hotels') {
      return t('category_gostinitsy');
    }
    if (categoryLower === 'уборка' || categoryLower === 'cleaning') {
      return t('category_uborka');
    }
    if (categoryLower === 'медицина' || categoryLower === 'medicine') {
      return t('category_meditsina');
    }
    if (categoryLower === 'здоровье' || categoryLower === 'healthcare') {
      return t('category_zdorove');
    }
    if (categoryLower === 'образование' || categoryLower === 'education') {
      return t('category_obrazovanie');
    }
    if (categoryLower === 'няни' || categoryLower === 'babysitting') {
      return t('category_nyani');
    }
    if (categoryLower === 'охрана' || categoryLower === 'security') {
      return t('category_okhrana');
    }
    if (categoryLower === 'бьюти-индустрия' || categoryLower === 'beauty industry') {
      return t('category_byuti');
    }
    if (categoryLower === 'автосервис' || categoryLower === 'auto service') {
      return t('category_avtoservis');
    }
    // Fallback to the existing pattern
    const key = `category_${categoryLower}`;
    const translated = t(key);
    return translated === key ? category : translated;
  };

  const getLangLabel = (lang) => {
    if (!lang) return '';
    // Handle common language values
    const langLower = lang.toLowerCase();
    if (langLower === 'русский' || langLower === 'russian') {
      return t('lang_russkiy');
    }
    if (langLower === 'английский' || langLower === 'english') {
      return t('lang_angliyskiy');
    }
    if (langLower === 'иврит' || langLower === 'hebrew') {
      return t('lang_ivrit');
    }
    if (langLower === 'украинский' || langLower === 'ukrainian') {
      return t('lang_ukrainskiy');
    }
    if (langLower === 'арабский' || langLower === 'arabic') {
      return t('lang_arabskiy');
    }
    // Fallback to the existing pattern
    const key = `lang_${langLower}`;
    const translated = t(key);
    return translated === key ? lang : translated;
  };

  const getDocumentTypeLabel = (documentType) => {
    if (!documentType) return '';
    // Handle common document type values
    const docLower = documentType.toLowerCase();
    if (docLower === 'виза б1' || docLower === 'visa b1' || docLower === 'виза б1') {
      return t('document_visa_b1');
    }
    if (docLower === 'виза б2' || docLower === 'visa b2' || docLower === 'виза б2') {
      return t('document_visa_b2');
    }
    if (docLower === 'теудат зеут' || docLower === 'teudat zehut' || docLower === 'תעודת זהות') {
      return t('document_teudat_zehut');
    }
    if (docLower === 'рабочая виза' || docLower === 'work visa' || docLower === 'ויזת עבודה') {
      return t('document_work_visa');
    }
    if (docLower === 'другое' || docLower === 'other' || docLower === 'אחר' || docLower === 'أخرى') {
      return t('document_other');
    }
    // Fallback to the existing pattern
    const key = `document_${docLower.replace(/\s+/g, '_')}`;
    const translated = t(key);
    return translated === key ? documentType : translated;
  };

  const getCityLabel = (city) => {
    if (!city) return '';
    // Handle common city values
    const cityLower = city.toLowerCase();
    if (cityLower === 'ашкелон' || cityLower === 'ashkelon' || cityLower === 'אשקלון' || cityLower === 'أشكلون') {
      return t('city_ashkelon');
    }
    if (cityLower === 'тель-авив' || cityLower === 'tel aviv' || cityLower === 'תל אביב' || cityLower === 'تل أبيب') {
      return t('city_tel_aviv');
    }
    if (cityLower === 'иерусалим' || cityLower === 'jerusalem' || cityLower === 'ירושלים' || cityLower === 'القدس') {
      return t('city_jerusalem');
    }
    if (cityLower === 'хайфа' || cityLower === 'haifa' || cityLower === 'חיפה' || cityLower === 'حيفا') {
      return t('city_haifa');
    }
    if (cityLower === 'ашдод' || cityLower === 'ashdod' || cityLower === 'אשדוד' || cityLower === 'أشدود') {
      return t('city_ashdod');
    }
    if (cityLower === 'ришон-ле-цион' || cityLower === 'rishon lezion' || cityLower === 'ראשון לציון' || cityLower === 'ريشون لتسيون') {
      return t('city_rishon_le_tsion');
    }
    if (cityLower === 'петах-тиква' || cityLower === 'petah tikva' || cityLower === 'פתח תקווה' || cityLower === 'بتاح تكفا') {
      return t('city_petah_tikva');
    }
    if (cityLower === 'холон' || cityLower === 'holon' || cityLower === 'חולון' || cityLower === 'حولون') {
      return t('city_holon');
    }
    if (cityLower === 'рамат-ган' || cityLower === 'ramat gan' || cityLower === 'רמת גן' || cityLower === 'رمات غان') {
      return t('city_ramat_gan');
    }
    if (cityLower === 'гиватаим' || cityLower === 'givatayim' || cityLower === 'גבעתיים' || cityLower === 'جفعاتايم') {
      return t('city_givatayim');
    }
    if (cityLower === 'кфар-саба' || cityLower === 'kfar saba' || cityLower === 'כפר סבא' || cityLower === 'كفار سابا') {
      return t('city_kfar_saba');
    }
    if (cityLower === 'беэр-шева' || cityLower === 'beer sheva' || cityLower === 'באר שבע' || cityLower === 'بئر السبع') {
      return t('city_beer_sheva');
    }
    if (cityLower === 'нетания' || cityLower === 'netanya' || cityLower === 'נתניה' || cityLower === 'نتانيا') {
      return t('city_netanya');
    }
    if (cityLower === 'герцлия' || cityLower === 'herzliya' || cityLower === 'הרצליה' || cityLower === 'هرتسليا') {
      return t('city_herzliya');
    }
    if (cityLower === 'раанана' || cityLower === 'raanana' || cityLower === 'רעננה' || cityLower === 'رعنانا') {
      return t('city_raanana');
    }
    if (cityLower === 'модиин' || cityLower === 'modiin' || cityLower === 'מודיעין' || cityLower === 'موديعين') {
      return t('city_modiin');
    }
    if (cityLower === 'рош-ха-аин' || cityLower === 'rosh haayin' || cityLower === 'ראש העין' || cityLower === 'رأس العين') {
      return t('city_rosh_haayin');
    }
    if (cityLower === 'явне' || cityLower === 'yavne' || cityLower === 'יבנה' || cityLower === 'يبنة') {
      return t('city_yavne');
    }
    if (cityLower === 'рамла' || cityLower === 'ramla' || cityLower === 'רמלה' || cityLower === 'الرملة') {
      return t('city_ramla');
    }
    if (cityLower === 'лод' || cityLower === 'lod' || cityLower === 'לוד' || cityLower === 'اللد') {
      return t('city_lod');
    }
    if (cityLower === 'назарет' || cityLower === 'nazareth' || cityLower === 'נצרת' || cityLower === 'الناصرة') {
      return t('city_nazareth');
    }
    if (cityLower === 'акко' || cityLower === 'acre' || cityLower === 'עכו' || cityLower === 'عكا') {
      return t('city_acre');
    }
    if (cityLower === 'тверия' || cityLower === 'tiberias' || cityLower === 'טבריה' || cityLower === 'طبريا') {
      return t('city_tiberias');
    }
    if (cityLower === 'цфат' || cityLower === 'safed' || cityLower === 'צפת' || cityLower === 'صفد') {
      return t('city_safed');
    }
    if (cityLower === 'эйлат' || cityLower === 'eilat' || cityLower === 'אילת' || cityLower === 'إيلات') {
      return t('city_eilat');
    }
    // Fallback to the existing pattern
    const key = `city_${cityLower.replace(/[\s-]/g, '_')}`;
    const translated = t(key);
    return translated === key ? city : translated;
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