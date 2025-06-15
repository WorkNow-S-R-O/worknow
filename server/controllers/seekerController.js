import { getAllSeekers, createSeeker, getSeekerBySlug, deleteSeeker, getSeekerById } from '../services/seekerService.js';

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
    console.log('Получен запрос на соискателя с id:', id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
    const seeker = await getSeekerById(id);
    console.log('Результат поиска:', seeker);
    if (!seeker) return res.status(404).json({ error: 'not found' });
    res.json(seeker);
  } catch (e) {
    console.error('Ошибка получения соискателя по id:', e);
    res.status(500).json({ error: 'Ошибка получения соискателя' });
  }
}