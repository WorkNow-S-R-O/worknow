import express from 'express';
import { syncUser } from '../controllers/userSyncController.js';

const router = express.Router();

router.post('/sync-user', syncUser);

export default router;
