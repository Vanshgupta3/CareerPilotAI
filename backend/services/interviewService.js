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

- 40% questions should be based on the candidate's resume.
- 60% should test general knowledge for the selected role.
- Questions should progress from easy to difficult.
- Do not ask duplicate questions.
- Return ONLY valid JSON.

Example:

{
    "questions": [
        {
            "question": "Explain Virtual DOM in React."
        },
        {
            "question": "What is JWT Authentication?"
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
    "summary": "Write a professional summary in 70-100 words."
}

Rules:
- All scores must be between 0 and 100.
- Evaluate technical knowledge.
- Evaluate communication quality.
- Evaluate confidence.
- Evaluate problem-solving ability.
- Base the evaluation only on the candidate's answers.
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
const getInterviewFeedback = async (interviewId) => {

    const feedback = await prisma.feedback.findUnique({

        where: {
            interviewId
        }

    });

    if (!feedback) {

        throw new Error("Feedback not found.");

    }

    return feedback;

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

module.exports = {
    generateQuestions,
    getInterviewQuestions,
    generateInterviewFeedback,
    getInterviewFeedback,
    getLatestFeedback
};