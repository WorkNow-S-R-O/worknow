import { uploadToS3WithModeration, deleteFromS3, validateS3Config } from '../utils/s3Upload.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Job posting limits
const MAX_JOBS_FREE_USER = 5;
const MAX_JOBS_PREMIUM_USER = 10;

/**
 * Service class for handling S3 upload operations
 */
class S3UploadService {
  constructor() {
    const configStatus = validateS3Config();
    this.isConfigured = configStatus.isValid;
    this.configStatus = configStatus;
    
    if (!this.isConfigured) {
      console.warn('⚠️ S3UploadService: S3 configuration is incomplete');
      console.warn('📖 See SETUP_GUIDE.md for configuration instructions');
    }
  }

  /**
   * Upload job image to S3
   * @param {Object} file - Multer file object
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Upload result
   */
  async uploadJobImage(file, userId) {
    try {
      if (!this.isConfigured) {
        throw new Error('S3 is not properly configured');
      }

      if (!file) {
        throw new Error('No file provided');
      }

      // Validate file type
      if (!file.mimetype.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      // Upload to S3 with moderation
      const uploadResult = await uploadToS3WithModeration(
        file.buffer,
        file.originalname,
        file.mimetype,
        'jobs'
      );

      if (!uploadResult.success) {
        if (uploadResult.code === 'CONTENT_REJECTED') {
          throw new Error(`Image content violates community guidelines: ${uploadResult.error}`);
        }
        throw new Error(`Upload failed: ${uploadResult.error}`);
      }

      const imageUrl = uploadResult.imageUrl;

      console.log('✅ S3UploadService: Image uploaded successfully for user:', userId);

      return {
        success: true,
        imageUrl,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      };

    } catch (error) {
      console.error('❌ S3UploadService: Upload failed:', error);
      throw error;
    }
  }

  /**
   * Create job with image upload
   * @param {Object} jobData - Job data
   * @param {Object} file - Multer file object (optional)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created job
   */
  async createJobWithImage(jobData, file, userId) {
    let imageUrl = null;
    let uploadedImageUrl = null;

    try {
      // Validate required job data
      const requiredFields = ['title', 'salary', 'phone', 'description', 'cityId', 'categoryId'];
      const missingFields = requiredFields.filter(field => !jobData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Upload image if provided
      if (file) {
        const uploadResult = await this.uploadJobImage(file, userId);
        imageUrl = uploadResult.imageUrl;
        uploadedImageUrl = imageUrl;
      }

      // Check user's job limit before creating job
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Check job count limit
      const jobCount = await prisma.job.count({ where: { userId: userId } });
      const isPremium = user.isPremium || user.premiumDeluxe;
      const maxJobs = isPremium ? MAX_JOBS_PREMIUM_USER : MAX_JOBS_FREE_USER;

      if (jobCount >= maxJobs) {
        if (isPremium) {
          throw new Error(`Вы уже разместили ${MAX_JOBS_PREMIUM_USER} объявлений.`);
        } else {
          throw new Error(`Вы уже разместили ${MAX_JOBS_FREE_USER} объявлений. Для размещения большего количества объявлений перейдите на Premium тариф.`);
        }
      }

      // Create job in database
      const job = await prisma.job.create({
        data: {
          title: jobData.title,
          salary: jobData.salary,
          phone: jobData.phone,
          description: jobData.description,
          cityId: parseInt(jobData.cityId),
          categoryId: parseInt(jobData.categoryId),
          userId: userId,
          imageUrl,
          shuttle: jobData.shuttle === 'true',
          meals: jobData.meals === 'true'
        },
        include: {
          city: true,
          category: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      console.log('✅ S3UploadService: Job created successfully with image:', job.id);

      return {
        success: true,
        job,
        imageUrl
      };

    } catch (error) {
      console.error('❌ S3UploadService: Create job failed:', error);
      
      // Cleanup: Delete uploaded image if job creation failed
      if (uploadedImageUrl) {
        try {
          await this.deleteImage(uploadedImageUrl);
          console.log('✅ S3UploadService: Cleaned up uploaded image after job creation failure');
        } catch (cleanupError) {
          console.error('❌ S3UploadService: Failed to cleanup image:', cleanupError);
        }
      }

      throw error;
    }
  }

  /**
   * Update job image
   * @param {number} jobId - Job ID
   * @param {Object} file - Multer file object
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated job
   */
  async updateJobImage(jobId, file, userId) {
    let newImageUrl = null;

    try {
      // Check if job exists and belongs to user
      const existingJob = await prisma.job.findFirst({
        where: {
          id: parseInt(jobId),
          userId: userId
        }
      });

      if (!existingJob) {
        throw new Error('Job not found or access denied');
      }

      // Upload new image
      if (file) {
        const uploadResult = await this.uploadJobImage(file, userId);
        newImageUrl = uploadResult.imageUrl;

        // Delete old image if it exists
        if (existingJob.imageUrl) {
          await this.deleteImage(existingJob.imageUrl);
        }
      }

      // Update job in database
      const updatedJob = await prisma.job.update({
        where: {
          id: parseInt(jobId)
        },
        data: {
          imageUrl: newImageUrl || existingJob.imageUrl
        },
        include: {
          city: true,
          category: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      console.log('✅ S3UploadService: Job image updated successfully:', jobId);

      return {
        success: true,
        job: updatedJob,
        imageUrl: newImageUrl
      };

    } catch (error) {
      console.error('❌ S3UploadService: Update job image failed:', error);
      
      // Cleanup: Delete new image if update failed
      if (newImageUrl) {
        try {
          await this.deleteImage(newImageUrl);
          console.log('✅ S3UploadService: Cleaned up new image after update failure');
        } catch (cleanupError) {
          console.error('❌ S3UploadService: Failed to cleanup new image:', cleanupError);
        }
      }

      throw error;
    }
  }

  /**
   * Delete image from S3
   * @param {string} imageUrl - Image URL to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteImage(imageUrl) {
    try {
      if (!imageUrl) {
        return false;
      }

      const deleted = await deleteFromS3(imageUrl);
      
      if (deleted) {
        console.log('✅ S3UploadService: Image deleted successfully');
      } else {
        console.warn('⚠️ S3UploadService: Image deletion failed or image not found');
      }

      return deleted;

    } catch (error) {
      console.error('❌ S3UploadService: Delete image failed:', error);
      return false;
    }
  }

  /**
   * Delete job and its associated image
   * @param {number} jobId - Job ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteJobWithImage(jobId, userId) {
    try {
      // Get job with image URL
      const job = await prisma.job.findFirst({
        where: {
          id: parseInt(jobId),
          userId: userId
        },
        select: {
          id: true,
          imageUrl: true
        }
      });

      if (!job) {
        throw new Error('Job not found or access denied');
      }

      // Delete image from S3 if it exists
      if (job.imageUrl) {
        await this.deleteImage(job.imageUrl);
      }

      // Delete job from database
      await prisma.job.delete({
        where: {
          id: parseInt(jobId)
        }
      });

      console.log('✅ S3UploadService: Job and image deleted successfully:', jobId);

      return true;

    } catch (error) {
      console.error('❌ S3UploadService: Delete job failed:', error);
      throw error;
    }
  }

  /**
   * Validate file for upload
   * @param {Object} file - Multer file object
   * @returns {Object} Validation result
   */
  validateFile(file) {
    const errors = [];

    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    // Check file type
    if (!file.mimetype.startsWith('image/')) {
      errors.push('Only image files are allowed');
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size exceeds 5MB limit');
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push('Invalid file extension. Allowed: jpg, jpeg, png, gif, webp');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get S3 configuration status
   * @returns {Object} Configuration status
   */
  getConfigurationStatus() {
    return {
      isConfigured: this.isConfigured,
      requiredEnvVars: [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'AWS_S3_BUCKET_NAME'
      ],
      optionalEnvVars: [
        'AWS_REGION'
      ]
    };
  }
}

export default new S3UploadService(); 