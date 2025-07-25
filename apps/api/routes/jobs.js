import express from 'express';
import { createJob, updateJob, deleteJob, getJobs } from '../controllers/jobsController.js';
import { getJobById } from '../controllers/jobController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', requireAuth, createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', requireAuth, updateJob);
router.delete('/:id', requireAuth, deleteJob);

export default router;
