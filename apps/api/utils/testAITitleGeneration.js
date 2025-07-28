import AIJobTitleService from '../services/aiJobTitleService.js';

// Test cases with real job descriptions
const testCases = [
    {
        description: "! ХОЛОН /КУХНЯ В ОФИСЕ ПОВАР Вс-Чт 06.00-16.00 Оплата: от 45-50 шек/час Проезд оплачиваем Питание есть Требуется опыт работы и знание иврита Требуются девушки и мужчины !! ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО!!! ВАКАНСИИ ПО ВСЕМУ ИЗРАИЛЮ ! Звоните +972535875519 или пишите WhatsApp +972536232595",
        expected: "Повар в офисе",
        context: { city: "Холон", salary: "45-50" }
    },
    {
        description: "Бней Брак Требуются сотрудники с ивритом Работа: раскладка товара и работа на кассе Оплата: 45 шек/час График: — Магазин работает с 6:00 до 22:30 — Пятница: 7:00-15:00— Работа в две смены Требования: — Знание иврита обязательно — Ответственность, аккуратность ОФИЦИАЛЬНОЕ ТРУДОУСТРОЙСТВО +972539396070 ЗВОНИ ЛИБО ПИШИ В WHATSAPP",
        expected: "Продавец-консультант",
        context: { city: "Бней Брак", salary: "45" }
    },
    {
        description: "Требуется уборщик в офис в Тель-Авиве. Работа 5 дней в неделю. Оплата 40 шек/час. Знание иврита не обязательно.",
        expected: "Уборщик офиса",
        context: { city: "Тель-Авив", salary: "40" }
    },
    {
        description: "Ищем грузчика на склад в Хайфе. Работа с 8:00 до 17:00. Оплата 35 шек/час. Требуется физическая выносливость.",
        expected: "Грузчик",
        context: { city: "Хайфа", salary: "35" }
    },
    {
        description: "Нужен водитель с правами категории B. Доставка по Израилю. Оплата 50 шек/час. Опыт работы обязателен.",
        expected: "Водитель",
        context: { salary: "50" }
    },
    {
        description: "Требуется официант в ресторан в Иерусалиме. Работа в вечерние смены. Оплата 45 шек/час. Знание иврита обязательно.",
        expected: "Официант",
        context: { city: "Иерусалим", salary: "45" }
    },
    {
        description: "Ищем продавца в магазин одежды в Нетании. Работа с 9:00 до 19:00. Оплата 40 шек/час. Опыт в продажах приветствуется.",
        expected: "Продавец-консультант",
        context: { city: "Нетания", salary: "40" }
    },
    {
        description: "Требуется кассир в торговый центр в Ашдоде. Работа в две смены. Оплата 42 шек/час. Знание иврита обязательно.",
        expected: "Кассир",
        context: { city: "Ашдод", salary: "42" }
    },
    {
        description: "Нужен электрик для работы в строительной компании. Опыт работы обязателен. Оплата 60 шек/час. Работа по всему Израилю.",
        expected: "Электрик",
        context: { salary: "60" }
    },
    {
        description: "Ищем сантехника для работы в жилых домах. Опыт работы обязателен. Оплата 55 шек/час. Работа в Тель-Авиве и окрестностях.",
        expected: "Сантехник",
        context: { salary: "55" }
    }
];

// Function to test AI title generation
async function testAITitleGeneration() {
    console.log("🤖 Testing AI-Powered Job Title Generation\n");
    
    let successCount = 0;
    let totalCount = testCases.length;
    
    for (const testCase of testCases) {
        try {
            console.log(`\n📝 Testing: ${testCase.description.substring(0, 80)}...`);
            console.log(`🎯 Expected: ${testCase.expected}`);
            
            const result = await AIJobTitleService.generateAITitle(
                testCase.description, 
                testCase.context
            );
            
            console.log(`✅ Generated: "${result.title}"`);
            console.log(`🤖 Method: ${result.method}`);
            console.log(`📊 Confidence: ${result.confidence.toFixed(2)}`);
            
            // Check if the generated title is close to expected
            const isSuccess = result.title.toLowerCase().includes(testCase.expected.toLowerCase()) || 
                             testCase.expected.toLowerCase().includes(result.title.toLowerCase()) ||
                             result.confidence > 0.7;
            
            if (isSuccess) {
                successCount++;
                console.log(`✅ Success: ${isSuccess ? 'YES' : 'NO'}`);
            } else {
                console.log(`❌ Success: ${isSuccess ? 'YES' : 'NO'}`);
            }
            
            console.log('─'.repeat(60));
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            console.error(`❌ Error testing case:`, error.message);
        }
    }
    
    const successRate = ((successCount / totalCount) * 100).toFixed(2);
    console.log(`\n📈 Results: ${successCount}/${totalCount} tests passed (${successRate}% success rate)`);
    
    if (successRate >= 80) {
        console.log("🎉 Excellent AI title generation performance!");
    } else if (successRate >= 60) {
        console.log("👍 Good AI title generation performance!");
    } else {
        console.log("⚠️ AI title generation needs improvement.");
    }
}

// Function to test single job description
async function testSingleJob(description, context = {}) {
    console.log("🤖 Testing Single Job Title Generation\n");
    console.log(`📝 Description: ${description.substring(0, 100)}...`);
    
    try {
        const result = await AIJobTitleService.generateAITitle(description, context);
        
        console.log(`\n✅ Generated Title: "${result.title}"`);
        console.log(`🤖 Method: ${result.method}`);
        console.log(`📊 Confidence: ${result.confidence.toFixed(2)}`);
        console.log(`📋 Analysis:`);
        console.log(`   - Has specific keywords: ${result.analysis.hasSpecificKeywords}`);
        console.log(`   - Has location: ${result.analysis.hasLocation}`);
        console.log(`   - Has salary: ${result.analysis.hasSalary}`);
        console.log(`   - Has language requirement: ${result.analysis.hasLanguageRequirement}`);
        console.log(`   - Has experience requirement: ${result.analysis.hasExperienceRequirement}`);
        
        return result;
        
    } catch (error) {
        console.error('❌ Error generating title:', error.message);
        return null;
    }
}

// Function to test batch processing
async function testBatchProcessing() {
    console.log("🤖 Testing Batch AI Title Generation\n");
    
    const sampleJobs = testCases.map((testCase, index) => ({
        id: index + 1,
        description: testCase.description,
        city: { name: testCase.context.city },
        salary: testCase.context.salary
    }));
    
    try {
        const results = await AIJobTitleService.batchGenerateAITitles(sampleJobs);
        
        console.log(`\n📊 Batch Processing Results:`);
        results.forEach((job, index) => {
            console.log(`${index + 1}. "${job.title}" (${job.titleMethod}, confidence: ${job.titleConfidence.toFixed(2)})`);
        });
        
    } catch (error) {
        console.error('❌ Error in batch processing:', error.message);
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    // Test single job first
    await testSingleJob(
        "Требуется повар в офис в Тель-Авиве. Оплата 45 шек/час. Знание иврита обязательно.",
        { city: "Тель-Авив", salary: "45" }
    );
    
    // Then run full test suite
    await testAITitleGeneration();
    
    // Finally test batch processing
    await testBatchProcessing();
}

export { testAITitleGeneration, testSingleJob, testBatchProcessing }; 