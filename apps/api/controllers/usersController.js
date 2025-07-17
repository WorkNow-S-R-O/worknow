import { syncUserService, getUserByClerkIdService, getUserJobsService } from '../services/userService.js';

// Вебхук для Clerk
export const clerkWebhook = async (req, res) => {
  // eslint-disable-next-line no-undef
  const { WEBHOOK_SECRET } = process.env;
  if (!WEBHOOK_SECRET) return res.status(500).json({ error: 'Missing Clerk Webhook Secret' });

  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  try {
    await syncUserService(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: 'Webhook verification failed', details: error.message });
  }
};

export const syncUser = async (req, res) => {
  const result = await syncUserService(req.body.clerkUserId);
  if (result.error) return res.status(500).json({ error: result.error });
  res.status(200).json(result);
};

export const getUserByClerkId = async (req, res) => {
  const result = await getUserByClerkIdService(req.params.clerkUserId);
  if (result.error) return res.status(404).json({ error: result.error });
  res.status(200).json(result.user);
};

export const getUserJobs = async (req, res) => {
  const lang = req.query.lang || 'ru';
  const result = await getUserJobsService(req.params.clerkUserId, req.query);
  if (result.error) return res.status(500).json({ error: result.error });
  // Формируем ответ с переводом категории
  const jobs = result.jobs.map(job => {
    let categoryLabel = job.category?.name;
    if (job.category?.translations?.length) {
      const translation = job.category.translations.find(t => t.lang === lang);
      if (translation) categoryLabel = translation.name;
    }
    return {
      ...job,
      category: job.category ? { ...job.category, label: categoryLabel } : null
    };
  });
  res.status(200).json({ ...result, jobs });
};