import { checkAndSendNewCandidatesNotification } from '../services/candidateNotificationService.js';
import { getUserByClerkIdService } from '../services/getUserByClerkService.js';
import {
	createSeeker,
	deleteSeeker,
	getAllSeekers,
	getSeekerById,
	getSeekerBySlug,
} from '../services/seekerService.js';

export async function getSeekers(req, res) {
	try {
		// Handle languages array from query parameters
		const query = { ...req.query };
		if (req.query.languages) {
			// If languages is already an array, use it as is
			if (Array.isArray(req.query.languages)) {
				query.languages = req.query.languages;
			} else {
				// If it's a single value, convert to array
				query.languages = [req.query.languages];
			}
		}

		// Add language parameter for city translation
		query.lang = req.query.lang || 'ru';

		const data = await getAllSeekers(query);
		res.json(data);
	} catch (error) {
		console.error('❌ Error getting seekers:', error);
		res.status(500).json({ error: 'Ошибка получения соискателей' });
	}
}

export async function addSeeker(req, res) {
	try {
		const {
			name,
			contact,
			city,
			description,
			gender,
			isDemanded,
			facebook,
			languages,
			nativeLanguage,
			category,
			employment,
			documents,
			announcement,
			note,
			documentType,
		} = req.body;
		const seekerData = {
			name,
			contact,
			city,
			description,
			gender,
			isDemanded,
			facebook,
			languages,
			nativeLanguage,
			category,
			employment,
			documents,
			announcement,
			note,
			documentType,
		};
		const seeker = await createSeeker(seekerData);

		// Trigger new candidates notification check after adding new candidate
		try {
			await checkAndSendNewCandidatesNotification();
		} catch (newsletterError) {
			console.error(
				'❌ Error triggering notification after adding candidate:',
				newsletterError,
			);
			// Don't fail the candidate creation if notification fails
		}

		res.status(201).json(seeker);
	} catch (e) {
		console.error('Ошибка при добавлении соискателя:', e);
		res.status(500).json({ error: 'Ошибка добавления соискателя' });
	}
}

export async function getSeekerBySlugController(req, res) {
	try {
		const seeker = await getSeekerBySlug(req.params.slug);
		if (!seeker) return res.status(404).json({ error: 'not found' });
		res.json(seeker);
	} catch {
		res.status(500).json({ error: 'Ошибка получения соискателя' });
	}
}

export async function deleteSeekerController(req, res) {
	try {
		await deleteSeeker(req.params.id);
		res.json({ success: true });
	} catch {
		res.status(500).json({ error: 'Ошибка удаления соискателя' });
	}
}

export async function getSeekerByIdController(req, res) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
		const seeker = await getSeekerById(id);
		if (!seeker) return res.status(404).json({ error: 'not found' });
		let isPremium = false;
		const clerkUserId = req.query.clerkUserId;
		if (clerkUserId) {
			const user = await getUserByClerkIdService(clerkUserId);
			isPremium = !!user?.isPremium;
		}
		res.json({ ...seeker, isPremium });
	} catch (e) {
		console.error('Ошибка получения соискателя по id:', e);
		res.status(500).json({ error: 'Ошибка получения соискателя' });
	}
}
