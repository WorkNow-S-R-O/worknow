import express from 'express';
import { createJob, updateJob, deleteJob, getJobs, boostJob } from '../controllers/jobsController.js';
import { getJobById } from '../controllers/jobController.js';

const router = express.Router();

router.post('/', createJob);
router.post('/:id/boost', boostJob);
router.get('/', getJobs);
router.get('/:id', getJobById); // Теперь в конце!
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
