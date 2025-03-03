import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import paymentRoutes from "./routes/payments.js";
import jobsRoutes from "./routes/jobs.js";
import citiesRoutes from "./routes/cities.js";
import usersRoutes from "./routes/users.js";
import webhookRoutes from "./routes/webhook.js";
import userSyncRoutes from "./routes/userSync.js";
import { WEBHOOK_SECRET, CLERK_SECRET_KEY } from "./config/clerkConfig.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 📌 CORS (разрешаем фронтенд Railway)
app.use(cors({
  origin: ["https://worknowjob.com"],
  credentials: true,
}));

app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

// 📌 Получаем текущую директорию (для работы с ES-модулями)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Находим `dist/` в **корне проекта**, а не в `server/`
const rootDir = path.join(__dirname, "../");

// 📌 Раздача статичных файлов фронтенда из `dist/` в корне проекта
app.use(express.static(path.join(rootDir, "dist")));

// 📌 Если запрос НЕ относится к API, отдаём `index.html` из `dist/`
app.get("*", (req, res) => {
  res.sendFile(path.join(rootDir, "dist", "index.html"));
});

// 📌 API-маршруты
app.use("/api/jobs", jobsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/users", usersRoutes);
app.use("/webhook", webhookRoutes);
app.use("/api/user-sync", userSyncRoutes);

// 📌 Маршрут для отмены подписки
import { cancelAutoRenewal } from "./controllers/payments.js";
app.post("/api/payments/cancel-auto-renewal", cancelAutoRenewal);

// 📌 404 обработка
app.use((req, res) => {
  res.status(404).json({ error: "🔴 Not Found" });
});

// 📌 Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("🔴 Server Error:", err);
  res.status(500).json({ error: "🚨 Internal Server Error" });
});

// 📌 Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// 📌 Проверка наличия секретных ключей
if (!WEBHOOK_SECRET) {
  console.error("❌ Missing Clerk Webhook Secret!");
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error("❌ Missing Clerk API Secret Key!");
  process.exit(1);
}
