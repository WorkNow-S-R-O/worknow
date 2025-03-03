/* eslint-disable no-undef */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import winston from "winston";
import paymentRoutes, { cancelAutoRenewal } from "./routes/payments.js";
import jobsRoutes from "./routes/jobs.js";
import citiesRoutes from "./routes/cities.js";
import getJobs from "./routes/jobs.js";
import boostJob from "./routes/jobs.js";
import usersRoutes from "./routes/users.js";
import webhookRoutes from "./routes/webhook.js";
import userSyncRoutes from "./routes/userSync.js";
import userRoutes from "./routes/users.js";
import { WEBHOOK_SECRET, CLERK_SECRET_KEY } from "./config/clerkConfig.js";
import "./cron-jobs.js";

// ✅ Загружаем переменные окружения
dotenv.config();

// ✅ Логирование (Winston)
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

// ✅ Проверяем важные переменные окружения
if (!process.env.STRIPE_SECRET_KEY || !process.env.DATABASE_URL) {
  logger.error("❌ Ошибка: Отсутствуют переменные окружения!");
  process.exit(1);
}

// ✅ Инициализируем Prisma (БД)
const prisma = new PrismaClient();
async function connectDB() {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected successfully!");
  } catch (error) {
    logger.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}
connectDB();

// ✅ Инициализируем Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
logger.info("✅ Stripe API Initialized");

// ✅ Express сервер
const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS (разрешенные домены)
app.use(
  cors({
    origin: ["https://worknowjob.com"],
    credentials: true,
  })
);
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);

// ✅ Получаем путь к `dist/` в корне проекта
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "../");

// ✅ Раздача фронтенда из `dist/`
app.use(express.static(path.join(rootDir, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(rootDir, "dist", "index.html"));
});

// ✅ API-маршруты (не убираю, как просили)
app.use("/api/jobs", jobsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/cities", citiesRoutes);
app.use("/", getJobs);
app.use("/:id/boost", boostJob);
app.use("/api/users", usersRoutes);
app.use("/webhook", webhookRoutes);
app.use("/api/users", userSyncRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/user", userRoutes);

// ✅ Маршрут для отмены подписки (Stripe)
app.post("/api/payments/cancel-auto-renewal", cancelAutoRenewal);

// ✅ Обработка 404 (если маршрут не найден)
app.use((req, res) => {
  res.status(404).json({ error: "🔴 Not Found" });
});

// ✅ Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  logger.error("🔴 Server Error:", err);
  res.status(500).json({ error: "🚨 Internal Server Error" });
});

// ✅ Запуск сервера
app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Проверяем Clerk API
if (!WEBHOOK_SECRET) {
  logger.error("❌ Missing Clerk Webhook Secret!");
  process.exit(1);
}

if (!CLERK_SECRET_KEY) {
  logger.error("❌ Missing Clerk API Secret Key!");
  process.exit(1);
}
