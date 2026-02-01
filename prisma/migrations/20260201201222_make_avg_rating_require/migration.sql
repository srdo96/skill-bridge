/*
  Warnings:

  - Made the column `avg_rating` on table `tutor_profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tutor_profiles" ALTER COLUMN "avg_rating" SET NOT NULL,
ALTER COLUMN "avg_rating" SET DEFAULT 0.0;
