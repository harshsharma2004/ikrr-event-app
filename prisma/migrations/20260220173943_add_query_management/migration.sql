/*
  Warnings:

  - You are about to drop the column `tag` on the `GalleryImage` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `GalleryImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GalleryImage" DROP COLUMN "tag",
ADD COLUMN     "eventId" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SimpleQuery" ALTER COLUMN "updatedAt" DROP DEFAULT;
