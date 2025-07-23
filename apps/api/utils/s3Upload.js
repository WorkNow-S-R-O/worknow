import AWS from 'aws-sdk';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Configure multer for memory storage (we'll upload directly to S3)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * Upload image to S3 and return public URL
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} originalname - Original filename
 * @param {string} mimetype - File MIME type
 * @param {string} folder - Folder path in S3 (optional)
 * @returns {Promise<string>} Public URL of uploaded image
 */
export const uploadToS3 = async (fileBuffer, originalname, mimetype, folder = 'jobs') => {
  try {
    console.log('🔍 S3 Upload - Starting upload process...');
    console.log('🔍 S3 Upload - Bucket:', BUCKET_NAME);
    console.log('🔍 S3 Upload - Region:', process.env.AWS_REGION);
    console.log('🔍 S3 Upload - Access Key ID:', process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) + '...');
    
    // Generate unique filename
    const fileExtension = originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimetype,
      Metadata: {
        'original-name': originalname
      }
    };

    console.log('🔍 S3 Upload - Upload params:', {
      Bucket: uploadParams.Bucket,
      Key: uploadParams.Key,
      ContentType: uploadParams.ContentType,
      BodySize: fileBuffer.length
    });

    const result = await s3.upload(uploadParams).promise();
    
    console.log('✅ S3 upload successful:', {
      fileName: fileName,
      url: result.Location,
      size: fileBuffer.length
    });

    return result.Location;
  } catch (error) {
    console.error('❌ S3 upload error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      requestId: error.requestId,
      cfId: error.cfId,
      extendedRequestId: error.extendedRequestId
    });
    throw new Error(`Failed to upload image to S3: ${error.message}`);
  }
};

/**
 * Delete image from S3
 * @param {string} imageUrl - The S3 URL of the image to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteFromS3 = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes(BUCKET_NAME)) {
      console.warn('⚠️ Invalid S3 URL for deletion:', imageUrl);
      return false;
    }

    // Extract key from URL
    const urlParts = imageUrl.split('/');
    const key = urlParts.slice(3).join('/'); // Remove protocol, domain, and bucket name

    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(deleteParams).promise();
    
    console.log('✅ S3 deletion successful:', key);
    return true;
  } catch (error) {
    console.error('❌ S3 deletion error:', error);
    return false;
  }
};

/**
 * Validate S3 configuration
 * @returns {Object} Configuration status with details
 */
export const validateS3Config = () => {
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_S3_BUCKET_NAME'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing S3 environment variables:', missingVars);
    console.error('💡 Please add the following to your .env file:');
    missingVars.forEach(varName => {
      console.error(`   ${varName}=your_${varName.toLowerCase()}`);
    });
    console.error('📖 See SETUP_GUIDE.md for detailed instructions');
    return {
      isValid: false,
      missingVars,
      message: `Missing S3 environment variables: ${missingVars.join(', ')}`
    };
  }

  return {
    isValid: true,
    missingVars: [],
    message: 'S3 configuration is valid'
  };
};

export default {
  upload,
  uploadToS3,
  deleteFromS3,
  validateS3Config
}; 