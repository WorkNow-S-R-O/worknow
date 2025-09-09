import axios from 'axios';

const API_URL = 'http://localhost:3001';

async function testJobCreation() {
	try {
		console.log('🔍 Testing job creation with imageUrl...');

		// First, let's test the regular job creation endpoint
		const testJobData = {
			title: 'Test Job with Image',
			salary: '100',
			phone: '1234567890',
			description: 'Test job description',
			cityId: 5,
			categoryId: 5,
			userId: '3d55c6be-e9c0-490b-a4ba-daf4134445c1',
			shuttle: false,
			meals: false,
			imageUrl: 'http://localhost:3001/images/jobs/test-image.png',
		};

		console.log('🔍 Sending request to regular job creation endpoint...');

		// Test the regular job creation endpoint
		const response = await axios.post(`${API_URL}/api/jobs`, testJobData, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer test-token', // Add a test token
			},
		});

		console.log('✅ Response received:', response.data);

		if (response.data.id) {
			console.log('✅ Job created successfully!');
			console.log('🔍 Job data:', response.data);
			console.log('🔍 imageUrl in response:', response.data.imageUrl);
		} else {
			console.log('❌ No job in response');
			console.log('🔍 Response details:', response.data);
		}
	} catch (error) {
		console.error('❌ Error:', error.response?.data || error.message);
		console.error('❌ Status:', error.response?.status);
		console.error('❌ Headers:', error.response?.headers);
	}
}

testJobCreation();
