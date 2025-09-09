import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Check OpenAI account status and quota
 */
async function checkOpenAIStatus() {
	console.log('🔍 Checking OpenAI Account Status...\n');

	// 1. Check API key
	console.log('1️⃣ Checking API key...');
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		console.error('❌ OPENAI_API_KEY not found in environment variables');
		console.log('   Please set OPENAI_API_KEY in your .env file');
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
		console.log('✅ Connection successful');
		console.log(`   Available models: ${models.data.length}`);

		// Check for specific models
		const modelIds = models.data.map((m) => m.id);
		const hasGPT35 = modelIds.some((id) => id.includes('gpt-3.5'));
		const hasGPT4 = modelIds.some((id) => id.includes('gpt-4'));

		console.log(`   Has GPT-3.5 models: ${hasGPT35}`);
		console.log(`   Has GPT-4 models: ${hasGPT4}`);

		if (hasGPT35) {
			console.log('   ✅ GPT-3.5-turbo should be available');
		} else {
			console.log('   ⚠️  GPT-3.5-turbo not found in available models');
		}
	} catch (error) {
		console.error('❌ Connection failed:', error.message);
		if (error.message.includes('401')) {
			console.log('   🔍 This is an authentication error - check your API key');
		} else if (error.message.includes('403')) {
			console.log(
				'   🔍 This is an authorization error - check your account status',
			);
		}
		return;
	}
	console.log('');

	// 3. Test a simple request
	console.log('3️⃣ Testing simple request...');
	try {
		const startTime = Date.now();
		const completion = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'user',
					content: "Say 'test'",
				},
			],
			max_tokens: 5,
		});
		const endTime = Date.now();

		console.log('✅ Simple request successful');
		console.log(`   Response: "${completion.choices[0]?.message?.content}"`);
		console.log(`   Time: ${endTime - startTime}ms`);
		console.log(`   Model: ${completion.model}`);
		console.log(`   Usage: ${JSON.stringify(completion.usage)}`);

		// Check usage
		if (completion.usage) {
			console.log(`   Prompt tokens: ${completion.usage.prompt_tokens}`);
			console.log(
				`   Completion tokens: ${completion.usage.completion_tokens}`,
			);
			console.log(`   Total tokens: ${completion.usage.total_tokens}`);
		}
	} catch (error) {
		console.error('❌ Simple request failed:', error.message);

		// Analyze error type
		if (error.message.includes('429')) {
			console.log("   🔍 Rate limit error - you're making too many requests");
			console.log('   💡 Try waiting a minute before making more requests');
		} else if (
			error.message.includes('quota') ||
			error.message.includes('billing')
		) {
			console.log('   🔍 Quota/billing error - check your account billing');
			console.log('   💡 You may need to add payment method or credits');
		} else if (error.message.includes('model')) {
			console.log('   🔍 Model error - the model might not be available');
		} else {
			console.log('   🔍 Other error - check the full error details');
		}

		console.error('   Full error:', error);
		return;
	}
	console.log('');

	// 4. Test rate limiting
	console.log('4️⃣ Testing rate limiting...');
	console.log('   Making 3 quick requests to test rate limits...');

	const results = [];
	for (let i = 1; i <= 3; i++) {
		try {
			console.log(`   Request ${i}/3...`);
			const startTime = Date.now();
			const completion = await openai.chat.completions.create({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'user',
						content: `Test ${i}`,
					},
				],
				max_tokens: 5,
			});
			const endTime = Date.now();

			results.push({
				success: true,
				time: endTime - startTime,
				response: completion.choices[0]?.message?.content,
			});

			console.log(
				`   ✅ Success (${endTime - startTime}ms): "${completion.choices[0]?.message?.content}"`,
			);

			// Small delay between requests
			if (i < 3) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		} catch (error) {
			results.push({
				success: false,
				error: error.message,
			});

			console.log(`   ❌ Failed: ${error.message}`);

			if (error.message.includes('429')) {
				console.log('   🔍 Rate limit hit on request', i);
				break;
			}
		}
	}

	const successCount = results.filter((r) => r.success).length;
	console.log(`   📊 Results: ${successCount}/3 successful`);

	if (successCount === 3) {
		console.log('   ✅ No rate limits hit - you can make multiple requests');
	} else if (successCount === 0) {
		console.log('   ❌ All requests failed - check your account status');
	} else {
		console.log('   ⚠️  Some requests failed - you may be hitting rate limits');
	}
	console.log('');

	// 5. Recommendations
	console.log('5️⃣ Recommendations:');

	if (successCount === 3) {
		console.log('   ✅ Your OpenAI account is working well');
		console.log('   💡 The issue might be in the job title generation logic');
		console.log(
			'   💡 Check the debug-ai-generation.js script for more details',
		);
	} else if (successCount === 0) {
		console.log('   ❌ Your OpenAI account has issues');
		console.log('   💡 Check your billing and payment method');
		console.log('   💡 Verify your API key is correct');
		console.log('   💡 Consider upgrading your plan for higher limits');
	} else {
		console.log('   ⚠️  Your account has partial issues');
		console.log('   💡 You may be hitting rate limits');
		console.log('   💡 Consider using the fallback system');
		console.log('   💡 Or upgrade your plan for higher limits');
	}

	console.log('');
	console.log('📊 Rate Limit Information:');
	console.log('   - Free tier: 3 requests per minute');
	console.log('   - Paid tier: 60 requests per minute');
	console.log('   - Higher tiers: 3500 requests per minute');
	console.log('   - Your current limit depends on your plan');
}

// Run the check
checkOpenAIStatus().catch(console.error);
