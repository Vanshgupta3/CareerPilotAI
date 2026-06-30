const resumeService = require("../services/resumeService");
const asyncHandler = require("../utils/asyncHandler");

const uploadResume = asyncHandler(async (req, res) => {

    const resume = await resumeService.saveResume(
        req.file,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Resume uploaded successfully.",
        resume
    });

});

module.exports = {
    uploadResume
};