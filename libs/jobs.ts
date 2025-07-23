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

export const createJob = async (jobData: any, token?: string) => {
  const config = await createAuthConfig();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await axios.post(`${API_URL}/jobs`, jobData, config);
  return response.data;
};

export const createJobWithImage = async (formData: FormData, token?: string) => {
  const config = await createAuthConfig({
    'Content-Type': 'multipart/form-data',
  });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await axios.post(`${API_URL}/s3-upload/job-with-image`, formData, config);
  return response.data;
};

export const updateJob = async (id: number, jobData: any, token?: string) => {
  const config = await createAuthConfig();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await axios.put(`${API_URL}/jobs/${id}`, jobData, config);
  return response.data;
};

export const updateJobImage = async (jobId: number, imageFile: File, token?: string) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const config = await createAuthConfig({
    'Content-Type': 'multipart/form-data',
  });
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await axios.put(`${API_URL}/s3-upload/update-job-image/${jobId}`, formData, config);
  return response.data;
};

export const deleteJobImage = async (imageUrl: string, token?: string) => {
  const config = await createAuthConfig();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await axios.delete(`${API_URL}/s3-upload/delete-image`, {
    ...config,
    data: { imageUrl },
  });
  return response.data;
}; 