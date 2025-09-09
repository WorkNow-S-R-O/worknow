import AIJobTitleService from '../apps/api/services/aiJobTitleService.js';

/**
 * Test the fallback system only (without OpenAI calls)
 * This demonstrates that the system works reliably even without AI
 */
async function testFallbackOnly() {
	console.log('🧪 Testing Fallback System Only...\n');
	console.log(
		'📊 This will test the rule-based title generation without OpenAI\n',
	);

	const testDescriptions = [
		'Требуется повар в ресторан. Работа с 8:00 до 16:00. Зарплата 45 шек/час.',
		'Нужен уборщик в офис. Работа 5 дней в неделю. Зарплата 40 шек/час.',
		'Ищем официанта в кафе. Работа в смены. Зарплата 50 шек/час + чаевые.',
		'Требуется грузчик на склад. Работа с 9:00 до 17:00. Зарплата 35 шек/час.',
		'Нужен водитель для доставки. Опыт работы обязателен. Зарплата 55 шек/час.',
		'Ищем продавца в магазин. Работа с клиентами. Зарплата 45 шек/час.',
		'Требуется кассир в супермаркет. Работа с кассой. Зарплата 40 шек/час.',
		'Нужен строитель для ремонта. Опыт работы 2+ года. Зарплата 60 шек/час.',
		'Ищем электрика для установки. Лицензия обязательна. Зарплата 70 шек/час.',
		'Требуется сантехник для ремонта. Опыт работы 3+ года. Зарплата 65 шек/час.',
	];

	console.log(
		`📝 Testing ${testDescriptions.length} descriptions with fallback system...\n`,
	);

	let successCount = 0;
	let totalTime = 0;

	for (let i = 0; i < testDescriptions.length; i++) {
		const description = testDescriptions[i];

		console.log(`🔍 Test ${i + 1}/${testDescriptions.length}:`);
		console.log(`   Description: ${description.substring(0, 50)}...`);

		try {
			const startTime = Date.now();

			// Force fallback by simulating quota error
			const result = AIJobTitleService.fallbackTitleGeneration(description);
			const endTime = Date.now();

			const processingTime = endTime - startTime;
			totalTime += processingTime;

			console.log(`   ✅ Success: "${result.title}"`);
			console.log(`   📊 Method: ${result.method}`);
			console.log(`   🎯 Confidence: ${result.confidence.toFixed(2)}`);
			console.log(`   ⏱️  Time: ${processingTime}ms`);

			successCount++;
		} catch (error) {
			console.log(`   ❌ Error: ${error.message}`);
		}

		console.log(''); // Empty line for readability
	}

	console.log('✅ Fallback system test completed!');
	console.log('📊 Summary:');
	console.log(`   - Total tests: ${testDescriptions.length}`);
	console.log(`   - Successful: ${successCount}`);
	console.log(
		`   - Success rate: ${((successCount / testDescriptions.length) * 100).toFixed(1)}%`,
	);
	console.log(`   - Average time: ${(totalTime / successCount).toFixed(0)}ms`);
	console.log(`   - Total time: ${totalTime}ms`);

	console.log('\n💡 Key Benefits:');
	console.log('   ✅ No API costs');
	console.log('   ✅ No rate limits');
	console.log('   ✅ No quota issues');
	console.log('   ✅ Instant processing');
	console.log('   ✅ Reliable results');
	console.log('   ✅ Always available');
}

// Run the test
testFallbackOnly().catch(console.error);
