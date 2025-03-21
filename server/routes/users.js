import express from 'express';
import { syncUser, getUserByClerkId, getUserJobs, clerkWebhook } from '../controllers/usersController.js';

const router = express.Router();

router.post('/sync-user', syncUser);
router.get('/:clerkUserId', getUserByClerkId);
router.get('/user-jobs/:clerkUserId', getUserJobs);
router.post('/webhook/clerk', clerkWebhook);

export default router;
