const answerService = require("../services/answerService");
const asyncHandler = require("../utils/asyncHandler");

const submitAnswer = asyncHandler(async (req, res) => {

    const { questionId, answerText } = req.body;

    const answer = await answerService.submitAnswer(
        questionId,
        answerText
    );

    res.status(201).json({
        success: true,
        answer
    });

});

const evaluateAnswer = asyncHandler(async (req, res) => {

    const { answerId } = req.body;

    const evaluation =
        await answerService.evaluateAnswer(answerId);

    res.status(200).json({
        success: true,
        evaluation
    });

});

module.exports = {
    submitAnswer,
    evaluateAnswer
};