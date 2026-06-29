const resumeService = require("../services/resumeService");

const uploadResume = async (req, res) => {

    try {

        const resume = await resumeService.saveResume(
            req.file,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: "Resume uploaded successfully.",
            resume
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    uploadResume
};