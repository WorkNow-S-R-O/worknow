import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const ImageUploadContext = createContext();

export const useImageUpload = () => {
  const context = useContext(ImageUploadContext);
  if (!context) {
    throw new Error('useImageUpload must be used within an ImageUploadProvider');
  }
  return context;
};

export const ImageUploadProvider = ({ children }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { getToken } = useAuth();

  const uploadImage = async (file) => {
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    console.log('🔍 ImageUploadContext - Setting uploading to true');
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      let API_URL = import.meta.env.VITE_API_URL;
      
      // Fallback for development if VITE_API_URL is not set or points to production
      if (!API_URL || API_URL.includes('worknowjob.com')) {
        API_URL = 'http://localhost:3001';
        console.log('🔍 ImageUploadContext - Using fallback API_URL for development:', API_URL);
      }
      
      console.log('🔍 ImageUploadContext - API_URL:', API_URL);
      console.log('🔍 ImageUploadContext - Full URL:', `${API_URL}/api/s3-upload/job-image`);
      
      const token = await getToken();
      console.log('🔍 ImageUploadContext - Token received:', token ? 'Yes' : 'No');
      
      const response = await axios.post(`${API_URL}/api/s3-upload/job-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log('✅ ImageUploadContext - Upload successful:', response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error('❌ ImageUploadContext - Upload error:', error);
      console.error('❌ ImageUploadContext - Error response:', error.response);
      console.error('❌ ImageUploadContext - Error message:', error.message);
      
      const errorMessage = error.response?.data?.error || error.message || 'Upload failed';
      setUploadError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      console.log('🔍 ImageUploadContext - Setting uploading to false');
      setUploading(false);
    }
  };

  const clearError = () => {
    setUploadError(null);
  };

  const value = {
    uploadImage,
    uploading,
    uploadError,
    clearError,
  };

  return (
    <ImageUploadContext.Provider value={value}>
      {children}
    </ImageUploadContext.Provider>
  );
};

ImageUploadProvider.propTypes = {
  children: PropTypes.node.isRequired,
}; 