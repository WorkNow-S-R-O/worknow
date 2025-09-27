export const mockJobId = '42';

export const mockUpdatePayload = {
	title: 'Updated job title',
	salary: '₪8,500',
	cityId: '5',
	phone: '+972501234567',
	description: 'Updated description for a skilled position',
	categoryId: '12',
	shuttle: true,
	meals: false,
	imageUrl: 'https://cdn.example.com/job.png',
	userId: 'user-123',
};

export const badTitle = 'Bad title with spam link http://spam.example.com';
export const badDescription = 'Offensive description containing bad words and http://bad-link';

const baseUser = {
	id: 99,
	clerkUserId: mockUpdatePayload.userId,
	isPremium: false,
};

export const createExistingJob = (overrides = {}) => {
	const job = {
		id: Number(mockJobId),
		title: 'Original job title',
		user: baseUser,
	};

	return {
		...job,
		...overrides,
		user: {
			...job.user,
			...(overrides.user ?? {}),
		},
	};
};

export const createUpdatedJob = (overrides = {}) => {
	const updatedJob = {
		id: Number(mockJobId),
		title: mockUpdatePayload.title,
		description: mockUpdatePayload.description,
		phone: mockUpdatePayload.phone,
		salary: mockUpdatePayload.salary,
		imageUrl: mockUpdatePayload.imageUrl,
		city: { id: Number(mockUpdatePayload.cityId), name: 'Tel Aviv' },
		category: { id: Number(mockUpdatePayload.categoryId), name: 'IT' },
		user: baseUser,
	};

	return {
		...updatedJob,
		...overrides,
		user: {
			...updatedJob.user,
			...(overrides.user ?? {}),
		},
	};
};

export const createPremiumUpdatedJob = () =>
	createUpdatedJob({ user: { isPremium: true } });

export const mockPremiumUserJobs = [
	{
		id: 201,
		title: 'Premium Cleaner',
		city: { id: 5, name: 'Tel Aviv' },
	},
	{
		id: 202,
		title: 'Senior Caregiver',
		city: { id: 7, name: 'Haifa' },
	},
];
