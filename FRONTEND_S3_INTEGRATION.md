# Frontend S3 Integration Documentation

## Overview

The frontend has been successfully integrated with the S3 upload system. This document explains how to use the new S3 upload functionality in the WorkNow application.

## 🚀 Quick Start

### 1. Environment Setup

Make sure you have the following environment variables in your `.env` file:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1  # optional, defaults to us-east-1

# Frontend Configuration
VITE_API_URL=http://localhost:3001  # or your production API URL
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key
```

### 2. Test the Integration

Visit `/s3-test` in your application to test the S3 upload functionality:

```bash
# Start the development server
npm run dev

# Navigate to
http://localhost:3000/s3-test
```

## 📁 Updated Components

### 1. JobForm Component (`apps/client/src/components/form/JobForm.jsx`)

**Changes Made:**
- Added support for S3 image uploads
- Integrated with new `createJobWithImage` function
- Handles both image and non-image job creation

**Key Features:**
- Automatically detects if an image is uploaded
- Uses S3 endpoint for jobs with images
- Falls back to regular endpoint for jobs without images
- Proper error handling and user feedback

### 2. ImageUpload Component (`apps/client/src/components/ui/ImageUpload.jsx`)

**Changes Made:**
- Updated to pass both image URL and file to parent components
- Enhanced error handling for S3 uploads
- Improved user experience with loading states

**Props:**
```javascript
{
  onImageUpload: (url: string, file: File) => void,
  currentImageUrl: string,
  className: string
}
```

### 3. ImageUploadContext (`apps/client/src/contexts/ImageUploadContext.jsx`)

**Changes Made:**
- Updated to use S3 upload endpoint (`/api/s3-upload/job-image`)
- Enhanced error handling and logging
- Maintains backward compatibility

### 4. Jobs Library (`libs/jobs.ts`)

**New Functions:**
```typescript
// Create job with S3 image upload
createJobWithImage(formData: FormData, token?: string)

// Update job image
updateJobImage(jobId: number, imageFile: File, token?: string)

// Delete image from S3
deleteJobImage(imageUrl: string, token?: string)
```

## 🔧 API Endpoints

### Frontend Integration Points

1. **Upload Job Image**
   ```
   POST /api/s3-upload/job-image
   Content-Type: multipart/form-data
   Authorization: Bearer <clerk-token>
   Body: { image: File }
   ```

2. **Create Job with Image**
   ```
   POST /api/s3-upload/job-with-image
   Content-Type: multipart/form-data
   Authorization: Bearer <clerk-token>
   Body: { 
     image: File,
     title: string,
     salary: string,
     phone: string,
     description: string,
     cityId: string,
     categoryId: string,
     shuttle: string,
     meals: string
   }
   ```

3. **Update Job Image**
   ```
   PUT /api/s3-upload/update-job-image/:jobId
   Content-Type: multipart/form-data
   Authorization: Bearer <clerk-token>
   Body: { image: File }
   ```

4. **Delete Image**
   ```
   DELETE /api/s3-upload/delete-image
   Content-Type: application/json
   Authorization: Bearer <clerk-token>
   Body: { imageUrl: string }
   ```

## 🎯 Usage Examples

### 1. Creating a Job with Image

```javascript
import { createJobWithImage } from 'libs/jobs';
import { useAuth } from '@clerk/clerk-react';

const MyComponent = () => {
  const { getToken } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      const token = await getToken();
      const result = await createJobWithImage(formData, token);
      console.log('Job created:', result.job);
    } catch (error) {
      console.error('Error:', error);
    }
  };
};
```

### 2. Using ImageUpload Component

```javascript
import ImageUpload from './components/ui/ImageUpload';

const MyForm = () => {
  const handleImageUpload = (url, file) => {
    console.log('Image URL:', url);
    console.log('Image File:', file);
  };

  return (
    <ImageUpload 
      onImageUpload={handleImageUpload}
      currentImageUrl={null}
    />
  );
};
```

### 3. Updating Job Image

```javascript
import { updateJobImage } from 'libs/jobs';

const handleUpdateImage = async (jobId, file) => {
  try {
    const token = await getToken();
    const result = await updateJobImage(jobId, file, token);
    console.log('Image updated:', result.job.imageUrl);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🛡️ Security Features

### Authentication
- All S3 upload endpoints require Clerk authentication
- Tokens are automatically included in requests
- User ownership validation for job operations

### File Validation
- Image files only (jpg, jpeg, png, gif, webp)
- Maximum file size: 5MB
- Client-side and server-side validation

### Error Handling
- Comprehensive error messages
- Automatic cleanup on failures
- User-friendly error display

## 🔍 Testing

### Manual Testing
1. Navigate to `/s3-test`
2. Select an image file
3. Test different operations:
   - Create job with image
   - Update job image
   - Delete image

### Automated Testing
```javascript
// Example test for S3 upload
describe('S3 Upload', () => {
  it('should upload image successfully', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const result = await uploadImage(file);
    expect(result.imageUrl).toBeDefined();
  });
});
```

## 🚨 Error Handling

### Common Errors

1. **File Too Large**
   ```
   Error: File size exceeds 5MB limit
   Code: FILE_TOO_LARGE
   ```

2. **Invalid File Type**
   ```
   Error: Only image files are allowed
   Code: INVALID_FILE_TYPE
   ```

3. **Authentication Required**
   ```
   Error: Unauthorized
   Status: 401
   ```

4. **S3 Upload Failed**
   ```
   Error: Failed to upload image to S3
   Code: UPLOAD_FAILED
   ```

### Error Recovery
- Automatic cleanup of orphaned images
- User-friendly error messages
- Retry mechanisms for transient failures

## 📊 Performance Considerations

### Optimization Tips
1. **Image Compression**: Consider client-side image compression
2. **Lazy Loading**: Implement lazy loading for job images
3. **CDN**: Use CloudFront for better image delivery
4. **Caching**: Implement proper caching headers

### Monitoring
- Track upload success/failure rates
- Monitor S3 costs and usage
- Log performance metrics

## 🔄 Migration Guide

### From Local Upload to S3

If you're migrating from local file uploads:

1. **Update Image URLs**: Existing local URLs will continue to work
2. **New Uploads**: All new uploads will go to S3
3. **Database**: No schema changes required (imageUrl field already exists)

### Backward Compatibility
- Existing local upload functionality remains available
- Gradual migration to S3 is supported
- No breaking changes to existing components

## 🎯 Best Practices

### Frontend
1. Always validate files before upload
2. Show loading states during upload
3. Handle errors gracefully
4. Provide user feedback

### Security
1. Never expose AWS credentials in frontend code
2. Always use authentication tokens
3. Validate file types and sizes
4. Implement proper error handling

### Performance
1. Compress images before upload
2. Use appropriate image formats
3. Implement retry logic for failed uploads
4. Monitor upload performance

## 🆘 Troubleshooting

### Common Issues

1. **Upload Fails**
   - Check AWS credentials
   - Verify S3 bucket permissions
   - Check network connectivity

2. **Authentication Errors**
   - Ensure user is logged in
   - Check Clerk token validity
   - Verify API endpoint configuration

3. **File Validation Errors**
   - Check file type and size
   - Ensure proper file format
   - Verify client-side validation

### Debug Mode
Enable debug logging by checking browser console for detailed error messages and API responses.

## 📈 Future Enhancements

### Planned Features
1. **Image Optimization**: Automatic image compression and resizing
2. **Bulk Upload**: Support for multiple image uploads
3. **Progress Tracking**: Upload progress indicators
4. **Image Gallery**: Multiple images per job
5. **Advanced Validation**: AI-powered content moderation

### Technical Improvements
1. **WebSocket Integration**: Real-time upload status
2. **Offline Support**: Queue uploads when offline
3. **Advanced Caching**: Intelligent image caching
4. **Analytics**: Upload performance tracking

## 📞 Support

For issues or questions:
1. Check the browser console for error messages
2. Review the server logs for backend errors
3. Test with the `/s3-test` endpoint
4. Verify environment variable configuration

---

**Note**: This integration maintains full backward compatibility while providing enhanced S3 upload capabilities. All existing functionality continues to work as expected. 