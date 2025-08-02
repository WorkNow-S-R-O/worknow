import { Webhook } from 'svix';
import { processClerkWebhookService } from '../services/webhookService.js';

// eslint-disable-next-line no-undef
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!WEBHOOK_SECRET) {
  console.error('❌ Missing Clerk Webhook Secret!');
  // eslint-disable-next-line no-undef
  process.exit(1);
}

export const clerkWebhook = async (req, res) => {
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(req.rawBody, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });

    const result = await processClerkWebhookService(evt);
    if (result.error) return res.status(400).json({ error: result.error });

    res.status(200).json({ success: true });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(400).json({ error: 'Webhook verification failed' });
  }
};
