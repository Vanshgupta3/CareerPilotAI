const express = require("express");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

const authMiddleware =
require("../middlewares/authMiddleware");

const resumeAnalysisController =
require("../controllers/resumeAnalysisController");
router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    resumeAnalysisController.uploadResume
);
router.post(
    "/analyze",
    authMiddleware,
    resumeAnalysisController.analyzeResume
);
router.get(
    "/latest",
    authMiddleware,
    resumeAnalysisController.getLatestAnalysis
);

module.exports = router;