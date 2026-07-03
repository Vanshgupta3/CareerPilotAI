const answerService = require("../services/answerService");
const asyncHandler = require("../utils/asyncHandler");

const submitAnswers = asyncHandler(async (req, res) => {

    const { answers } = req.body;

    if (!answers || answers.length === 0) {

        const error = new Error("Answers are required.");
        error.status = 400;
        throw error;

    }

    const result = await answerService.submitAnswers(answers);

    res.status(201).json({

        success: true,
        message: result.message

    });

});

module.exports = {
    submitAnswers
};