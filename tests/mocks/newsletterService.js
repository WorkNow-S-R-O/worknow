export const baseSubscriber = {
	id: 1,
	email: 'subscriber@example.com',
	firstName: 'Alex',
	lastName: 'Doe',
};

export const mockSubscriberWithPreferences = {
	...baseSubscriber,
	preferredCities: ['Tel Aviv'],
	preferredCategories: ['IT'],
	preferredEmployment: ['full'],
	preferredLanguages: ['hebrew'],
	preferredGender: 'male',
	preferredDocumentTypes: ['passport'],
	onlyDemanded: true,
};

export const mockSubscriberWithoutMatches = {
	id: 2,
	email: 'no-matches@example.com',
	firstName: 'Chris',
	lastName: 'Smith',
	preferredCities: ['Jerusalem'],
	preferredCategories: ['Finance'],
	onlyDemanded: true,
};

export const mockSubscriberIds = [baseSubscriber.id, mockSubscriberWithoutMatches.id];

export const createCandidate = (overrides = {}) => ({
	id: 101,
	name: 'Experienced Candidate',
	gender: 'Male',
	city: 'Tel Aviv',
	employment: 'Full-time',
	category: 'IT',
	experience: 5,
	languages: ['Hebrew', 'English'],
	documents: 'Israeli passport',
	isDemanded: true,
	description: 'Seasoned professional ready to work',
	...overrides,
});

export const mockCandidates = [
	createCandidate(),
	createCandidate({
		id: 102,
		name: 'General Candidate',
		city: 'Haifa',
		employment: 'Part-time',
		category: 'Hospitality',
		languages: ['English'],
		isDemanded: false,
	}),
];

export const filteredCandidates = [createCandidate({ id: 201, name: 'Preferred Candidate' })];
