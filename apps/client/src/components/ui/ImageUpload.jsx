import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useImageUpload } from '../../contexts/ImageUploadContext.jsx';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const ImageUpload = ({ onImageUpload, currentImageUrl, className = '' }) => {
  const { t } = useTranslation();
  const { uploadImage, uploading, uploadError, clearError } = useImageUpload();
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || null);
  const fileInputRef = useRef(null);

  // Update preview URL when currentImageUrl prop changes
  useEffect(() => {
    setPreviewUrl(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload the file
      const imageUrl = await uploadImage(file);
      console.log('🔍 ImageUpload - Upload successful, URL:', imageUrl);
      
      // Call the parent callback with the uploaded URL and file
      if (onImageUpload) {
        console.log('🔍 ImageUpload - Calling onImageUpload with:', imageUrl, file);
        onImageUpload(imageUrl, file);
      }
      
      toast.success(t('image_upload_success') || 'Image uploaded successfully!');
      clearError();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || t('image_upload_error') || 'Failed to upload image');
      setPreviewUrl(currentImageUrl || null);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageUpload) {
      onImageUpload(null, null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload-container ${className}`}>
      <label className="form-label">
        {t('job_image') || 'Job Image'} 
        <span className="text-muted ms-1">({t('optional') || 'optional'})</span>
      </label>
      
      <div className="image-upload-area">
        {previewUrl ? (
          <div className="image-preview-container">
            {console.log('🔍 ImageUpload - uploading state:', uploading)}
            {console.log('🔍 ImageUpload - CSS class:', `image-with-glance ${uploading ? 'uploading' : ''}`)}
            <div className={`image-with-glance ${uploading ? 'uploading' : ''}`}>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="image-preview"
              />
            </div>
            <div className="image-actions mt-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm me-2"
                onClick={handleClick}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    {t('uploading') || 'Uploading...'}
                  </>
                ) : (
                  <>
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    {t('change_image') || 'Change Image'}
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                <i className="bi bi-trash me-1"></i>
                {t('remove_image') || 'Remove'}
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="upload-placeholder"
            onClick={handleClick}
            style={{
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: '#f8f9fa',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#1976d2';
              e.target.style.backgroundColor = '#f0f8ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#ccc';
              e.target.style.backgroundColor = '#f8f9fa';
            }}
          >
            <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', color: '#666', marginBottom: '10px' }}></i>
            <p className="mb-1" style={{ color: '#666' }}>
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {t('uploading') || 'Uploading...'}
                </>
              ) : (
                <>
                  <strong>{t('click_to_upload') || 'Click to upload image'}</strong>
                </>
              )}
            </p>
            <p className="text-muted small mb-0">
              {t('image_upload_hint') || 'JPG, PNG, GIF up to 5MB'}
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      {uploadError && (
        <div className="alert alert-danger mt-2" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {uploadError}
        </div>
      )}
    </div>
  );
};

ImageUpload.propTypes = {
  onImageUpload: PropTypes.func, // (url: string, file: File) => void
  currentImageUrl: PropTypes.string,
  className: PropTypes.string,
};

export default ImageUpload; 