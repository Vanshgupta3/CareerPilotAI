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

Below is a candidate's complete interview.

${interviewSummary}

Evaluate the interview and return ONLY valid JSON.

Example:

{
    "overallScore": 8,
    "strengths": "Strong backend development knowledge and database concepts.",
    "weaknesses": "Needs improvement in system design and operating systems.",
    "suggestions": "Practice networking, OS and low-level design."
}
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
            strengths: feedback.strengths,
            weaknesses: feedback.weaknesses,
            suggestions: feedback.suggestions,
            interviewId: interview.id

        }

    });

    return feedback;

};

module.exports = {
    generateQuestions,
    getInterviewQuestions,
    generateInterviewFeedback
};