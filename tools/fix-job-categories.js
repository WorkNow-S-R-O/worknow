import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

async function main() {
	const category = await prisma.category.findFirst({
		where: { name: 'Другое' },
	});
	if (!category) {
		console.error("Категория 'Другое' не найдена!");
		// eslint-disable-next-line no-undef
		process.exit(1);
	}

	const result = await prisma.job.updateMany({
		where: { categoryId: null },
		data: { categoryId: category.id },
	});

	console.log(`Обновлено вакансий: ${result.count}`);
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
