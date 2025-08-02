-- AlterTable
ALTER TABLE "NewsletterSubscriber" ADD COLUMN     "onlyDemanded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferredCategories" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preferredCities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preferredDocumentTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preferredEmployment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preferredGender" TEXT,
ADD COLUMN     "preferredLanguages" TEXT[] DEFAULT ARRAY[]::TEXT[];
