import { Clerk } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const clerk = new Clerk({
  apiKey: import.meta.env.VITE_CLERK_API_KEY,
});

export async function syncUser(userId) {
  try {
    const user = await clerk.users.getUser(userId);

    // Проверяем наличие необходимых данных
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      throw new Error("User data is invalid or missing email");
    }

    // Синхронизация с базой данных
    const dbUser = await prisma.user.upsert({
      where: { email: user.emailAddresses[0].emailAddress },
      update: {
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      },
      create: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      },
    });

    console.log(`User synchronized: ${dbUser.email}`);
    return dbUser;
  } catch (error) {
    console.error(`Error syncing user with ID ${userId}:`, error);
    throw error;
  }
}
