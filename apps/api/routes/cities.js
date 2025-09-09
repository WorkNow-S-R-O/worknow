import express from 'express';
import { getCategories } from '../controllers/categoryController.js';
import { getCities } from '../controllers/cityController.js';

const router = express.Router();

router.get('/', getCities);
router.get('/categories', getCategories);

export default router;
