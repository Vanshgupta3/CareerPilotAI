const interviewService = require("../services/interviewService");
const asyncHandler = require("../utils/asyncHandler");

const generateQuestions = asyncHandler(async (req, res) => {

    const { resumeId } = req.body;

    if (!resumeId) {
        const error = new Error("Resume ID is required.");
        error.status = 400;
        throw error;
    }

    const questions =
        await interviewService.generateQuestions(resumeId);

    res.status(200).json({
        success: true,
        questions
    });

});

const getInterviewQuestions = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const questions =
        await interviewService.getInterviewQuestions(id);

    res.status(200).json({
        success: true,
        questions
    });

});

const generateInterviewFeedback = asyncHandler(async (req, res) => {

    const { interviewId } = req.body;

    const feedback =
        await interviewService.generateInterviewFeedback(interviewId);

    res.status(200).json({
        success: true,
        feedback
    });

});

module.exports = {
    generateQuestions,
    getInterviewQuestions,
    generateInterviewFeedback
};