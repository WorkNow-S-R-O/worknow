import express from 'express';
import { createJob, updateJob, deleteJob, boostJob } from '../controllers/jobController.js';
import { getJobs, getJobById } from '../controllers/jobController.js';

const router = express.Router();

router.post('/', createJob);
router.post('/:id/boost', boostJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
