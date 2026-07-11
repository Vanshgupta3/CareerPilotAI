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

// Generate and save reviews
router.post(
    "/:interviewId/review",
    authMiddleware,
    liveInterviewController.generateQuestionReviews
);
router.get(
    "/history",
    authMiddleware,
    liveInterviewController.getLiveInterviewHistory
);
// Read saved reviews
router.get(
    "/:interviewId/review",
    authMiddleware,
    liveInterviewController.getQuestionReviews
);
router.get(
    "/:interviewId",
    authMiddleware,
    liveInterviewController.getLiveInterviewById
);
module.exports = router;