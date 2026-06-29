const uploadResume = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Resume uploaded successfully.",
        file: req.file,
        user: req.user
    });

};

module.exports = {
    uploadResume
};