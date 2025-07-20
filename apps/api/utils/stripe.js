import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line no-undef
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
