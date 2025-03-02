import express from 'express';
import { getUserJobs } from '../controllers/userJobsController.js';

const router = express.Router();

router.get('/user-jobs/:clerkUserId', getUserJobs);

export default router;
