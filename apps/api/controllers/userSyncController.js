import { syncUserService } from '../services/userSyncService.js';

export const syncUser = async (req, res) => {
	const { clerkUserId } = req.body;

	if (!clerkUserId) {
		return res.status(400).json({ error: 'Missing Clerk user ID' });
	}

	const result = await syncUserService(clerkUserId);
	if (result.error) return res.status(500).json({ error: result.error });

	res.status(200).json(result);
};
