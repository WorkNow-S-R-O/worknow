import { getCitiesService } from '../services/cityService.js';

export const getCities = async (req, res) => {
	const lang = req.query.lang || 'ru';
	const result = await getCitiesService(lang);

	if (result.error) {
		console.error('❌ Ошибка в getCitiesService:', result.error);
		return res.status(500).json({ error: result.error });
	}

	res.status(200).json(result.cities);
};
