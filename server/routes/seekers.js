import express from 'express';
import { getSeekers, addSeeker, getSeekerBySlugController, deleteSeekerController, getSeekerByIdController } from '../controllers/seekerController.js';

const router = express.Router();

router.get('/', getSeekers);
router.post('/', addSeeker);
router.get('/slug/:slug', getSeekerBySlugController);
router.get('/:id', getSeekerByIdController);
router.delete('/:id', deleteSeekerController);

export default router;