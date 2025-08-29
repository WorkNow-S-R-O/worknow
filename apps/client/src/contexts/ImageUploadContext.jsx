import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

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

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      let API_URL = import.meta.env.VITE_API_URL;
  
      // ImageUploadContext initialized
      
      const token = await getToken();
      // Token received for image upload
      
      const response = await axios.post(`${API_URL}/api/s3-upload/job-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // Upload successful
      return response.data.imageUrl;
    } catch (error) {
      console.error('❌ ImageUploadContext - Upload error:', error);
      console.error('❌ ImageUploadContext - Error response:', error.response);
      console.error('❌ ImageUploadContext - Error message:', error.message);
      
      // Handle moderation errors specifically
      let errorMessage;
      if (error.response?.data?.code === 'CONTENT_REJECTED') {
        errorMessage = t('image_moderation_error');
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = t('image_upload_error') || 'Upload failed';
      }
      
      setUploadError(errorMessage);
      throw new Error(errorMessage);
    } finally {
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