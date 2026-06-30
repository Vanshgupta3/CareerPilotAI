const prisma = require("../prisma/prismaClient");
const model = require("./geminiService");

const analyzeResume = async (resumeId) => {

    // Fetch Resume
    const resume = await prisma.resume.findUnique({
        where: {
            id: resumeId
        }
    });

    // Validation
    if (!resume) {
        throw new Error("Resume not found.");
    }

    // 👇 WRITE THE PROMPT HERE
    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

Example:

{
  "atsScore": 84,
  "summary": "...",
  "skills": [
      "Node.js",
      "Express",
      "Prisma"
  ],
  "strengths": "...",
  "weaknesses": "...",
  "suggestions": "...",
  "missingKeywords": [
      "Docker",
      "AWS"
  ],
  "grammarScore": 92,
  "formatScore": 88
}

Resume:

${resume.content}
`;
const result = await model.generateContent(prompt);

const response = result.response.text();
const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
    const analysis = JSON.parse(cleanedResponse);
    const resumeAnalysis = await prisma.resumeAnalysis.create({
    data: {
        atsScore: analysis.atsScore,
        summary: analysis.summary,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        skills: analysis.skills,
        missingKeywords: analysis.missingKeywords,
        grammarScore: analysis.grammarScore,
        formatScore: analysis.formatScore,
        resumeId: resume.id
    }
});
return resumeAnalysis;

};


module.exports = {
    analyzeResume
};