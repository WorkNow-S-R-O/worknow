import express from 'express';
import { createJob, updateJob, deleteJob, getJobs } from '../controllers/jobsController.js';
import { getJobById } from '../controllers/jobController.js';

const router = express.Router();

router.post('/', createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
