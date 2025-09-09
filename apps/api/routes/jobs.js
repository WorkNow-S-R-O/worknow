import express from 'express';
import { getJobById } from '../controllers/jobController.js';
import {
	createJob,
	deleteJob,
	getJobs,
	updateJob,
} from '../controllers/jobsController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', requireAuth, createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', requireAuth, updateJob);
router.delete('/:id', requireAuth, deleteJob);

export default router;
