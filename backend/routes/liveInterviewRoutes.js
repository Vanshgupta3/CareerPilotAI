const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const liveInterviewController =
    require("../controllers/liveInterviewController");

router.post(
    "/start",
    authMiddleware,
    liveInterviewController.startLiveInterview
);

router.post(
    "/:interviewId/answer",
    authMiddleware,
    liveInterviewController.submitLiveAnswer
);
router.post(
    "/:interviewId/feedback",
    authMiddleware,
    liveInterviewController.generateLiveInterviewFeedback
);
module.exports = router;