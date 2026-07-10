-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "currentDifficulty" TEXT,
ADD COLUMN     "currentTopic" TEXT,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'CREATED';

-- CreateTable
CREATE TABLE "InterviewMessage" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'MESSAGE',
    "topic" TEXT,
    "difficulty" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "InterviewMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewMessage" ADD CONSTRAINT "InterviewMessage_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
