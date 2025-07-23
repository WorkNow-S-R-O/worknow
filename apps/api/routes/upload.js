import express from 'express';
import multer from 'multer';
import upload from '../utils/upload.js';
import { requireAuth } from '../middlewares/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Upload single image
router.post('/job-image', requireAuth, upload.single('image'), (req, res) => {
  try {
    console.log('🔍 Upload route - Request received:', {
      hasFile: !!req.file,
      fileInfo: req.file ? {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      } : null
    });

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Generate the full URL for the uploaded image
    // For development, use localhost:3001, for production use the actual domain
    const baseUrl = req.get('host')?.includes('localhost') 
      ? 'http://localhost:3001' 
      : 'https://worknowjob.com';
    const imageUrl = `${baseUrl}/images/jobs/${req.file.filename}`;
    
    console.log('🔍 Upload route - Generated imageUrl:', imageUrl);
    
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: 'File upload error' });
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: 'Only image files are allowed!' });
  }
  
  next(error);
});

export default router; 