import express from 'express';
import { createJob, updateJob, deleteJob, getJobs, boostJob  } from '../controllers/jobsController.js';

const router = express.Router();

router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.get('/', getJobs);
router.post('/:id/boost', boostJob);



export default router;