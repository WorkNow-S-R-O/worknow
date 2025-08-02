import AIJobTitleService from '../services/aiJobTitleService.js';

/**
 * Test script to verify rate limit handling
 * This script will test the AI job title generation with proper rate limit handling
 */

async function testRateLimitHandling() {
    console.log("🧪 Testing rate limit handling for AI job title generation...\n");

    const testDescriptions = [
        "Требуется повар в ресторан. Работа с 8:00 до 16:00. Зарплата 45 шек/час. Опыт работы обязателен.",
        "Нужен уборщик в офис. Работа 5 дней в неделю. Зарплата 40 шек/час.",
        "Ищем официанта в кафе. Работа в смены. Зарплата 50 шек/час + чаевые.",
        "Требуется грузчик на склад. Работа с 7:00 до 15:00. Зарплата 45 шек/час.",
        "Нужен водитель с правами категории B. Доставка товаров по городу. Зарплата 55 шек/час."
    ];

    console.log(`📝 Testing ${testDescriptions.length} job descriptions...\n`);

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
        
        console.log(""); // Empty line for readability
        
        // Add delay between tests
        if (i < testDescriptions.length - 1) {
            console.log("   ⏳ Waiting 2 seconds before next test...");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log("✅ Rate limit handling test completed!");
}

// Run the test
testRateLimitHandling().catch(console.error); 