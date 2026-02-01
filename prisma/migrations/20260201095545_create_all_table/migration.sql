/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('STUDENT', 'TUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BAN');

-- CreateEnum
CREATE TYPE "Days" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_category_id_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "blogs";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRoles" DEFAULT 'STUDENT',
    "phone" TEXT,
    "status" "UserStatus" DEFAULT 'ACTIVE',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability" (
    "availability_id" TEXT NOT NULL,
    "tutor_profile_id" TEXT NOT NULL,
    "day_of_week" "Days" NOT NULL,
    "start_time" TIME(0) NOT NULL,
    "end_time" TIME(0) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_pkey" PRIMARY KEY ("availability_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "tutor_profile_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "price" DECIMAL(7,2) NOT NULL,
    "meeting_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" TEXT NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "desc" VARCHAR(250),
    "img_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "subject_id" TEXT NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "dsc" TEXT NOT NULL,
    "img_url" TEXT,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "Review" (
    "review_id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "tutor_profile_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "tutor_profiles" (
    "tutor_profile_id" TEXT NOT NULL,
    "hourly_rate" DECIMAL(10,2) NOT NULL,
    "year_of_experience" INTEGER NOT NULL DEFAULT 0,
    "avg_rating" DECIMAL(2,1) NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutor_profiles_pkey" PRIMARY KEY ("tutor_profile_id")
);

-- CreateTable
CREATE TABLE "tutor_subjects" (
    "tutor_profile_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,

    CONSTRAINT "tutor_subjects_pkey" PRIMARY KEY ("tutor_profile_id","subject_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Review_booking_id_key" ON "Review"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_profiles_tutor_id_key" ON "tutor_profiles"("tutor_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability" ADD CONSTRAINT "availability_tutor_profile_id_fkey" FOREIGN KEY ("tutor_profile_id") REFERENCES "tutor_profiles"("tutor_profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tutor_profile_id_fkey" FOREIGN KEY ("tutor_profile_id") REFERENCES "tutor_profiles"("tutor_profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_tutor_profile_id_fkey" FOREIGN KEY ("tutor_profile_id") REFERENCES "tutor_profiles"("tutor_profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_profiles" ADD CONSTRAINT "tutor_profiles_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_subjects" ADD CONSTRAINT "tutor_subjects_tutor_profile_id_fkey" FOREIGN KEY ("tutor_profile_id") REFERENCES "tutor_profiles"("tutor_profile_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_subjects" ADD CONSTRAINT "tutor_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("subject_id") ON DELETE CASCADE ON UPDATE CASCADE;
