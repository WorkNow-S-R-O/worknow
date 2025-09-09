import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
	try {
		const lang = req.query.lang || 'ru';
		const categories = await prisma.category.findMany({
			orderBy: { name: 'asc' },
			include: { translations: true },
		});
		const result = categories.map((category) => {
			const translation = category.translations.find((t) => t.lang === lang);
			return {
				id: category.id,
				label: translation?.name || category.name,
			};
		});
		res.json(result);
	} catch (error) {
		console.error('Ошибка при получении категорий:', error);
		res.status(500).json({ error: 'Ошибка при получении категорий' });
	}
};
