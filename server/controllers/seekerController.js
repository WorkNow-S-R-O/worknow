import { getAllSeekers, createSeeker, getSeekerBySlug } from '../services/seekerService.js';

export async function getSeekers(req, res) {
  try {
    const seekers = await getAllSeekers();
    res.json(seekers);
  } catch {
    res.status(500).json({ error: 'Ошибка получения соискателей' });
  }
}

export async function addSeeker(req, res) {
  try {
    const seeker = await createSeeker(req.body);
    res.status(201).json(seeker);
  } catch {
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