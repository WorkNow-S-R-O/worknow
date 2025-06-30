import { Router } from 'express';
import { createCheckoutSession, activatePremium, addPaymentHistory, getPaymentHistory } from '../controllers/payments.js';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/activate-premium', activatePremium);
router.post('/history', addPaymentHistory);
router.get('/history', getPaymentHistory);

export default router;
