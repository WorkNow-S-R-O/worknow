import express from 'express';
import { upload, uploadToS3, deleteFromS3, validateS3Config } from '../utils/s3Upload.js';
import { requireAuth } from '../middlewares/auth.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Validate S3 configuration on startup
const s3ConfigStatus = validateS3Config();
if (!s3ConfigStatus.isValid) {
  console.warn('⚠️ S3 configuration is incomplete. S3 uploads will not work.');
  console.warn('📖 See SETUP_GUIDE.md for configuration instructions');
}

/**
 * GET /api/s3-upload/test-config
 * Test S3 configuration without file upload
 */
router.get('/test-config', async (req, res) => {
  try {
    const configStatus = validateS3Config();
    res.json({
      success: true,
      config: configStatus,
      bucket: process.env.AWS_S3_BUCKET_NAME,
      region: process.env.AWS_REGION,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/s3-upload/test-upload
 * Test S3 upload without authentication (for debugging)
 */
router.post('/test-upload', upload.single('image'), async (req, res) => {
  try {
    console.log('🔍 S3 Test Upload - Request received:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      } : null
    });

    if (!req.file) {
      return res.status(400).json({ 
        error: 'No image file provided',
        code: 'MISSING_FILE'
      });
    }

    // Validate file size
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB.',
        code: 'FILE_TOO_LARGE'
      });
    }

    // Upload to S3
    const imageUrl = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'test'
    );

    console.log('✅ S3 test upload successful');
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('❌ S3 test upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image to S3',
      details: error.message,
      code: 'UPLOAD_FAILED'
    });
  }
});

/**
 * POST /api/s3-upload/job-image
 * Upload a single image for a job
 */
router.post('/job-image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    console.log('🔍 S3 Upload route - Request received:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      } : null,
      userId: req.user?.clerkUserId
    });

    if (!req.file) {
      return res.status(400).json({ 
        error: 'No image file provided',
        code: 'MISSING_FILE'
      });
    }

    // Validate file size
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB.',
        code: 'FILE_TOO_LARGE'
      });
    }

    // Upload to S3
    const imageUrl = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      'jobs'
    );

    console.log('✅ S3 upload successful for user:', req.user?.clerkUserId);
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.originalname,
      size: req.file.size
    });

  } catch (error) {
    console.error('❌ S3 upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image to S3',
      details: error.message,
      code: 'UPLOAD_FAILED'
    });
  }
});

/**
 * POST /api/s3-upload/job-with-image
 * Create a job with an uploaded image
 */
router.post('/job-with-image', requireAuth, upload.single('image'), async (req, res) => {
  try {
    console.log('🔍 Create job with image - Request received:', {
      hasFile: !!req.file,
      body: req.body,
      userId: req.user?.clerkUserId
    });

    const { title, salary, phone, description, cityId, categoryId, shuttle, meals } = req.body;

    // Validate required fields
    if (!title || !salary || !phone || !description || !cityId || !categoryId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['title', 'salary', 'phone', 'description', 'cityId', 'categoryId']
      });
    }

    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      try {
        imageUrl = await uploadToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          'jobs'
        );
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError);
        return res.status(500).json({
          error: 'Failed to upload image',
          details: uploadError.message
        });
      }
    }

    // Create job in database
    const job = await prisma.job.create({
      data: {
        title,
        salary,
        phone,
        description,
        cityId: parseInt(cityId),
        categoryId: parseInt(categoryId),
        userId: req.user.clerkUserId,
        imageUrl,
        shuttle: shuttle === 'true',
        meals: meals === 'true'
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

    console.log('✅ Job created successfully with image:', job.id);

    res.status(201).json({
      success: true,
      job,
      imageUrl
    });

  } catch (error) {
    console.error('❌ Create job with image error:', error);
    
    // If job creation failed and image was uploaded, try to delete it
    if (req.file && error.code !== 'P2002') { // Not a duplicate key error
      try {
        // Note: We can't delete the image here since we don't have the URL yet
        console.warn('⚠️ Job creation failed, but image was uploaded');
      } catch (deleteError) {
        console.error('❌ Failed to cleanup uploaded image:', deleteError);
      }
    }

    res.status(500).json({
      error: 'Failed to create job',
      details: error.message
    });
  }
});

/**
 * DELETE /api/s3-upload/delete-image
 * Delete an image from S3
 */
router.delete('/delete-image', requireAuth, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        error: 'Image URL is required',
        code: 'MISSING_URL'
      });
    }

    const deleted = await deleteFromS3(imageUrl);

    if (deleted) {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        error: 'Image not found or could not be deleted',
        code: 'DELETE_FAILED'
      });
    }

  } catch (error) {
    console.error('❌ Delete image error:', error);
    res.status(500).json({
      error: 'Failed to delete image',
      details: error.message
    });
  }
});

/**
 * PUT /api/s3-upload/update-job-image/:jobId
 * Update job image
 */
router.put('/update-job-image/:jobId', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.clerkUserId;

    console.log('🔍 Update job image - Request received:', {
      jobId,
      userId,
      hasFile: !!req.file
    });

    // Check if job exists and belongs to user
    const existingJob = await prisma.job.findFirst({
      where: {
        id: parseInt(jobId),
        userId: userId
      }
    });

    if (!existingJob) {
      return res.status(404).json({
        error: 'Job not found or access denied',
        code: 'JOB_NOT_FOUND'
      });
    }

    let imageUrl = existingJob.imageUrl;

    // Upload new image if provided
    if (req.file) {
      try {
        // Delete old image if it exists
        if (existingJob.imageUrl) {
          await deleteFromS3(existingJob.imageUrl);
        }

        // Upload new image
        imageUrl = await uploadToS3(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          'jobs'
        );
      } catch (uploadError) {
        console.error('❌ Image upload failed:', uploadError);
        return res.status(500).json({
          error: 'Failed to upload new image',
          details: uploadError.message
        });
      }
    }

    // Update job in database
    const updatedJob = await prisma.job.update({
      where: {
        id: parseInt(jobId)
      },
      data: {
        imageUrl
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

    console.log('✅ Job image updated successfully:', jobId);

    res.json({
      success: true,
      job: updatedJob,
      imageUrl
    });

  } catch (error) {
    console.error('❌ Update job image error:', error);
    res.status(500).json({
      error: 'Failed to update job image',
      details: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'File too large. Maximum size is 5MB.',
      code: 'FILE_TOO_LARGE'
    });
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ 
      error: 'Only image files are allowed!',
      code: 'INVALID_FILE_TYPE'
    });
  }
  
  next(error);
});

export default router; 