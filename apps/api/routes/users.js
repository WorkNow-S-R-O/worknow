import express from 'express';
import {
	clerkWebhook,
	getUserByClerkId,
	getUserJobs,
	syncUser,
} from '../controllers/usersController.js';

const router = express.Router();

router.post('/sync-user', syncUser);
router.get('/:clerkUserId', getUserByClerkId);
router.get('/user-jobs/:clerkUserId', getUserJobs);
router.post('/webhook/clerk', clerkWebhook);

export default router;
