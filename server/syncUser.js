import { Clerk } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const clerk = new Clerk({
  apiKey: import.meta.env.VITE_SECRET_API_KEY,
});

// Синхронизация одного пользователя
export async function syncUser(userId) {
  try {
    const user = await clerk.users.getUser(userId);

    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      throw new Error("User data is invalid or missing email");
    }

    const primaryEmail = user.emailAddresses[0]?.emailAddress;

    const dbUser = await prisma.user.upsert({
      where: { email: primaryEmail },
      update: {
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      },
      create: {
        id: user.id,
        email: primaryEmail,
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

// Синхронизация всех пользователей
export async function syncAllUsers() {
  try {
    console.log("Fetching users from Clerk...");
    const users = await clerk.users.getAllUsers();

    if (!users || users.length === 0) {
      console.log("No users found in Clerk.");
      return;
    }

    console.log(
      `Found ${users.length} users in Clerk. Starting synchronization...`
    );

    for (const user of users) {
      try {
        if (!user.emailAddresses || user.emailAddresses.length === 0) {
          console.warn(`Skipping user with ID ${user.id}: no email`);
          continue;
        }

        const primaryEmail = user.emailAddresses[0]?.emailAddress;

        await prisma.user.upsert({
          where: { email: primaryEmail },
          update: {
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          },
          create: {
            id: user.id,
            email: primaryEmail,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          },
        });

        console.log(`User synchronized: ${primaryEmail}`);
      } catch (error) {
        console.error(`Error syncing user with ID ${user.id}:`, error);
      }
    }

    console.log("All users synchronized successfully.");
  } catch (error) {
    console.error("Error syncing all users:", error);
    throw error;
  }
}
