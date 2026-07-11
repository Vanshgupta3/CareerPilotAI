const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middlewares/authMiddleware");

const reportController =
    require("../controllers/reportController");

router.get(
    "/interview/:interviewId",
    authMiddleware,
    reportController.downloadInterviewReport
);

module.exports = router;