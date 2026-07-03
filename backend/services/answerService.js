// const model = require("./geminiService");
// const prisma = require("../prisma/prismaClient");

// const submitAnswer = async (questionId, answerText) => {

//     if (!questionId || !answerText) {
//         throw new Error("Question ID and answer are required.");
//     }

//     const question = await prisma.question.findUnique({
//         where: {
//             id: questionId
//         }
//     });

//     if (!question) {
//         throw new Error("Question not found.");
//     }
//     const answer = await prisma.answer.create({
//     data: {
//         answerText,
//         questionId
//     }
// });
// return answer;

// };
// const evaluateAnswer = async (answerId) => {
//     const answer = await prisma.answer.findUnique({
//     where: {
//         id: answerId
//     },
//     include: {
//         question: true
//     }
// });
// if (!answer) {
//     throw new Error("Answer not found.");
// }
// const prompt = `
// You are a Senior Technical Interviewer.

// Question:
// ${answer.question.questionText}

// Candidate Answer:
// ${answer.answerText}

// Evaluate the answer.

// Give scores based on:

// - Accuracy
// - Completeness
// - Technical Depth

// Return ONLY valid JSON.

// Example:

// {
//     "score": 8,
//     "strengths": "Good explanation of JWT authentication.",
//     "weaknesses": "Did not mention token expiration.",
//     "suggestions": "Explain JWT structure and refresh tokens."
// }
// `;
// const result = await model.generateContent(prompt);

// const response = result.response.text();

// const cleanedResponse = response
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

// const evaluation = JSON.parse(cleanedResponse);
// await prisma.answer.update({
//     where: {
//         id: answerId
//     },
//     data: {
//         score: evaluation.score
//     }
// });
// return evaluation;
// };
// module.exports = {
//     submitAnswer,
//     evaluateAnswer
// };
const prisma = require("../prisma/prismaClient");

const submitAnswers = async (answers) => {

    if (!answers || answers.length === 0) {

        throw new Error("Answers are required.");

    }

    const formattedAnswers = answers.map((answer) => ({

        questionId: answer.questionId,
        answerText: answer.answerText

    }));

    await prisma.answer.createMany({

        data: formattedAnswers

    });

    return {

        success: true,
        message: "Answers submitted successfully."

    };

};

module.exports = {
    submitAnswers
};