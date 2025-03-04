import { getCitiesService } from '../services/cityService.js';

export const getCities = async (req, res) => {
  console.log("📌 Получаем запрос на /api/cities...");
  
  const result = await getCitiesService();

  if (result.error) {
    console.error("❌ Ошибка в getCitiesService:", result.error);
    return res.status(500).json({ error: result.error });
  }

  console.log("📌 Отправляем города на клиент:", result.cities);
  res.status(200).json(result.cities);
};
