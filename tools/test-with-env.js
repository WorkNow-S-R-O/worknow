import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../..');

// Load .env files
config({ path: path.join(projectRoot, '.env') });
config({ path: path.join(projectRoot, '.env.local') });

// Now import OpenAI after environment is loaded
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Test OpenAI with proper environment loading
 */
async function testWithEnv() {
	console.log('🔍 Testing OpenAI with proper environment loading...\n');

	// 1. Check environment variables
	console.log('1️⃣ Checking environment variables...');
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		console.error('❌ OPENAI_API_KEY not found in environment variables');
		console.log(
			'   Available env vars:',
			Object.keys(process.env).filter((k) => k.includes('OPENAI')),
		);
		console.log('   All env vars:', Object.keys(process.env).slice(0, 10));
		return;
	}
	console.log('✅ OPENAI_API_KEY found');
	console.log(`   Key starts with: ${apiKey.substring(0, 10)}...`);
	console.log(`   Key length: ${apiKey.length} characters`);
	console.log('');

	// 2. Test basic connection
	console.log('2️⃣ Testing basic connection...');
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

	console.log('✅ All tests completed successfully!');
	console.log('📊 Summary:');
	console.log('   - Environment variables loaded correctly');
	console.log('   - OpenAI connection working');
	console.log('   - Simple completion working');
	console.log('   - Job title generation working');
}

// Run the test
testWithEnv().catch(console.error);
