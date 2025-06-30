-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "month" TEXT,
    "amount" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
