const resumeAnalysisService = require("../services/resumeAnalysisService");
const asyncHandler = require("../utils/asyncHandler");

const uploadResume = asyncHandler(async (req, res) => {

    const result = await resumeAnalysisService.uploadResume(
        req.user.id,
        req.file
    );

    res.status(200).json({
        success: true,
        message: "Resume uploaded successfully.",
        resume: result
    });

});
const analyzeResume = asyncHandler(async (req, res) => {

    const analysis =
        await resumeAnalysisService.analyzeResume(
            req.user.id
        );

    res.status(200).json({

        success: true,

        message: "Resume analyzed successfully.",

        analysis

    });

});
const getLatestAnalysis = asyncHandler(async (req, res) => {

    const analysis =
        await resumeAnalysisService.getLatestAnalysis(
            req.user.id
        );

    res.status(200).json({

        success: true,

        analysis

    });

});
module.exports = {
    uploadResume,
    analyzeResume,
    getLatestAnalysis
};