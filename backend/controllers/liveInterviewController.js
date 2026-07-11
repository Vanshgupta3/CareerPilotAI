const liveInterviewService = require("../services/liveInterviewService");
const asyncHandler = require("../utils/asyncHandler");

const startLiveInterview = asyncHandler(async (req, res) => {

    const {
        resumeId,
        role,
        level,
        type
    } = req.body;

    if (
        !resumeId ||
        !role ||
        !level ||
        !type
    ) {

        const error = new Error("All fields are required.");
        error.status = 400;
        throw error;

    }

   const interview =
    await liveInterviewService.startLiveInterview({
        resumeId,
        role,
        level,
        type,
        userId: req.user.id
    });

    res.status(201).json({
        success: true,
        message: "Live interview started successfully.",
        interview
    });

});

const submitLiveAnswer = asyncHandler(async (req, res) => {

    const { interviewId } = req.params;
    const { answer } = req.body;

    if (
        !answer ||
        typeof answer !== "string" ||
        !answer.trim()
    ) {
        const error = new Error("Answer is required.");
        error.status = 400;
        throw error;
    }

    const result =
        await liveInterviewService.submitLiveAnswer({
            interviewId,
            answer: answer.trim(),
            userId: req.user.id
        });

    res.status(200).json({
        success: true,
        message: "Answer submitted successfully.",
        interview: result
    });

});
const generateQuestionReviews = asyncHandler(async (req, res) => {

    const { interviewId } = req.params;

    const reviews =
        await liveInterviewService.generateQuestionReviews({

            interviewId,

            userId: req.user.id

        });

    res.status(200).json({

        success: true,

        reviews

    });

});
const getQuestionReviews = asyncHandler(async (req, res) => {

    const { interviewId } = req.params;

    const reviews =
        await liveInterviewService.getQuestionReviews({

            interviewId,

            userId: req.user.id

        });

    res.status(200).json({

        success: true,

        reviews

    });

});
const generateLiveInterviewFeedback = asyncHandler(async (req, res) => {

    const { interviewId } = req.params;

    const result =
    await liveInterviewService.generateLiveInterviewFeedback({
        interviewId,
        userId: req.user.id
    });

res.status(200).json({
    success: true,
    message: "Live interview feedback generated successfully.",
    feedback: result.feedback,
    reviews: result.reviews
});

});
const getLiveInterviewHistory = asyncHandler(async (req, res) => {

    const interviews =
        await liveInterviewService.getLiveInterviewHistory(
            req.user.id
        );

    res.status(200).json({

        success: true,

        interviews

    });

});
const getLiveInterviewById = asyncHandler(async (req, res) => {

    const { interviewId } = req.params;

    const interview =
        await liveInterviewService.getLiveInterviewById({

            interviewId,

            userId: req.user.id

        });

    res.status(200).json({

        success: true,

        interview

    });

});
module.exports = {
    startLiveInterview,
    submitLiveAnswer,
    generateLiveInterviewFeedback,
    generateQuestionReviews,
    getQuestionReviews,
    getLiveInterviewHistory,
    getLiveInterviewById
};