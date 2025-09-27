export const mockApiUrl = 'https://api.example.com';
export const mockJobId = 'job-123';

export const mockJobResponse = {
	id: 123,
	title: 'Updated Job',
	salary: '₪12,000',
	city: { id: 5, name: 'Tel Aviv' },
	category: { id: 9, name: 'IT' },
	phone: '+972501234567',
	description: 'A detailed description of the role.',
	shuttle: true,
	meals: false,
	imageUrl: 'https://cdn.example.com/images/job.png',
};

export const invalidJobResponse = 'unexpected-string';
