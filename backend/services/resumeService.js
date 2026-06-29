const prisma = require("../prisma/prismaClient");
const { extractTextFromPDF } = require("../utils/pdfParser");


const saveResume = async (file, userId) => {

    // console.log("Step 1");

    const extractedText = await extractTextFromPDF(file.path);

    // console.log("Step 2");

    const resume = await prisma.resume.create({
        data: {
            title: file.originalname,
            fileUrl: file.path,
            content: extractedText,
            userId: userId
        }
    });

    // console.log("Step 3");

    return resume;
};




module.exports = {
    saveResume
};