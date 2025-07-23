import { Router } from 'express';
import { createCheckoutSession, activatePremium, addPaymentHistory, getPaymentHistory, renewAutoRenewal, getStripePaymentHistory, cancelAutoRenewal } from '../controllers/payments.js';

const router = Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/activate-premium', activatePremium);
router.post('/history', addPaymentHistory);
router.get('/history', getPaymentHistory);
router.post('/renew-auto-renewal', renewAutoRenewal);
router.post('/cancel-auto-renewal', cancelAutoRenewal);
router.get('/stripe-history', getStripePaymentHistory);

export default router;
