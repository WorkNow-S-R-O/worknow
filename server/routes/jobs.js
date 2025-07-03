import express from 'express';
import { createJob, updateJob, deleteJob, getJobs, boostJob } from '../controllers/jobsController.js';
import { getJobById } from '../controllers/jobController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'public/images/jobs'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('images'), createJob);
router.post('/:id/boost', boostJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', upload.single('images'), updateJob);
router.delete('/:id', deleteJob);

export default router;
