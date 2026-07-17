const prisma = require("../prisma/prismaClient");
const model = require("./geminiService");

const generateQuestions = async ({
    resumeId,
    role,
    level,
    type,
    questionCount
}) => {

    // Get Resume
    const resume = await prisma.resume.findUnique({
        where: {
            id: resumeId
        }
    });

    if (!resume) {
        throw new Error("Resume not found.");
    }

    const prompt = `
You are a Senior Technical Interviewer.

Generate exactly ${questionCount} interview questions.

Role:
${role}

Experience Level:
${level}

Interview Type:
${type}

Candidate Resume:

${resume.content}

Instructions:
- Also ask different question from same resume if uploaded again
- 40% questions should be based on the candidate's resume.
- 60% should test general knowledge for the selected role.
- Questions should progress from easy to difficult.
- Do not ask duplicate questions.
- For every question, include an accurate, concise idealAnswer (maximum 150 words) covering the key points a strong candidate should mention.
- Return ONLY valid JSON.

Example:

{
    "questions": [
        {
            "question": "Explain Virtual DOM in React.",
            "idealAnswer": "An accurate concise model answer for this question."
        },
        {
            "question": "What is JWT Authentication?",
            "idealAnswer": "An accurate concise model answer for this question."
        }
    ]
}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    const cleanedResponse = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let parsedQuestions;

    try {
        parsedQuestions = JSON.parse(cleanedResponse);
    } catch (error) {
        throw new Error("Invalid response received from Gemini.");
    }

    const interview = await prisma.interview.create({
        data: {
            role,
            level,
            type,
            userId: resume.userId,
            resumeId: resume.id
        }
    });

    await prisma.question.createMany({
        data: parsedQuestions.questions.map((item) => ({
            questionText: item.question,
            idealAnswer: item.idealAnswer || null,
            interviewId: interview.id
        }))
    });

    return {
        interviewId: interview.id,
        totalQuestions: parsedQuestions.questions.length
    };
};

const getInterviewQuestions = async (interviewId) => {

    const interview = await prisma.interview.findUnique({
        where: {
            id: interviewId
        },
        include: {
            questions: true
        }
    });

    if (!interview) {
        throw new Error("Interview not found.");
    }

    return interview.questions;
};

const generateInterviewFeedback = async (interviewId) => {

    const interview = await prisma.interview.findUnique({
        where: {
            id: interviewId
        },
        include: {
            questions: {
                include: {
                    answers: true
                }
            }
        }
    });

    if (!interview) {
        throw new Error("Interview not found.");
    }

    let interviewSummary = "";

    for (const question of interview.questions) {
        interviewSummary += `
Question ID:
${question.id}

Question:
${question.questionText}

Answer:
${question.answers[0]?.answerText || "No answer submitted."}

Score:
${question.answers[0]?.score ?? 0}

---------------------------------------
`;
    }

    const prompt = `
You are a Senior Technical Interviewer.

Below is the complete interview transcript.

${interviewSummary}

Evaluate the candidate professionally.

Return ONLY valid JSON.

{
    "overallScore": 82,
    "technicalScore": 84,
    "communicationScore": 76,
    "confidenceScore": 81,
    "problemSolvingScore": 79,
    "strengths": "Mention all strengths. Make it like real interview",
    "weaknesses": "Mention all weaknesses.",
    "suggestions": "Give practical suggestions for improvement.",
    "summary": "Write a professional summary in 70-100 words.",
    "questionEvaluations": [
        {
            "questionId": "Question ID from the transcript",
            "score": 78,
            "strengths": "What the candidate answered well for this question.",
            "improvements": "What was missing, inaccurate, or should be improved."
        }
    ]
}

Rules:
- All scores must be between 0 and 100.
- Evaluate technical knowledge.
- Evaluate communication quality.
- Evaluate confidence.
- Evaluate problem-solving ability.
- Base the evaluation only on the candidate's answers.
- Provide one questionEvaluations entry for every answered question. Scores must be 0-100.
- Keep strengths and improvements concise, specific, and actionable.
- Return ONLY valid JSON.
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    const cleanedResponse = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let feedback;

    try {
        feedback = JSON.parse(cleanedResponse);
    } catch (error) {
        throw new Error("Invalid feedback received from Gemini.");
    }

    const evaluationsByQuestionId = new Map(
        (Array.isArray(feedback.questionEvaluations) ? feedback.questionEvaluations : [])
            .filter((evaluation) => evaluation?.questionId)
            .map((evaluation) => [evaluation.questionId, evaluation])
    );

    await prisma.$transaction(
        interview.questions.flatMap((question) => {
            const answer = question.answers[0];
            const evaluation = evaluationsByQuestionId.get(question.id);
            if (!answer || !evaluation) return [];

            const score = Number(evaluation.score);
            return prisma.answer.update({
                where: { id: answer.id },
                data: {
                    score: Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0,
                    strengths: String(evaluation.strengths || "No specific strengths recorded."),
                    improvements: String(evaluation.improvements || "No specific improvements recorded.")
                }
            });
        })
    );

    await prisma.feedback.create({
        data: {
            overallScore: feedback.overallScore,
            technicalScore: feedback.technicalScore,
            communicationScore: feedback.communicationScore,
            confidenceScore: feedback.confidenceScore,
            problemSolvingScore: feedback.problemSolvingScore,
            strengths: feedback.strengths,
            weaknesses: feedback.weaknesses,
            suggestions: feedback.suggestions,
            summary: feedback.summary,
            interviewId: interview.id
        }
    });

    return feedback;
};
const getInterviewFeedback = async (interviewId, userId) => {

    const interview = await prisma.interview.findFirst({
        where: { id: interviewId, userId },
        include: {
            feedback: true,
            questions: { include: { answers: true } },
            reviews: {
                include: { questionMessage: true },
                orderBy: { createdAt: "asc" }
            }
        }
    });

    if (!interview || !interview.feedback) {

        throw new Error("Feedback not found.");

    }

    const questionReviews = interview.mode === "LIVE"
        ? interview.reviews.map((review) => ({
            question: review.questionMessage.content,
            candidateAnswer: review.candidateAnswer,
            idealAnswer: review.idealAnswer,
            explanation: review.explanation,
            score: review.score
        }))
        : interview.questions.map((question) => ({
            question: question.questionText,
            candidateAnswer: question.answers[0]?.answerText || "No answer submitted.",
            idealAnswer: question.idealAnswer || "An ideal answer was not saved for this earlier interview.",
            score: question.answers[0]?.score ?? null,
            strengths: question.answers[0]?.strengths,
            improvements: question.answers[0]?.improvements
        }));

    return { feedback: interview.feedback, questionReviews };

};
const getLatestFeedback = async (userId) => {

    const interview = await prisma.interview.findFirst({

        where: {
            userId
        },

        include: {
            feedback: true
        },

        orderBy: {
            createdAt: "desc"
        }

    });

    if (!interview || !interview.feedback) {

        throw new Error("No interview feedback found.");

    }

    return {
        interviewId: interview.id,
        feedback: interview.feedback
    };

};
const getInterviewHistory = async (userId) => {

    const interviews = await prisma.interview.findMany({

        where: {
            userId
        },

        include: {

            feedback: {

                select: {
                    overallScore: true
                }

            }

        },

        orderBy: {
            createdAt: "desc"
        }

    });

    return interviews;

};

module.exports = {

    generateQuestions,

    getInterviewQuestions,

    generateInterviewFeedback,

    getInterviewFeedback,

    getLatestFeedback,

    getInterviewHistory

};
