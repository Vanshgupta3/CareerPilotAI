/*
  Warnings:

  - Added the required column `missingKeywords` to the `ResumeAnalysis` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `skills` on the `ResumeAnalysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ResumeAnalysis" ADD COLUMN     "formatScore" DOUBLE PRECISION,
ADD COLUMN     "grammarScore" DOUBLE PRECISION,
ADD COLUMN     "missingKeywords" JSONB NOT NULL,
DROP COLUMN "skills",
ADD COLUMN     "skills" JSONB NOT NULL;
