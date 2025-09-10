import { t, type Dictionary } from 'intlayer';

const myAdsPageContent = {
	key: 'myAdsPage',
	content: {
		myAds: t({
			ru: 'Мои объявления',
			en: 'My advertisements',
			he: 'המודעות שלי',
			ar: 'إعلاناتي',
			uk: 'Мої оголошення',
		}),
	},
} satisfies Dictionary;

export default myAdsPageContent;
