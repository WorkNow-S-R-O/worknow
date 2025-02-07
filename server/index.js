/* eslint-disable no-undef */
import express from 'express';
import { Webhook } from 'svix';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error('Missing Clerk Webhook Secret!');
  process.exit(1);
}

app.post('/webhook/clerk', async (req, res) => {
  console.log('Received headers:', req.headers);

  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('❌ Missing Svix headers!');
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  const payload = req.body;
  const body = JSON.stringify(payload);

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });

    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    if (!id || !email_addresses || email_addresses.length === 0) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      await prisma.user.upsert({
        where: { clerkUserId: id },
        update: {
          email: email_addresses[0].email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
        create: {
          clerkUserId: id,
          email: email_addresses[0].email_address,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
      });

      console.log(`User ${id} created/updated.`);
    }

    if (evt.type === 'user.deleted') {
      await prisma.user.deleteMany({
        where: { clerkUserId: id },
      });

      console.log(`User ${id} deleted.`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
