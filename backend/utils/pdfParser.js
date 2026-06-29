// const fs = require("fs");
// const pdfParse = require("pdf-parse");

// const extractTextFromPDF = async (filePath) => {

//     const buffer = fs.readFileSync(filePath);

//     const data = await pdfParse(buffer);

//     return data.text;

// };

// module.exports = {
//     extractTextFromPDF
// };

const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {

    console.log("Reading:", filePath);

    const buffer = fs.readFileSync(filePath);

    console.log("Buffer loaded");

    const data = await pdfParse(buffer);

    console.log("PDF parsed");

    return data.text;
};

module.exports = {
    extractTextFromPDF
};