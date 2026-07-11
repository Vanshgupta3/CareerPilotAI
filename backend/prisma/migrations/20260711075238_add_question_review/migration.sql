-- CreateTable
CREATE TABLE "QuestionReview" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "questionMessageId" TEXT NOT NULL,
    "candidateAnswer" TEXT NOT NULL,
    "idealAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionReview_questionMessageId_key" ON "QuestionReview"("questionMessageId");

-- AddForeignKey
ALTER TABLE "QuestionReview" ADD CONSTRAINT "QuestionReview_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionReview" ADD CONSTRAINT "QuestionReview_questionMessageId_fkey" FOREIGN KEY ("questionMessageId") REFERENCES "InterviewMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
