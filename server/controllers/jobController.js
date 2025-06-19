import { getJobByIdService } from "../services/getJobService.js";
import { createJobService } from "../services/createJobService.js";

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
