/*
  Warnings:

  - The `areaOfWork` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "areaOfWork",
ADD COLUMN     "areaOfWork" JSONB[] DEFAULT ARRAY[]::JSONB[];
