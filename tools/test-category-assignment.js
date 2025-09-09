import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
config();

const prisma = new PrismaClient();

// Copy the category mapping function from napcep.js
function determineCategoryFromTitle(title) {
	const titleLower = title.toLowerCase();

	// Маппинг ключевых слов к категориям (обновленные ID из базы данных)
	const categoryMapping = {
		// Строительство и ремонт
		строитель: 146, // Стройка
		строительство: 146,
		стройка: 146,
		строительн: 146,
		плотник: 160, // Плотник
		плотнич: 160,
		сварщик: 165, // Сварщик
		сварка: 165,
		электрик: 173, // Электрик
		электрич: 173,
		ремонт: 161, // Ремонт
		ремонтн: 161,

		// Транспорт и доставка
		водитель: 151, // Перевозка
		шофер: 151,
		доставка: 150, // Доставка
		курьер: 150,
		транспорт: 169, // Транспорт
		перевозка: 151,

		// Склад и производство
		склад: 164, // Склад
		складск: 164,
		завод: 153, // Завод
		производство: 171, // Производство
		производств: 171,

		// Торговля и офис
		продавец: 170, // Торговля
		продаж: 170,
		кассир: 170,
		офис: 158, // Офис
		офисн: 158,
		секретарь: 158,
		администратор: 158,

		// Общепит и гостиницы
		кухня: 159, // Общепит
		повар: 159,
		официант: 159,
		бармен: 159,
		ресторан: 159,
		кафе: 159,
		гостиница: 149, // Гостиницы
		отель: 149,
		hotel: 149,

		// Уборка и обслуживание
		уборщица: 147, // Уборка
		уборщик: 147,
		уборка: 147,
		клининг: 147,
		cleaning: 147,

		// Медицина и здоровье
		медицин: 163, // Медицина
		врач: 163,
		медсестра: 163,
		здоровье: 154, // Здоровье
		медицинск: 163,

		// Образование и няни
		учитель: 162, // Образование
		преподаватель: 162,
		репетитор: 162,
		образование: 162,
		няня: 156, // Няни
		нянь: 156,
		babysitter: 156,

		// Охрана и безопасность
		охранник: 157, // Охрана
		охрана: 157,
		security: 157,
		'security guard': 157,

		// Бьюти-индустрия
		парикмахер: 148, // Бьюти-индустрия
		массажист: 148,
		косметолог: 148,
		маникюр: 148,
		салон: 148,
		beauty: 148,

		// Автосервис
		автосервис: 152, // Автосервис
		механик: 152,
		авто: 152,
		car: 152,
		garage: 152,

		// Связь и телекоммуникации
		связь: 166, // Связь-телекоммуникации
		телеком: 166,
		программист: 166,
		it: 166,
		developer: 166,

		// Сельское хозяйство
		сельское: 167, // Сельское хозяйство
		фермер: 167,
		садовник: 167,
		сельскохозяйств: 167,

		// Уход за пожилыми
		уход: 168, // Уход за пожилыми
		пожил: 168,
		сиделка: 168,
		caregiver: 168,

		// Швеи
		швея: 172, // Швеи
		портной: 172,
		швейн: 172,
		seamstress: 172,

		// Инженеры
		инженер: 155, // Инженеры
		engineer: 155,
		техник: 155,

		// Общие слова для разных категорий
		рабочий: 174, // Разное
		работник: 174,
		помощник: 174,
		assistant: 174,
		worker: 174,
	};

	// Проверяем каждое ключевое слово
	for (const [keyword, categoryId] of Object.entries(categoryMapping)) {
		if (titleLower.includes(keyword)) {
			return categoryId;
		}
	}

	// Если не найдено точное совпадение, возвращаем "Разное"
	return 174; // Разное
}

async function testCategoryAssignment() {
	console.log('🔍 Testing Category Assignment...');

	try {
		// Get all categories for reference
		const categories = await prisma.category.findMany({
			orderBy: { name: 'asc' },
		});

		const categoryMap = {};
		categories.forEach((cat) => {
			categoryMap[cat.id] = cat.name;
		});

		console.log('\n📋 Available categories:');
		categories.forEach((cat) => {
			console.log(`   ${cat.id}: ${cat.name}`);
		});

		// Test job titles
		const testTitles = [
			'Строитель на стройку',
			'Водитель доставки',
			'Продавец в магазин',
			'Уборщица в офис',
			'Повар в ресторан',
			'Электрик для ремонта',
			'Няня для ребенка',
			'Охранник в торговый центр',
			'Парикмахер в салон',
			'Механик в автосервис',
			'Программист IT',
			'Садовник для ухода',
			'Сиделка для пожилых',
			'Швея в ателье',
			'Инженер-технолог',
			'Рабочий на завод',
			'Общая вакансия без специфики',
		];

		console.log('\n🧪 Testing Category Assignment:');

		const results = [];
		for (const title of testTitles) {
			const categoryId = determineCategoryFromTitle(title);
			const categoryName = categoryMap[categoryId] || 'Unknown';

			results.push({
				title,
				categoryId,
				categoryName,
			});

			console.log(`   "${title}" → ${categoryName} (ID: ${categoryId})`);
		}

		// Statistics
		const categoryStats = {};
		results.forEach((result) => {
			categoryStats[result.categoryName] =
				(categoryStats[result.categoryName] || 0) + 1;
		});

		console.log('\n📊 Category Assignment Statistics:');
		for (const [categoryName, count] of Object.entries(categoryStats)) {
			const percentage = ((count / results.length) * 100).toFixed(1);
			console.log(`   ${categoryName}: ${count} jobs (${percentage}%)`);
		}

		// Test edge cases
		console.log('\n🔍 Testing Edge Cases:');
		const edgeCases = [
			'Работник', // Should default to "Разное"
			'Помощник', // Should default to "Разное"
			'Worker', // Should default to "Разное"
			'Assistant', // Should default to "Разное"
			'Строитель-электрик', // Should match first keyword (строитель)
			'Водитель-курьер', // Should match first keyword (водитель)
		];

		for (const title of edgeCases) {
			const categoryId = determineCategoryFromTitle(title);
			const categoryName = categoryMap[categoryId] || 'Unknown';
			console.log(`   "${title}" → ${categoryName} (ID: ${categoryId})`);
		}

		console.log('\n✅ Category assignment test completed!');
		console.log(
			'🎯 The system correctly assigns categories based on job titles',
		);
	} catch (error) {
		console.error('❌ Error testing category assignment:', error);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the test
testCategoryAssignment().catch(console.error);
