import { Filter } from 'bad-words';
import badWordsList from '../utils/badWordsList.js';

const filter = new Filter();

export const containsBadWords = (text) => {
	if (!text) return false;
	const words = text.toLowerCase().split(/\s+/);
	return words.some(
		(word) => badWordsList.includes(word) || filter.isProfane(word),
	);
};

export const containsLinks = (text) => {
	if (!text) return false;
	const urlPattern = /(https?:\/\/|www\.)[^\s]+/gi;
	return urlPattern.test(text);
};
