import { type Dictionary, t } from 'intlayer';

const myAdsPageContent = {
	key: 'myAdsPage',
	content: {
		myAds: t({
			ru: 'Мои объявления',
			en: 'My Advertisements',
			he: 'המודעות שלי',
			ar: 'إعلاناتي',
			uk: 'Мої оголошення',
		}),
	},
} satisfies Dictionary;

export default myAdsPageContent;
