import OpenAI from 'openai';
import prisma from '../lib/prisma.js';



// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Diagnostic script to investigate AI generation failures
 */
async function debugAIGeneration() {
	console.log('🔍 Debugging AI Generation Issues...\n');

	// 1. Check environment variables
	console.log('1️⃣ Checking environment variables...');
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		console.error('❌ OPENAI_API_KEY not found in environment variables');
		return;
	}
	console.log('✅ OPENAI_API_KEY found');
	console.log(`   Key starts with: ${apiKey.substring(0, 10)}...`);
	console.log(`   Key length: ${apiKey.length} characters`);
	console.log('');

	// 2. Test basic OpenAI connection
	console.log('2️⃣ Testing basic OpenAI connection...');
	try {
		const models = await openai.models.list();
		console.log('✅ OpenAI connection successful');
		console.log(`   Available models: ${models.data.length}`);
		console.log(`   First model: ${models.data[0]?.id || 'None'}`);
	} catch (error) {
		console.error('❌ OpenAI connection failed:', error.message);
		console.error('   Error details:', error);
		return;
	}
	console.log('');

	// 3. Test simple completion
	console.log('3️⃣ Testing simple completion...');
	try {
		const startTime = Date.now();
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'user',
					content: "Say 'Hello World'",
				},
			],
			max_tokens: 10,
		});
		const endTime = Date.now();

		console.log('✅ Simple completion successful');
		console.log(`   Response: "${completion.choices[0]?.message?.content}"`);
		console.log(`   Time: ${endTime - startTime}ms`);
		console.log(`   Model: ${completion.model}`);
		console.log(`   Usage: ${JSON.stringify(completion.usage)}`);
	} catch (error) {
		console.error('❌ Simple completion failed:', error.message);
		console.error('   Error details:', error);
		return;
	}
	console.log('');

	// 4. Test job title generation
	console.log('4️⃣ Testing job title generation...');
	try {
		const startTime = Date.now();
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content: `You are an expert job title generator for the Israeli job market. 
                    Your task is to analyze job descriptions and generate concise, professional job titles in Russian.
                    
                    Requirements:
                    - Generate titles in Russian language
                    - Keep titles short and professional (max 5-7 words)
                    - Use specific job titles, not generic ones
                    - Consider the job location, requirements, and industry
                    - Avoid including salary, contact info, or extra details in the title
                    
                    Return only the job title, nothing else.`,
				},
				{
					role: 'user',
					content:
						'Требуется повар в ресторан. Работа с 8:00 до 16:00. Зарплата 45 шек/час. Опыт работы обязателен.',
				},
			],
			max_tokens: 50,
			temperature: 0.3,
		});
		const endTime = Date.now();

		console.log('✅ Job title generation successful');
		console.log(`   Response: "${completion.choices[0]?.message?.content}"`);
		console.log(`   Time: ${endTime - startTime}ms`);
		console.log(`   Model: ${completion.model}`);
		console.log(`   Usage: ${JSON.stringify(completion.usage)}`);
	} catch (error) {
		console.error('❌ Job title generation failed:', error.message);
		console.error('   Error details:', error);

		// Check if it's a rate limit error
		if (
			error.message?.includes('429') ||
			error.message?.includes('rate limit')
		) {
			console.log('   🔍 This appears to be a rate limit error');
		}

		// Check if it's a quota error
		if (
			error.message?.includes('quota') ||
			error.message?.includes('billing')
		) {
			console.log('   🔍 This appears to be a quota/billing error');
		}

		return;
	}
	console.log('');

	// 5. Check rate limits (if possible)
	console.log('5️⃣ Checking rate limit information...');
	try {
		// Try to get rate limit info from headers (this might not work with OpenAI SDK)
		console.log(
			'   Note: Rate limit headers are not directly accessible via OpenAI SDK',
		);
		console.log('   Rate limits are typically:');
		console.log('   - Free tier: 3 requests per minute');
		console.log('   - Paid tier: 60 requests per minute');
		console.log('   - Higher tiers: 3500 requests per minute');
	} catch (error) {
		console.log('   Could not retrieve rate limit information');
	}
	console.log('');

	// 6. Test with delays
	console.log('6️⃣ Testing with delays to simulate rate limiting...');
	for (let i = 1; i <= 3; i++) {
		console.log(`   Test ${i}/3: Making request with ${i * 5} second delay...`);

		try {
			await new Promise((resolve) => setTimeout(resolve, i * 5000));

			const startTime = Date.now();
			const completion = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'user',
						content: `Test message ${i}`,
					},
				],
				max_tokens: 10,
			});
			const endTime = Date.now();

			console.log(
				`   ✅ Success: "${completion.choices[0]?.message?.content}" (${endTime - startTime}ms)`,
			);
		} catch (error) {
			console.log(`   ❌ Failed: ${error.message}`);
		}
	}
	console.log('');

	// 7. Recommendations
	console.log('7️⃣ Recommendations:');
	console.log("   If you're hitting rate limits:");
	console.log('   - Check your OpenAI account billing status');
	console.log('   - Verify your API key is valid and has sufficient credits');
	console.log('   - Consider upgrading to a paid plan for higher rate limits');
	console.log('   - Use the fallback system for now');
	console.log('');
	console.log("   If you're getting other errors:");
	console.log('   - Check your internet connection');
	console.log('   - Verify the OpenAI API is accessible');
	console.log('   - Check if there are any firewall/proxy issues');
}

// Run the diagnostic
debugAIGeneration()
	.catch(console.error)
	.finally(() => {
		prisma.$disconnect();
	});
