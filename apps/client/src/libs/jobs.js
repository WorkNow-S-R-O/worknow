import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth token
const getAuthToken = async () => {
	// This will be called from components that have access to Clerk
	// For now, we'll handle this in the components
	return null;
};

// Helper function to create authenticated request config
const createAuthConfig = async (headers = {}) => {
	const token = await getAuthToken();
	return {
		headers: {
			...headers,
			...(token && { Authorization: `Bearer ${token}` }),
		},
		withCredentials: true,
	};
};

export const createJob = async (jobData, token) => {
	const config = await createAuthConfig();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	const response = await axios.post(`${API_URL}/api/jobs`, jobData, config);
	return response.data;
};

export const createJobWithImage = async (formData, token) => {
	const config = await createAuthConfig({
		'Content-Type': 'multipart/form-data',
	});
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	const response = await axios.post(
		`${API_URL}/api/s3-upload/job-with-image`,
		formData,
		config,
	);
	return response.data;
};

export const updateJob = async (id, jobData, token) => {
	const config = await createAuthConfig();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	const response = await axios.put(
		`${API_URL}/api/jobs/${id}`,
		jobData,
		config,
	);
	return response.data;
};

export const updateJobImage = async (jobId, imageFile, token) => {
	const formData = new FormData();
	formData.append('image', imageFile);

	const config = await createAuthConfig({
		'Content-Type': 'multipart/form-data',
	});
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	const response = await axios.put(
		`${API_URL}/api/s3-upload/update-job-image/${jobId}`,
		formData,
		config,
	);
	return response.data;
};

export const deleteJobImage = async (imageUrl, token) => {
	const config = await createAuthConfig();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	const response = await axios.delete(`${API_URL}/api/s3-upload/delete-image`, {
		...config,
		data: { imageUrl },
	});
	return response.data;
};
