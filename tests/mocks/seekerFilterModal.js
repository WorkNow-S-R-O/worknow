// Mock for SeekerFilterModal component tests
export const mockIntlayerHooks = {
	useIntlayer: () => ({
		filterModalTitle: { value: 'Filter Seekers' },
		city: { value: 'City' },
		category: { value: 'Category' },
		employment: { value: 'Employment' },
		documentType: { value: 'Document Type' },
		gender: { value: 'Gender' },
		languages: { value: 'Languages' },
		demanded: { value: 'In Demand' },
		chooseCity: { value: 'Choose City' },
		chooseCategory: { value: 'Choose Category' },
		chooseEmployment: { value: 'Choose Employment' },
		chooseDocumentType: { value: 'Choose Document Type' },
		chooseGender: { value: 'Choose Gender' },
		languageRussian: { value: 'Russian' },
		languageArabic: { value: 'Arabic' },
		languageEnglish: { value: 'English' },
		languageHebrew: { value: 'Hebrew' },
		languageUkrainian: { value: 'Ukrainian' },
		employmentFull: { value: 'Full Time' },
		employmentPartial: { value: 'Part Time' },
		documentVisaB1: { value: 'Visa B1' },
		documentVisaB2: { value: 'Visa B2' },
		documentTeudatZehut: { value: 'Teudat Zehut' },
		documentWorkVisa: { value: 'Work Visa' },
		documentOther: { value: 'Other' },
		genderMale: { value: 'Male' },
		genderFemale: { value: 'Female' },
		reset: { value: 'Reset' },
		save: { value: 'Apply' },
	}),
	useLocale: () => ({ locale: 'en' }),
};

export const mockCities = [
	{ id: 1, name: 'Tel Aviv' },
	{ id: 2, name: 'Jerusalem' },
	{ id: 3, name: 'Haifa' },
];

export const mockCategories = [
	{ id: 1, name: 'IT', label: 'Information Technology' },
	{ id: 2, name: 'Healthcare', label: 'Healthcare' },
	{ id: 3, name: 'Education', label: 'Education' },
];

export const mockFetch = (url) => {
	if (url.includes('/api/cities')) {
		return Promise.resolve({
			json: () => Promise.resolve(mockCities),
		});
	}
	if (url.includes('/api/categories')) {
		return Promise.resolve({
			json: () => Promise.resolve(mockCategories),
		});
	}
	return Promise.reject(new Error('Unknown URL'));
};

export const mockWindow = {
	innerWidth: 1024,
};

export const mockDocument = {
	body: {
		style: {
			overflow: '',
			position: '',
			width: '',
		},
	},
	querySelector: () => ({
		style: { display: '' },
	}),
};

export const mockConsole = {
	log: () => {}, // Silent console.log to prevent infinite output
	error: () => {},
	warn: () => {},
};
