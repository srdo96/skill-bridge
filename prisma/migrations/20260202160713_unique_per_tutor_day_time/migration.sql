/*
  Warnings:

  - A unique constraint covering the columns `[tutor_profile_id,day_of_week,start_time,end_time]` on the table `availability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "availability_tutor_profile_id_day_of_week_start_time_end_ti_key" ON "availability"("tutor_profile_id", "day_of_week", "start_time", "end_time");
