import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config({ path: '.env.local' });
dotenv.config();

console.log(
	'🔍 Stripe config - STRIPE_SECRET_KEY available:',
	!!process.env.STRIPE_SECRET_KEY,
);
console.log(
	'🔍 Stripe config - STRIPE_SECRET_KEY length:',
	process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0,
);
console.log(
	'🔍 Stripe config - STRIPE_SECRET_KEY starts with:',
	process.env.STRIPE_SECRET_KEY
		? process.env.STRIPE_SECRET_KEY.substring(0, 20) + '...'
		: 'undefined',
);

// eslint-disable-next-line no-undef
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
