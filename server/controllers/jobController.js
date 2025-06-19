import { getJobByIdService } from "../services/getJobService.js";
import { createJobService } from "../services/createJobService.js";
import { getJobsService } from '../services/jobService.js';

export const getJobById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID вакансии обязателен и должен быть числом" });
  }

  try {
    const job = await getJobByIdService(Number(id)); // Передаем число

    if (!job) {
      return res.status(404).json({ error: "Объявление не найдено" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Ошибка получения объявления:", error.message);
    res.status(500).json({ error: "Ошибка получения объявления", details: error.message });
  }
};

export const createJob = async (req, res) => {
  const jobData = req.body;

  try {
    const job = await createJobService(jobData);
    res.status(201).json(job);
  } catch (error) {
    console.error("Ошибка создания объявления:", error.message);
    res.status(500).json({ error: "Ошибка создания объявления", details: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    // Получаем параметры фильтрации из query
    const { salary, categoryId } = req.query;
    
    // Формируем объект фильтров
    const filters = {};
    if (salary) filters.salary = salary;
    if (categoryId) filters.categoryId = categoryId;

    const result = await getJobsService(filters);
    
    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error('Ошибка в getJobs:', error);
    res.status(500).json({ error: 'Ошибка получения объявлений' });
  }
};
