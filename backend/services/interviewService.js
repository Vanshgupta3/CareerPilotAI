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

return questions;

};


module.exports = {
    generateQuestions
};