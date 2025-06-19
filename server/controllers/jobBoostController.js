import { boostJobService } from '../services/jobBoostService.js';

export const boostJob = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "ID вакансии обязателен и должен быть числом" });
  }

  try {
    const result = await boostJobService(Number(id));
    
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Ошибка поднятия объявления:", error.message);
    res.status(500).json({ error: "Ошибка поднятия объявления", details: error.message });
  }
}; 