import { Router } from 'express';
import { createCheckoutSession, activatePremium } from '../controllers/payments.js';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/activate-premium', activatePremium);

export default router;
