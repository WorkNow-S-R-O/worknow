CREATE TABLE "Seeker" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "contact" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
); 