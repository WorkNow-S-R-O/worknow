import { getCitiesService } from '../services/cityService.js';

export const getCities = async (req, res) => {
	try {
		const lang = req.query.lang || 'ru';
		const result = await getCitiesService(lang);

		if (!result) {
			console.error('❌ getCitiesService returned null/undefined');
			return res.status(500).json({ error: 'Service returned null/undefined' });
		}

		if (result.error) {
			console.error('❌ Ошибка в getCitiesService:', result.error);
			return res.status(500).json({ error: result.error });
		}

		res.status(200).json(result.cities);
	} catch (error) {
		console.error('❌ Unexpected error in getCities:', error);
		res.status(500).json({ error: error.message });
	}
};
