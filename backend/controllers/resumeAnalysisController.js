const resumeAnalysisService = require("../services/resumeAnalysisService");
const asyncHandler = require("../utils/asyncHandler");

const analyzeResume = asyncHandler(async (req, res) => {

    const { resumeId } = req.body;

    if (!resumeId) {
        const error = new Error("Resume ID is required.");
        error.status = 400;
        throw error;
    }

    const analysis =
        await resumeAnalysisService.analyzeResume(resumeId);

    res.status(200).json({
        success: true,
        analysis
    });

});

module.exports = {
    analyzeResume
};