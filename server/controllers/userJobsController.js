import { getUserJobsService } from '../services/userJobsService.js';

export const getUserJobs = async (req, res) => {

  if (!req.params.clerkUserId) {
    return res.status(400).json({ error: 'clerkUserId is missing' });
  }

  const result = await getUserJobsService(req.params.clerkUserId, req.query);

  if (result.error) return res.status(500).json({ error: result.error });

  res.status(200).json(result);
};
