/*
  Warnings:

  - Added the required column `day_of_week` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "day_of_week" "Days" NOT NULL;
