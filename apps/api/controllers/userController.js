import { getUserByClerkIdService } from '../services/getUserByClerkService';

export const getUserByClerkId = async (req, res) => {
	const { clerkUserId } = req.params;

	try {
		const user = await getUserByClerkIdService(clerkUserId);

		if (!user) {
			return res.status(404).json({ error: 'Пользователь не найден' });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error('Ошибка получения данных пользователя:', error.message);
		res.status(500).json({
			error: 'Ошибка получения данных пользователя',
			details: error.message,
		});
	}
};
