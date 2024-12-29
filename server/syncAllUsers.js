import { syncAllUsers } from "./syncUser.js";

(async () => {
  try {
    console.log("Starting synchronization...");
    await syncAllUsers();
    console.log("Synchronization completed.");
  } catch (error) {
    console.error("Synchronization failed:", error);
  }
})();
