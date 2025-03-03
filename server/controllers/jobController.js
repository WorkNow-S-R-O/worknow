import { getJobByIdService } from "../services/getJobService.js";

export const getJobById = async (req, res) => {
  const { id } = req.params;

  console.log("ID из запроса:", id); // Логируем ID

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
