import express from "express";
import { syncUser } from "./syncUser"; // Импорт вашей функции синхронизации

const app = express();
app.use(express.json()); // Для обработки JSON-запросов

// Обработчик вебхуков
app.post("/webhook/clerk", async (req, res) => {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    console.log(`Received webhook of type: ${type}`);

    if (type === "user.created" || type === "user.updated") {
      const userId = data.id;

      if (!userId) {
        return res.status(400).json({ error: "Missing user ID in payload" });
      }

      // Синхронизация пользователя
      await syncUser(userId);
      console.log(`User ${userId} synchronized.`);
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
