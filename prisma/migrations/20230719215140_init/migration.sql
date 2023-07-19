-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WORKER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('RSD', 'EUR', 'USD', 'CHF');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'IN_PROGRESS', 'DONE', 'ABORTED');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('WHOLE', 'PER_HOUR', 'PER_M2', 'PER_DAY');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('ELECTRICS', 'PLUMBING', 'PAINTING', 'GARDENING', 'CLEANING');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'WORKER',
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentlyWorkingOnJobId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "JobType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceType" "PriceType" NOT NULL DEFAULT 'WHOLE',
    "currency" "Currency" NOT NULL DEFAULT 'RSD',
    "amount" DOUBLE PRECISION NOT NULL,
    "location" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'ACTIVE',
    "withoutMonitoring" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "userThatDidTheJobId" INTEGER,
    "hasAcceptedOffer" BOOLEAN DEFAULT false,
    "acceptedOfferId" INTEGER,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobOffer" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priceType" "PriceType" NOT NULL DEFAULT 'WHOLE',
    "currency" "Currency" NOT NULL DEFAULT 'RSD',
    "userId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "JobOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_currentlyWorkingOnJobId_key" ON "users"("currentlyWorkingOnJobId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_currentlyWorkingOnJobId_fkey" FOREIGN KEY ("currentlyWorkingOnJobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_userThatDidTheJobId_fkey" FOREIGN KEY ("userThatDidTheJobId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOffer" ADD CONSTRAINT "JobOffer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobOffer" ADD CONSTRAINT "JobOffer_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
