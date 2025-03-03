import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import paymentRoutes from "./routes/payments.js";
import jobsRoutes from "./routes/jobs.js";
import citiesRoutes from "./routes/cities.js";
import usersRoutes from "./routes/users.js";
import webhookRoutes from "./routes/webhook.js";
import userSyncRoutes from "./routes/userSync.js";
import { WEBHOOK_SECRET, CLERK_SECRET_KEY } from "./config/clerkConfig.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.resolve(); // Для корректной работы с путями

// ✅ Настраиваем CORS
app.use(cors({
  origin: ["https://worknowjob.com", "http://localhost:3000"], // Разрешенные домены
  credentials: true,
}));

app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf.toString(); }
}));

// ✅ Раздача фронтенда, если он есть
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/", (req, res) => {
  res.send("🚀 API Server is running!");
});

// ✅ Подключение маршрутов
app.use("/api/jobs", jobsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/api/users", usersRoutes);
app.use("/webhook", webhookRoutes);
app.use("/api/user-sync", userSyncRoutes);

// ✅ Маршрут для отмены подписки
import { cancelAutoRenewal } from "./controllers/payments.js";
app.post("/api/payments/cancel-auto-renewal", cancelAutoRenewal);

// ✅ 404 обработка (если ничего не найдено)
app.use((req, res) => {
  res.status(404).json({ error: "🔴 Not Found" });
});

// ✅ Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("🔴 Server Error:", err);
  res.status(500).json({ error: "🚨 Internal Server Error" });
});

// ✅ Запускаем сервер
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Проверка наличия секретных ключей
if (!WEBHOOK_SECRET) {
  console.error("❌ Missing Clerk Webhook Secret!");
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  console.error("❌ Missing Clerk API Secret Key!");
  process.exit(1);
}
