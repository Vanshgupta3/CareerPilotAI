const interviewService = require("../services/interviewService");

const generateQuestions = async (req, res) => {

    try {

        const { resumeId } = req.body;

        if (!resumeId) {
            return res.status(400).json({
                success: false,
                message: "Resume ID is required."
            });
        }

        const questions =
            await interviewService.generateQuestions(resumeId);

        res.status(200).json({
            success: true,
            questions
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    generateQuestions
};