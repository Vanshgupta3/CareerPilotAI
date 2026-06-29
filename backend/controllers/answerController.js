const answerService = require("../services/answerService");
const submitAnswer = async (req, res) => {

    try {

        const { questionId, answerText } = req.body;

        const answer = await answerService.submitAnswer(
            questionId,
            answerText
        );

        res.status(201).json({
            success: true,
            answer
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const evaluateAnswer = async (req, res) => {

    try {

        const { answerId } = req.body;

        const evaluation =
            await answerService.evaluateAnswer(answerId);

        res.status(200).json({
            success: true,
            evaluation
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
module.exports = {
    submitAnswer,
    evaluateAnswer
};