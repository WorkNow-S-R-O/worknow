import AIJobTitleService from '../services/aiJobTitleService.js';

/**
 * Test the current rate limiting implementation
 * This will help us understand what's happening with the rate limits
 */
async function testCurrentRateLimit() {
    console.log("🧪 Testing Current Rate Limit Implementation...\n");
    console.log("📊 This will test the actual rate limiting logic\n");

    const testDescriptions = [
        "Требуется повар в ресторан. Работа с 8:00 до 16:00. Зарплата 45 шек/час.",
        "Нужен уборщик в офис. Работа 5 дней в неделю. Зарплата 40 шек/час.",
        "Ищем официанта в кафе. Работа в смены. Зарплата 50 шек/час + чаевые."
    ];

    console.log(`📝 Testing ${testDescriptions.length} descriptions with current implementation...\n`);

    for (let i = 0; i < testDescriptions.length; i++) {
        const description = testDescriptions[i];
        
        console.log(`🔍 Test ${i + 1}/${testDescriptions.length}:`);
        console.log(`   Description: ${description.substring(0, 50)}...`);
        console.log(`   Starting at: ${new Date().toLocaleTimeString()}`);
        
        try {
            const startTime = Date.now();
            console.log(`   ⏳ Making AI request...`);
            
            const result = await AIJobTitleService.generateAITitle(description);
            const endTime = Date.now();
            
            console.log(`   ✅ Success: "${result.title}"`);
            console.log(`   📊 Method: ${result.method}`);
            console.log(`   🎯 Confidence: ${result.confidence.toFixed(2)}`);
            console.log(`   ⏱️  Time: ${endTime - startTime}ms`);
            console.log(`   📅 Completed at: ${new Date().toLocaleTimeString()}`);
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            console.log(`   📅 Failed at: ${new Date().toLocaleTimeString()}`);
            
            // Check if it's a rate limit error
            if (error.message.includes('rate limit') || error.message.includes('429')) {
                console.log(`   🔍 Rate limit detected`);
            }
        }
        
        console.log(""); // Empty line for readability
        
        // Add delay between tests
        if (i < testDescriptions.length - 1) {
            console.log(`   ⏳ Waiting 30 seconds before next test...`);
            await new Promise(resolve => setTimeout(resolve, 30000));
        }
    }

    console.log("✅ Current rate limit test completed!");
    console.log("📊 Summary:");
    console.log("   - Tested the actual rate limiting implementation");
    console.log("   - Checked for rate limit errors");
    console.log("   - Monitored timing and delays");
}

// Run the test
testCurrentRateLimit().catch(console.error); 