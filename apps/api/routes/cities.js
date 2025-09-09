import express from 'express';
import { getCities } from '../controllers/cityController.js';
import { getCategories } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCities);
router.get('/categories', getCategories);

export default router;
