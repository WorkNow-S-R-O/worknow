import { useIntlayer } from 'react-intlayer';

const GENDER_MAP = {
	'мужчина': 'seekerProfileMale',
	'male': 'seekerProfileMale',
	'женщина': 'seekerProfileFemale',
	'female': 'seekerProfileFemale',
};

const EMPLOYMENT_MAP = {
	'полная': 'employmentPolnaya',
	'full-time': 'employmentPolnaya',
	'fulltime': 'employmentPolnaya',
	'частичная': 'employmentChastichnaya',
	'part-time': 'employmentChastichnaya',
	'parttime': 'employmentChastichnaya',
};

const CATEGORY_MAP = {
	'общепит': 'categoryObschepit',
	'public catering': 'categoryObschepit',
	'стройка': 'categoryStroika',
	'construction': 'categoryStroika',
	'плотник': 'categoryPlotnik',
	'carpenter': 'categoryPlotnik',
	'сварщик': 'categorySvarshchik',
	'welder': 'categorySvarshchik',
	'электрик': 'categoryElektrik',
	'electrician': 'categoryElektrik',
	'ремонт': 'categoryRemont',
	'repair': 'categoryRemont',
	'перевозка': 'categoryPerevozka',
	'transportation': 'categoryPerevozka',
	'доставка': 'categoryDostavka',
	'delivery': 'categoryDostavka',
	'транспорт': 'categoryTransport',
	'transport': 'categoryTransport',
	'склад': 'categorySklad',
	'warehouse': 'categorySklad',
	'завод': 'categoryZavod',
	'factory': 'categoryZavod',
	'производство': 'categoryProizvodstvo',
	'production': 'categoryProizvodstvo',
	'торговля': 'categoryTorgovlya',
	'trade': 'categoryTorgovlya',
	'офис': 'categoryOfis',
	'office': 'categoryOfis',
	'гостиницы': 'categoryGostinitsy',
	'hotels': 'categoryGostinitsy',
	'уборка': 'categoryUborka',
	'cleaning': 'categoryUborka',
	'медицина': 'categoryMeditsina',
	'medicine': 'categoryMeditsina',
	'здоровье': 'categoryZdorove',
	'healthcare': 'categoryZdorove',
	'образование': 'categoryObrazovanie',
	'education': 'categoryObrazovanie',
	'няни': 'categoryNyani',
	'babysitting': 'categoryNyani',
	'охрана': 'categoryOkhrana',
	'security': 'categoryOkhrana',
	'бьюти-индустрия': 'categoryByuti',
	'beauty industry': 'categoryByuti',
	'автосервис': 'categoryAvtoservis',
	'auto service': 'categoryAvtoservis',
};

const LANG_MAP = {
	'русский': 'langRusskiy',
	'russian': 'langRusskiy',
	'английский': 'langAngliyskiy',
	'english': 'langAngliyskiy',
	'иврит': 'langIvrit',
	'hebrew': 'langIvrit',
	'украинский': 'langUkrainskiy',
	'ukrainian': 'langUkrainskiy',
	'арабский': 'langArabskiy',
	'arabic': 'langArabskiy',
};

const DOCUMENT_TYPE_MAP = {
	'виза б1': 'documentVisaB1',
	'visa b1': 'documentVisaB1',
	'виза б2': 'documentVisaB2',
	'visa b2': 'documentVisaB2',
	'теудат зеут': 'documentTeudatZehut',
	'teudat zehut': 'documentTeudatZehut',
	'תעודת זהות': 'documentTeudatZehut',
	'рабочая виза': 'documentWorkVisa',
	'work visa': 'documentWorkVisa',
	'ויזת עבודה': 'documentWorkVisa',
	'другое': 'documentOther',
	'other': 'documentOther',
	'אחר': 'documentOther',
	'أخرى': 'documentOther',
};

const CITY_MAP = {
	'ашкелон': 'cityAshkelon',
	'ashkelon': 'cityAshkelon',
	'אשקלון': 'cityAshkelon',
	'أشكلون': 'cityAshkelon',
	'тель-авив': 'cityTelAviv',
	'tel aviv': 'cityTelAviv',
	'תל אביב': 'cityTelAviv',
	'تل أبيب': 'cityTelAviv',
	'иерусалим': 'cityJerusalem',
	'jerusalem': 'cityJerusalem',
	'ירושלים': 'cityJerusalem',
	'القدس': 'cityJerusalem',
	'хайфа': 'cityHaifa',
	'haifa': 'cityHaifa',
	'חיפה': 'cityHaifa',
	'حيفا': 'cityHaifa',
	'ашдод': 'cityAshdod',
	'ashdod': 'cityAshdod',
	'אשדוד': 'cityAshdod',
	'أشدود': 'cityAshdod',
	'ришон-ле-цион': 'cityRishonLeTsion',
	'rishon lezion': 'cityRishonLeTsion',
	'ראשון לציון': 'cityRishonLeTsion',
	'ريشون لتسيون': 'cityRishonLeTsion',
	'петах-тиква': 'cityPetahTikva',
	'petah tikva': 'cityPetahTikva',
	'פתח תקווה': 'cityPetahTikva',
	'بتاح تكفا': 'cityPetahTikva',
	'холон': 'cityHolon',
	'holon': 'cityHolon',
	'חולון': 'cityHolon',
	'حولون': 'cityHolon',
	'рамат-ган': 'cityRamatGan',
	'ramat gan': 'cityRamatGan',
	'רמת גן': 'cityRamatGan',
	'رمات غان': 'cityRamatGan',
	'гиватаим': 'cityGivatayim',
	'givatayim': 'cityGivatayim',
	'גבעתיים': 'cityGivatayim',
	'جفعاتايم': 'cityGivatayim',
	'кфар-саба': 'cityKfarSaba',
	'kfar saba': 'cityKfarSaba',
	'כפר סבא': 'cityKfarSaba',
	'كفار سابا': 'cityKfarSaba',
	'беэр-шева': 'cityBeerSheva',
	'beer sheva': 'cityBeerSheva',
	'באר שבע': 'cityBeerSheva',
	'بئر السبع': 'cityBeerSheva',
	'нетания': 'cityNetanya',
	'netanya': 'cityNetanya',
	'נתניה': 'cityNetanya',
	'نتانيا': 'cityNetanya',
	'герцлия': 'cityHerzliya',
	'herzliya': 'cityHerzliya',
	'הרצליה': 'cityHerzliya',
	'هرتسليا': 'cityHerzliya',
	'раанана': 'cityRaanana',
	'raanana': 'cityRaanana',
	'רעננה': 'cityRaanana',
	'رعنانا': 'cityRaanana',
	'модиин': 'cityModiin',
	'modiin': 'cityModiin',
	'מודיעין': 'cityModiin',
	'موديعين': 'cityModiin',
	'рош-ха-аин': 'cityRoshHaayin',
	'rosh haayin': 'cityRoshHaayin',
	'ראש העין': 'cityRoshHaayin',
	'رأس العين': 'cityRoshHaayin',
	'явне': 'cityYavne',
	'yavne': 'cityYavne',
	'יבנה': 'cityYavne',
	'يبنة': 'cityYavne',
	'рамла': 'cityRamla',
	'ramla': 'cityRamla',
	'רמלה': 'cityRamla',
	'الرملة': 'cityRamla',
	'лод': 'cityLod',
	'lod': 'cityLod',
	'לוד': 'cityLod',
	'اللد': 'cityLod',
	'назарет': 'cityNazareth',
	'nazareth': 'cityNazareth',
	'נצרת': 'cityNazareth',
	'الناصرة': 'cityNazareth',
	'акко': 'cityAcre',
	'acre': 'cityAcre',
	'עכו': 'cityAcre',
	'عكا': 'cityAcre',
	'тверия': 'cityTiberias',
	'tiberias': 'cityTiberias',
	'טבריה': 'cityTiberias',
	'طبريا': 'cityTiberias',
	'цфат': 'citySafed',
	'safed': 'citySafed',
	'צפת': 'citySafed',
	'صفد': 'citySafed',
	'эйлат': 'cityEilat',
	'eilat': 'cityEilat',
	'אילת': 'cityEilat',
	'إيلات': 'cityEilat',
};

const createLabelGetter = (map) => (value, content) => {
	if (!value) return '';
	const key = map[value.toLowerCase()];
	return key ? content[key].value : value;
};

const getGenderLabelFromMap = createLabelGetter(GENDER_MAP);
const getEmploymentLabelFromMap = createLabelGetter(EMPLOYMENT_MAP);
const getCategoryLabelFromMap = createLabelGetter(CATEGORY_MAP);
const getLangLabelFromMap = createLabelGetter(LANG_MAP);
const getDocumentTypeLabelFromMap = createLabelGetter(DOCUMENT_TYPE_MAP);
const getCityLabelFromMap = createLabelGetter(CITY_MAP);

export const useTranslationHelpers = () => {
	const content = useIntlayer('translationHelpers');

	const getGenderLabel = (gender) => getGenderLabelFromMap(gender, content);
	const getEmploymentLabel = (employment) => getEmploymentLabelFromMap(employment, content);
	const getCategoryLabel = (category) => getCategoryLabelFromMap(category, content);
	const getLangLabel = (lang) => getLangLabelFromMap(lang, content);
	const getDocumentTypeLabel = (documentType) => getDocumentTypeLabelFromMap(documentType, content);
	const getCityLabel = (city) => getCityLabelFromMap(city, content);

	return {
		getGenderLabel,
		getEmploymentLabel,
		getCategoryLabel,
		getLangLabel,
		getDocumentTypeLabel,
		getCityLabel,
	};
};
