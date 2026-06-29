const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const interviewController =
require("../controllers/interviewController");

router.post(
    "/generate",
    authMiddleware,
    interviewController.generateQuestions
);

module.exports = router;