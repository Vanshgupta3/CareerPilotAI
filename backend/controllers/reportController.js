const reportService =
    require("../services/reportService");

const asyncHandler =
    require("../utils/asyncHandler");

const downloadInterviewReport =
    asyncHandler(async (req, res) => {

        const { interviewId } = req.params;

        await reportService.downloadInterviewReport({

            interviewId,

            userId: req.user.id,

            res

        });

    });

module.exports = {

    downloadInterviewReport

};