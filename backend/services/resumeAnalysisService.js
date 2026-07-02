const prisma = require("../prisma/prismaClient");
const model = require("./geminiService");
const path = require("path");
const fs = require("fs");
const resumeService = require("./resumeService");
const uploadResume = async (userId, file) => {

    if (!file) {

        throw new Error("Resume file is required.");

    }

    const existingResume = await prisma.resume.findFirst({

        where: {

            userId

        },

        include: {

            analysis: true

        }

    });

    if (existingResume) {

        // Delete old PDF
        if (fs.existsSync(existingResume.fileUrl)) {

            fs.unlinkSync(existingResume.fileUrl);

        }

        // Delete old analysis first
        if (existingResume.analysis) {

            await prisma.resumeAnalysis.delete({

                where: {

                    resumeId: existingResume.id

                }

            });

        }

        // Delete old resume
        await prisma.resume.delete({

            where: {

                id: existingResume.id

            }

        });

    }

    // Save new resume (extracts PDF text automatically)
    const resume = await resumeService.saveResume(

        file,
        userId

    );

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
if (!resume.content) {

    const error = new Error(
        "Resume content not found. Please upload the resume again."
    );

    error.status = 400;

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
const getLatestAnalysis = async (userId) => {

    const resume = await prisma.resume.findFirst({

        where: {

            userId

        },

        orderBy: {

            uploadedAt: "desc"

        },

        include: {

            analysis: true

        }

    });

    if (!resume) {

        const error = new Error("Resume not found.");
        error.status = 404;
        throw error;

    }

    if (!resume.analysis) {

        const error = new Error("Resume has not been analyzed yet.");
        error.status = 404;
        throw error;

    }

    return resume.analysis;

};


module.exports = {
    uploadResume,
    analyzeResume,
    getLatestAnalysis
};