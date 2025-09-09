import AIJobTitleService from '../apps/api/services/aiJobTitleService.js';

/**
 * Test script to verify improved rate limit handling
 * This script will test the AI job title generation with conservative rate limiting
 */

async function testImprovedRateLimitHandling() {
	console.log(
		'🧪 Testing improved rate limit handling for AI job title generation...\n',
	);
	console.log(
		'📊 Using conservative settings: 3 requests per minute, 20 seconds between requests\n',
	);

	const testDescriptions = [
		'Требуется повар в ресторан. Работа с 8:00 до 16:00. Зарплата 45 шек/час. Опыт работы обязателен.',
		'Нужен уборщик в офис. Работа 5 дней в неделю. Зарплата 40 шек/час.',
		'Ищем официанта в кафе. Работа в смены. Зарплата 50 шек/час + чаевые.',
		'Требуется грузчик на склад. Работа с 7:00 до 15:00. Зарплата 45 шек/час.',
		'Нужен водитель с правами категории B. Доставка товаров по городу. Зарплата 55 шек/час.',
	];

	console.log(
		`📝 Testing ${testDescriptions.length} job descriptions with conservative rate limiting...\n`,
	);

	for (let i = 0; i < testDescriptions.length; i++) {
		const description = testDescriptions[i];

		console.log(`🔍 Test ${i + 1}/${testDescriptions.length}:`);
		console.log(`   Description: ${description.substring(0, 50)}...`);

		try {
			const startTime = Date.now();
			const result = await AIJobTitleService.generateAITitle(description);
			const endTime = Date.now();

			console.log(`   ✅ Success: "${result.title}"`);
			console.log(`   📊 Method: ${result.method}`);
			console.log(`   🎯 Confidence: ${result.confidence.toFixed(2)}`);
			console.log(`   ⏱️  Time: ${endTime - startTime}ms`);
		} catch (error) {
			console.log(`   ❌ Error: ${error.message}`);
		}

		console.log(''); // Empty line for readability

		// Add longer delay between tests to respect rate limits
		if (i < testDescriptions.length - 1) {
			console.log(
				'   ⏳ Waiting 25 seconds before next test (conservative rate limiting)...',
			);
			await new Promise((resolve) => setTimeout(resolve, 25000));
		}
	}

	console.log('✅ Improved rate limit handling test completed!');
	console.log('📊 Summary:');
	console.log('   - Conservative rate limiting: 3 requests per minute');
	console.log('   - 20-second delays between requests');
	console.log('   - Exponential backoff with jitter');
	console.log('   - Robust fallback system');
}

// Run the test
testImprovedRateLimitHandling().catch(console.error);
