const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const interviewController =
    require("../controllers/interviewController");
    console.log("authMiddleware:", typeof authMiddleware);



router.post(
    "/start",
    authMiddleware,
    interviewController.generateQuestions
);

router.get(
    "/:id/questions",
    authMiddleware,
    interviewController.getInterviewQuestions
);
router.get(
    "/history",
    authMiddleware,
    interviewController.getInterviewHistory
);
router.get(
    "/latest-feedback",
    authMiddleware,
    interviewController.getLatestFeedback
);
router.post(
    "/feedback",
    authMiddleware,
    interviewController.generateInterviewFeedback
);

router.get(
    "/feedback/:interviewId",
    authMiddleware,
    interviewController.getInterviewFeedback
);

module.exports = router;