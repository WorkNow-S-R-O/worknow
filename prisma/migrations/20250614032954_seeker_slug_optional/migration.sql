/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Seeker` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Seeker" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Seeker_slug_key" ON "Seeker"("slug");
