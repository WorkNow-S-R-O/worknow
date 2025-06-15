import express from 'express';
import { getSeekers, addSeeker, getSeekerBySlugController } from '../controllers/seekerController.js';

const router = express.Router();

router.get('/', getSeekers);
router.post('/', addSeeker);
router.get('/:slug', getSeekerBySlugController);

export default router;