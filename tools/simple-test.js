import dotenv from 'dotenv';

// Load environment variables the same way as the main app
dotenv.config({ path: '.env.local' });
dotenv.config();

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Simple test to check if OpenAI is working
 */
async function simpleTest() {
    console.log("🔍 Simple OpenAI Test...\n");

    // Check API key
    console.log("1️⃣ Checking API key...");
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error("❌ OPENAI_API_KEY not found");
        console.log("Available env vars:", Object.keys(process.env).filter(k => k.includes('OPENAI')));
        return;
    }
    console.log("✅ OPENAI_API_KEY found");
    console.log(`   Key starts with: ${apiKey.substring(0, 10)}...`);
    console.log("");

    // Test simple request
    console.log("2️⃣ Testing simple request...");
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: "Say 'test'"
                }
            ],
            max_tokens: 5,
        });
        
        console.log("✅ Success!");
        console.log(`   Response: "${completion.choices[0]?.message?.content}"`);
        console.log(`   Model: ${completion.model}`);
        console.log(`   Usage: ${JSON.stringify(completion.usage)}`);
        
    } catch (error) {
        console.error("❌ Failed:", error.message);
        
        if (error.message.includes('429')) {
            console.log("🔍 Rate limit error detected");
        } else if (error.message.includes('quota')) {
            console.log("🔍 Quota error detected");
        } else if (error.message.includes('401')) {
            console.log("🔍 Authentication error - check API key");
        } else if (error.message.includes('403')) {
            console.log("🔍 Authorization error - check account status");
        }
    }
}

// Run the test
simpleTest().catch(console.error); 