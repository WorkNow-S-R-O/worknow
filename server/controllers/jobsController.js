// controllers/jobsController.js
import { createJobService } from '../services/jobCreateService.js';
import { updateJobService } from '../services/editFormService.js';
import { deleteJobService } from '../services/jobDeleteService.js';
import { getJobsService} from '../services/jobService.js';
import { boostJobService } from '../services/jobBoostService.js';


export const createJob = async (req, res) => {
  const jobData = req.body;
  // Если файл загружен, добавляем ссылку на изображение
  if (req.file) {
    jobData.imageUrl = `/images/jobs/${req.file.filename}`;
  }

  try {
    const job = await createJobService(jobData);
    res.status(201).json(job);
  } catch (error) {
    console.error("Ошибка создания объявления:", error.message);
    res.status(500).json({ error: "Ошибка создания объявления", details: error.message });
  }
};

export const updateJob = async (req, res) => {
    const jobData = req.body;
    if (req.file) {
      jobData.imageUrl = `/images/jobs/${req.file.filename}`;
    }
    const result = await updateJobService(req.params.id, jobData);
    if (result.error) return res.status(400).json({ error: result.error });
    if (result.errors) return res.status(400).json({ success: false, errors: result.errors });
    res.status(200).json(result.updatedJob);
  };

  export const deleteJob = async (req, res) => {
    const result = await deleteJobService(req.params.id);
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(200).json({ message: 'Объявление удалено' });
  };

  export const getJobs = async (req, res) => {
    const lang = req.query.lang || 'ru';
    const result = await getJobsService(lang);
    if (result.error) return res.status(500).json({ error: result.error });
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
    res.status(200).json(jobs);
  };

  export const boostJob = async (req, res) => {
    const result = await boostJobService(req.params.id);
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(200).json(result.boostedJob);
  };
  