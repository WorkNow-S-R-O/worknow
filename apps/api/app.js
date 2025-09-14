import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { NODE_ENV } from './config/env.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  express.json({ verify: (req, res, buf) => (req.rawBody = buf.toString()) })
);
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://worknow.co.il',
      'https://www.worknow.co.il',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-intlayer-locale'],
  })
);

// Security Headers
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://clerk.worknow.co.il https://*.clerk.accounts.dev https://cdn.jsdelivr.net https://widget.survicate.com blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://clerk.worknow.co.il https://*.clerk.accounts.dev; frame-src https://js.stripe.com https://clerk.worknow.co.il https://*.clerk.accounts.dev; worker-src 'self' blob:;"
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
} else {
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: blob:; style-src 'self' 'unsafe-inline' https: http:; font-src 'self' https: http:; img-src 'self' data: https: http:; connect-src 'self' https: http:; frame-src https: http:; worker-src 'self' blob:;"
    );
    next();
  });
}

// Static Files
app.use('/images', express.static(path.join(__dirname, '../../public/images')));

export default app;
