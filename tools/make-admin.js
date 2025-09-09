/* global process */
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function makeAdmin(email) {
	try {
		const user = await prisma.user.update({
			where: { email },
			data: { isAdmin: true },
		});

		console.log(`✅ Пользователь ${email} назначен администратором`);
		console.log(`ID: ${user.id}`);
	} catch (error) {
		console.error('❌ Ошибка:', error.message);
	} finally {
		await prisma.$disconnect();
	}
}

// Получаем email из аргументов командной строки
const email = process.argv[2];

if (!email) {
	console.log('Использование: node scripts/make-admin.js <email>');
	console.log('Пример: node scripts/make-admin.js admin@example.com');
	process.exit(1);
}

makeAdmin(email);
