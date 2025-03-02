import dotenv from 'dotenv';

dotenv.config();

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!WEBHOOK_SECRET) {
  console.error('❌ Missing Clerk Webhook Secret!');
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error('❌ Missing Clerk API Secret Key!');
  process.exit(1);
}

export { WEBHOOK_SECRET, CLERK_SECRET_KEY };
