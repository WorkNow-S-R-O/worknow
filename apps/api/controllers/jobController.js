import { getJobByIdService } from "../services/getJobById.js";
import { createJobService } from "../services/createJobService.js";

export const getJobById = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID вакансии обязателен и должен быть числом" });
  }

  try {
    const result = await getJobByIdService(Number(id)); // Передаем число

    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    console.log('🔍 getJobById - Job data:', result.job);
    res.status(200).json(result.job);
  } catch (error) {
    console.error("Ошибка получения объявления:", error.message);
    res.status(500).json({ error: "Ошибка получения объявления", details: error.message });
  }
};

export const createJob = async (req, res) => {
  const jobData = req.body;

  try {
    const result = await createJobService(jobData);
    
    if (result.error) {
      // Check if upgrade is required
      if (result.upgradeRequired) {
        return res.status(403).json({ 
          error: result.error,
          upgradeRequired: true,
          message: "Для размещения большего количества объявлений перейдите на Premium тариф"
        });
      }
      return res.status(400).json({ error: result.error });
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error("Ошибка создания объявления:", error.message);
    res.status(500).json({ error: "Ошибка создания объявления", details: error.message });
  }
};
