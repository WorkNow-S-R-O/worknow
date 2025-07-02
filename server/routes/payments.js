import { Router } from 'express';
import { createCheckoutSession, activatePremium, addPaymentHistory, getPaymentHistory, renewAutoRenewal } from '../controllers/payments.js';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/activate-premium', activatePremium);
router.post('/history', addPaymentHistory);
router.get('/history', getPaymentHistory);
router.post('/renew-auto-renewal', renewAutoRenewal);

export default router;
