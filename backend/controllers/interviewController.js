const interviewService = require("../services/interviewService");
const asyncHandler = require("../utils/asyncHandler");

const generateQuestions = asyncHandler(async (req, res) => {

    const {
        resumeId,
        role,
        level,
        type,
        questionCount
    } = req.body;

    if (
        !resumeId ||
        !role ||
        !level ||
        !type ||
        !questionCount
    ) {

        const error = new Error("All fields are required.");
        error.status = 400;
        throw error;

    }

    const interview = await interviewService.generateQuestions({
        resumeId,
        role,
        level,
        type,
        questionCount
    });

    res.status(201).json({
        success: true,
        message: "Interview created successfully.",
        interview
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

    if (!interviewId) {

        const error = new Error("Interview ID is required.");
        error.status = 400;
        throw error;

    }

    const feedback =
        await interviewService.generateInterviewFeedback(interviewId);

    res.status(200).json({
        success: true,
        feedback
    });

});

const getInterviewFeedback = asyncHandler(async (req, res) => {

    const { interviewId } = req.params;

    const feedback =
        await interviewService.getInterviewFeedback(interviewId);

    res.status(200).json({
        success: true,
        feedback
    });

});
const getLatestFeedback = asyncHandler(async (req, res) => {

    const result = await interviewService.getLatestFeedback(
        req.user.id
    );

    res.status(200).json({
        success: true,
        ...result
    });

});
const getInterviewHistory = asyncHandler(async (req, res) => {

    const interviews =
        await interviewService.getInterviewHistory(
            req.user.id
        );

    res.status(200).json({

        success: true,

        interviews

    });

});
module.exports = {

    generateQuestions,

    getInterviewQuestions,

    generateInterviewFeedback,

    getInterviewFeedback,

    getLatestFeedback,

    getInterviewHistory

};