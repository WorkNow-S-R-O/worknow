/* eslint-disable no-undef */
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();


const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

console.log('🔍 ClerkConfig - WEBHOOK_SECRET available:', !!WEBHOOK_SECRET);
console.log('🔍 ClerkConfig - WEBHOOK_SECRET length:', WEBHOOK_SECRET ? WEBHOOK_SECRET.length : 0);
console.log('🔍 ClerkConfig - CLERK_SECRET_KEY available:', !!CLERK_SECRET_KEY);
console.log('🔍 ClerkConfig - CLERK_SECRET_KEY length:', CLERK_SECRET_KEY ? CLERK_SECRET_KEY.length : 0);

console.log('🔍 ClerkConfig - About to check WEBHOOK_SECRET:', WEBHOOK_SECRET);
// Temporarily comment out the webhook secret check for debugging
// if (!WEBHOOK_SECRET) {
//   console.error('❌ Missing Clerk Webhook Secret!');
//   console.error('🔍 ClerkConfig - WEBHOOK_SECRET value:', WEBHOOK_SECRET);
//   console.error('🔍 ClerkConfig - WEBHOOK_SECRET type:', typeof WEBHOOK_SECRET);
//   process.exit(1);
// }

if (!CLERK_SECRET_KEY) {
  console.error('❌ Missing Clerk API Secret Key!');
  process.exit(1);
}

export { WEBHOOK_SECRET, CLERK_SECRET_KEY };
