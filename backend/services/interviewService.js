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

Focus only on the candidate's:
- Skills
- Projects
- Technologies
- Experience

Return ONLY a numbered list.

Resume:

${resume.content}
`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    return response;

};


module.exports = {
    generateQuestions
};