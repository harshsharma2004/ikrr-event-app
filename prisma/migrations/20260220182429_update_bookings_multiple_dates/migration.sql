/*
  Warnings:

  - You are about to drop the column `eventDate` on the `EventQuery` table. All the data in the column will be lost.
  - You are about to drop the column `eventTime` on the `EventQuery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventQuery" DROP COLUMN "eventDate",
DROP COLUMN "eventTime",
ADD COLUMN     "eventDates" TEXT[],
ADD COLUMN     "eventTimes" TEXT[];
