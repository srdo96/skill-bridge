/*
  Warnings:

  - You are about to drop the column `dsc` on the `subjects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "dsc",
ADD COLUMN     "desc" TEXT;
