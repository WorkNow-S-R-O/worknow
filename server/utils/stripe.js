import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
console.log("📌 Stripe API Key:", process.env.STRIPE_SECRET_KEY ? "✅ Найден" : "❌ Отсутствует");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
