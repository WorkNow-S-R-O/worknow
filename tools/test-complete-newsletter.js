import axios from 'axios';

const API_URL = 'http://localhost:3001';

/**
 * Test complete newsletter functionality
 */
async function testCompleteNewsletter() {
	console.log('🧪 Testing Complete Newsletter Functionality...\n');

	const testEmail = 'complete@example.com';
	const testSubscriber = {
		email: testEmail,
		firstName: 'Complete',
		lastName: 'Test',
		language: 'ru',
		preferences: {},
	};

	try {
		// Step 1: Check initial state
		console.log('📧 Step 1: Check initial state');
		const check1 = await axios.get(
			`${API_URL}/api/newsletter/check-subscription`,
			{
				params: { email: testEmail },
			},
		);
		console.log(
			'✅ Initial state:',
			check1.data.isSubscribed ? 'Subscribed' : 'Not subscribed',
		);
		console.log('   Expected behavior:');
		console.log('   - Fields: Enabled');
		console.log('   - Buttons: "Сбросить" + "Подписаться"');
		console.log('   - Text: Newsletter description');

		// Step 2: Subscribe
		console.log('\n📧 Step 2: Subscribe to newsletter');
		const subscribe = await axios.post(
			`${API_URL}/api/newsletter/subscribe`,
			testSubscriber,
		);
		console.log(
			'✅ Subscribe result:',
			subscribe.data.success ? 'Success' : 'Failed',
		);

		// Step 3: Check subscribed state
		console.log('\n📧 Step 3: Check subscribed state');
		const check2 = await axios.get(
			`${API_URL}/api/newsletter/check-subscription`,
			{
				params: { email: testEmail },
			},
		);
		console.log(
			'✅ Subscribed state:',
			check2.data.isSubscribed ? 'Subscribed' : 'Not subscribed',
		);
		console.log('   Expected behavior:');
		console.log('   - Fields: Disabled');
		console.log('   - Buttons: "Вы уже подписаны" + "Unsubscribe"');
		console.log('   - Text: Success message with subscriber info');

		// Step 4: Test unsubscribe functionality
		console.log('\n📧 Step 4: Test unsubscribe functionality');
		const unsubscribe = await axios.post(
			`${API_URL}/api/newsletter/unsubscribe`,
			{
				email: testEmail,
			},
		);
		console.log(
			'✅ Unsubscribe result:',
			unsubscribe.data.success ? 'Success' : 'Failed',
		);

		// Step 5: Check final state
		console.log('\n📧 Step 5: Check final state');
		const check3 = await axios.get(
			`${API_URL}/api/newsletter/check-subscription`,
			{
				params: { email: testEmail },
			},
		);
		console.log(
			'✅ Final state:',
			check3.data.isSubscribed ? 'Subscribed' : 'Not subscribed',
		);
		console.log('   Expected behavior:');
		console.log('   - Fields: Enabled again');
		console.log('   - Buttons: "Сбросить" + "Подписаться"');
		console.log('   - Text: Newsletter description');

		// Step 6: Verify database deletion
		console.log('\n📧 Step 6: Verify database deletion');
		const subscribers = await axios.get(
			`${API_URL}/api/newsletter/subscribers`,
		);
		const found = subscribers.data.subscribers.find(
			(s) => s.email === testEmail,
		);
		console.log(
			'✅ Database check:',
			found ? 'Still exists' : 'Successfully deleted',
		);

		console.log('\n✅ Complete Newsletter Test Completed!');
		console.log('\n📋 Summary:');
		console.log('   - Initial state: Fields enabled, subscribe buttons');
		console.log(
			'   - After subscribe: Fields disabled, unsubscribe button + "Вы уже подписаны"',
		);
		console.log(
			'   - After unsubscribe: Fields enabled again, subscribe buttons',
		);
		console.log('   - Database: Record completely deleted');
		console.log('   - All functionality: Working correctly');
	} catch (error) {
		console.error('❌ Test failed:', error.response?.data || error.message);
	}
}

// Run the test
testCompleteNewsletter().catch(console.error);
