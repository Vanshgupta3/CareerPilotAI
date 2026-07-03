const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const answerController = require("../controllers/answerController");

router.post(
    "/submit",
    authMiddleware,
    answerController.submitAnswers
);

module.exports = router;