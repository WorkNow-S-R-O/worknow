export const mockApiUrl = 'https://api.example.com';

export const mockJobId = 42;

export const mockJobResponse = {
	id: 42,
	title: 'Test Position',
	salary: 5000,
};

export const mockUpdatePayload = {
	title: 'Updated Position',
	salary: 6500,
};

export const mockUpdatedJobResponse = {
	id: 42,
	title: 'Updated Position',
	salary: 6500,
};

export const createAxiosResponse = (data) => ({
	data,
});
