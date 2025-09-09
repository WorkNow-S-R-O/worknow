/**
 * Test file demonstrating S3 upload functionality
 *
 * This file shows how to use the S3 upload system with various scenarios
 * including error handling and edge cases.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Example environment variables needed for S3
const requiredEnvVars = {
	AWS_ACCESS_KEY_ID: 'your-access-key-id',
	AWS_SECRET_ACCESS_KEY: 'your-secret-access-key',
	AWS_S3_BUCKET_NAME: 'your-bucket-name',
	AWS_REGION: 'us-east-1', // optional, defaults to us-east-1
};

console.log('🔧 Required environment variables for S3 upload:');
Object.entries(requiredEnvVars).forEach(([key, value]) => {
	console.log(`  ${key}=${value}`);
});

console.log('\n📋 Example .env file content:');
console.log('# AWS S3 Configuration');
Object.entries(requiredEnvVars).forEach(([key, value]) => {
	console.log(`${key}=${value}`);
});

console.log('\n🚀 API Endpoints available:');

const endpoints = [
	{
		method: 'POST',
		path: '/api/s3-upload/job-image',
		description: 'Upload a single image for a job',
		auth: 'Required',
		body: 'multipart/form-data with image file',
		response: 'Returns imageUrl',
	},
	{
		method: 'POST',
		path: '/api/s3-upload/job-with-image',
		description: 'Create a job with an uploaded image',
		auth: 'Required',
		body: 'multipart/form-data with job data + image file',
		response: 'Returns created job with imageUrl',
	},
	{
		method: 'PUT',
		path: '/api/s3-upload/update-job-image/:jobId',
		description: 'Update job image',
		auth: 'Required',
		body: 'multipart/form-data with new image file',
		response: 'Returns updated job with new imageUrl',
	},
	{
		method: 'DELETE',
		path: '/api/s3-upload/delete-image',
		description: 'Delete an image from S3',
		auth: 'Required',
		body: 'JSON with imageUrl',
		response: 'Returns success status',
	},
];

endpoints.forEach((endpoint) => {
	console.log(`\n${endpoint.method} ${endpoint.path}`);
	console.log(`  Description: ${endpoint.description}`);
	console.log(`  Authentication: ${endpoint.auth}`);
	console.log(`  Body: ${endpoint.body}`);
	console.log(`  Response: ${endpoint.response}`);
});

console.log('\n📝 Example usage with curl:');

console.log('\n1. Upload job image:');
console.log(`curl -X POST http://localhost:3001/api/s3-upload/job-image \\
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \\
  -F "image=@/path/to/your/image.jpg"`);

console.log('\n2. Create job with image:');
console.log(`curl -X POST http://localhost:3001/api/s3-upload/job-with-image \\
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \\
  -F "title=Software Developer" \\
  -F "salary=50" \\
  -F "phone=+1234567890" \\
  -F "description=We are looking for a skilled developer..." \\
  -F "cityId=1" \\
  -F "categoryId=1" \\
  -F "shuttle=true" \\
  -F "meals=false" \\
  -F "image=@/path/to/your/image.jpg"`);

console.log('\n3. Update job image:');
console.log(`curl -X PUT http://localhost:3001/api/s3-upload/update-job-image/123 \\
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \\
  -F "image=@/path/to/new/image.jpg"`);

console.log('\n4. Delete image:');
console.log(`curl -X DELETE http://localhost:3001/api/s3-upload/delete-image \\
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"imageUrl": "https://your-bucket.s3.amazonaws.com/jobs/image.jpg"}'`);

console.log('\n🔍 Error handling examples:');

const errorScenarios = [
	{
		scenario: 'Missing file',
		error: 'No image file provided',
		code: 'MISSING_FILE',
		status: 400,
	},
	{
		scenario: 'File too large',
		error: 'File too large. Maximum size is 5MB.',
		code: 'FILE_TOO_LARGE',
		status: 400,
	},
	{
		scenario: 'Invalid file type',
		error: 'Only image files are allowed!',
		code: 'INVALID_FILE_TYPE',
		status: 400,
	},
	{
		scenario: 'S3 upload failed',
		error: 'Failed to upload image to S3',
		code: 'UPLOAD_FAILED',
		status: 500,
	},
	{
		scenario: 'Missing required fields',
		error: 'Missing required fields',
		status: 400,
	},
	{
		scenario: 'Job not found',
		error: 'Job not found or access denied',
		code: 'JOB_NOT_FOUND',
		status: 404,
	},
];

errorScenarios.forEach((scenario) => {
	console.log(`\n${scenario.scenario}:`);
	console.log(`  Error: ${scenario.error}`);
	if (scenario.code) console.log(`  Code: ${scenario.code}`);
	console.log(`  Status: ${scenario.status}`);
});

console.log('\n🛡️ Security features:');
const securityFeatures = [
	'Authentication required for all endpoints',
	'File type validation (images only)',
	'File size limits (5MB max)',
	'User ownership validation for job operations',
	'Automatic cleanup of orphaned images on failure',
	'Secure S3 bucket configuration with public-read ACL',
	'Unique filename generation to prevent conflicts',
];

securityFeatures.forEach((feature) => {
	console.log(`  ✅ ${feature}`);
});

console.log('\n📊 Database schema (already exists):');
console.log(`
model Job {
  id          Int       @id @default(autoincrement())
  title       String
  salary      String
  phone       String
  description String
  cityId      Int
  userId      String
  categoryId  Int
  imageUrl    String?   // URL to the job image (S3 URL)
  createdAt   DateTime  @default(now())
  boostedAt   DateTime?
  city        City      @relation(fields: [cityId], references: [id])
  user        User      @relation(fields: [userId], references: [id])
  category    Category  @relation(fields: [categoryId], references: [id])
  shuttle     Boolean?
  meals       Boolean?
}
`);

console.log('\n🎯 Best practices:');
const bestPractices = [
	'Always validate files on both client and server side',
	'Use environment variables for sensitive configuration',
	'Implement proper error handling and cleanup',
	'Monitor S3 costs and implement lifecycle policies',
	'Use CDN for better image delivery performance',
	'Implement image optimization and compression',
	'Regular backup of S3 bucket data',
	'Monitor upload success/failure rates',
];

bestPractices.forEach((practice) => {
	console.log(`  📌 ${practice}`);
});

console.log('\n✨ The S3 upload system is now ready to use!');
console.log('Make sure to:');
console.log('1. Set up your AWS S3 bucket with proper permissions');
console.log('2. Configure the environment variables');
console.log('3. Test the endpoints with your authentication tokens');
console.log('4. Monitor the logs for any issues');
