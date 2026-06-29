const prisma = require("../prisma/prismaClient");
const model = require("./geminiService");

const generateQuestions = async (resumeId) => {

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

Based on the following resume, generate exactly 10 technical interview questions.

Focus only on:
- Skills
- Projects
- Technologies
- Experience

Return ONLY valid JSON.

Example:

[
  {
    "question": "Explain JWT Authentication."
  },
  {
    "question": "Why did you choose Prisma?"
  }
]

Do not write markdown.
Do not write explanations.
Return ONLY the JSON array.

Resume:



${resume.content}
`;

    
    const result = await model.generateContent(prompt);

const response = result.response.text();

// Remove markdown if Gemini adds it
const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

// Convert JSON string to JavaScript array
const questions = JSON.parse(cleanedResponse);
const interview = await prisma.interview.create({
    data: {
        role: "Software Engineer",
        level: "Medium",
        userId: resume.userId,
        resumeId: resume.id
    }
    
});
for (const item of questions) {

    await prisma.question.create({
        data: {
            questionText: item.question,
            interviewId: interview.id
        }
    });

}

return interview;

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

-------------------------
`;

}
const prompt = `
You are a Senior Technical Interviewer.

Below is the complete interview performance of a candidate.

${interviewSummary}

Based on all the answers, provide:

1. Overall score (0-10)
2. Overall strengths
3. Overall weaknesses
4. Suggestions for improvement

Return ONLY valid JSON.

Example:

{
    "overallScore": 8,
    "strengths": "Strong backend development knowledge and good database understanding.",
    "weaknesses": "Needs improvement in system design and operating systems.",
    "suggestions": "Practice low-level design, concurrency and networking concepts."
}
`;
const result = await model.generateContent(prompt);

const response = result.response.text();

const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const feedback = JSON.parse(cleanedResponse);
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