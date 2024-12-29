import express from "express";
import { PrismaClient } from "@prisma/client";
import { clerkMiddleware } from "@clerk/express";
import { Webhook } from "svix";
import dotenv from "dotenv";

dotenv.config(); // Загружаем переменные окружения

const app = express();
const prisma = new PrismaClient();

// Middleware Clerk для обработки аутентификации
app.use(
  clerkMiddleware({
    secretKey: process.env.VITE_SECRET_API_KEY,
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
  })
);

// Обработчик вебхуков
app.post("/webhook/clerk", async (req, res) => {
  const payload = JSON.stringify(req.body);
  const headers = req.headers;

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  const wh = new Webhook(webhookSecret);

  let event;

  try {
    // Проверяем подпись вебхука
    event = wh.verify(payload, headers);
  } catch (err) {
    console.error("Invalid webhook signature", err);
    return res.status(400).json({ error: "Invalid signature" });
  }

  const { type, data } = event;

  console.log(`Received webhook event of type: ${type}`);

  if (type === "user.created" || type === "user.updated") {
    const userId = data.id;

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID in payload" });
    }

    const primaryEmail = data.email_addresses.find(
      (email) => email.id === data.primary_email_address_id
    )?.email_address;

    if (!primaryEmail) {
      return res.status(400).json({ error: "Primary email not found" });
    }

    // Синхронизация с базой данных Prisma
    try {
      await prisma.user.upsert({
        where: { email: primaryEmail },
        update: {
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        },
        create: {
          id: userId,
          email: primaryEmail,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        },
      });

      console.log(`User ${userId} synchronized successfully.`);
    } catch (err) {
      console.error(`Error synchronizing user ${userId}`, err);
      return res.status(500).json({ error: "Failed to synchronize user" });
    }
  }

  res.status(200).json({ message: "Webhook processed successfully" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
