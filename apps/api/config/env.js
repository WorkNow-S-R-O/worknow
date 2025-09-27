import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

if (!process.env.DATABASE_URL) {
	console.error('❌ Missing DATABASE_URL!');
	process.exit(1);
}

if (!process.env.CLERK_SECRET_KEY) {
	console.error('❌ Missing Clerk API Secret Key!');
	process.exit(1);
}

export const PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
