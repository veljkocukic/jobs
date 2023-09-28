/*
  Warnings:

  - You are about to drop the column `priceType` on the `JobOffer` table. All the data in the column will be lost.
  - You are about to drop the column `priceType` on the `jobs` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "price_type" AS ENUM ('WHOLE', 'PER_HOUR', 'PER_M2', 'PER_DAY');

-- AlterTable
ALTER TABLE "JobOffer" DROP COLUMN "priceType",
ADD COLUMN     "price_type" "price_type" NOT NULL DEFAULT 'WHOLE';

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "priceType",
ADD COLUMN     "price_type" "price_type" NOT NULL DEFAULT 'WHOLE';

-- DropEnum
DROP TYPE "PriceType";
