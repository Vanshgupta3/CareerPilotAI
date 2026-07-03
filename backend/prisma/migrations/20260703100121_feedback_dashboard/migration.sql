/*
  Warnings:

  - Added the required column `communicationScore` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidenceScore` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemSolvingScore` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technicalScore` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "communicationScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "confidenceScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "problemSolvingScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "technicalScore" DOUBLE PRECISION NOT NULL;
