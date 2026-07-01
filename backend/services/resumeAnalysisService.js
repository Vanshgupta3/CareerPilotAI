const prisma = require("../prisma/prismaClient");
const model = require("./geminiService");
const path = require("path");
const fs = require("fs");
const uploadResume = async (userId, file) => {

    if (!file) {

        throw new Error("Resume file is required.");

    }

    const existingResume = await prisma.resume.findFirst({

        where: {

            userId

        }

    });

    if (existingResume) {

    if (fs.existsSync(existingResume.fileUrl)) {

        fs.unlinkSync(existingResume.fileUrl);

    }

    await prisma.resume.delete({

        where: {

            id: existingResume.id

        }

    });

}

    const resume = await prisma.resume.create({

        data: {

            title: file.originalname,

            fileUrl: file.path,

            userId

        }

    });

    return resume;

};
const analyzeResume = async (userId) => {

    // Fetch Resume
    const resume = await prisma.resume.findFirst({

    where: {

        userId

    },

    orderBy: {

        uploadedAt: "desc"

    }

});

    // Validation
    if (!resume) {

    const error = new Error("No resume found.");

    error.status = 404;

    throw error;

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
    const resumeAnalysis = await prisma.resumeAnalysis.upsert({

    where: {

        resumeId: resume.id

    },

    update: {

        atsScore: analysis.atsScore,
        summary: analysis.summary,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions,
        skills: analysis.skills,
        missingKeywords: analysis.missingKeywords,
        grammarScore: analysis.grammarScore,
        formatScore: analysis.formatScore

    },

    create: {

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

    uploadResume,

    analyzeResume

};