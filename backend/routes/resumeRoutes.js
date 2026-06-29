const express = require("express");

const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const resumeController = require("../controllers/resumeController");

router.post(
    "/upload",
    authMiddleware,
    upload.single("resume"),
    resumeController.uploadResume
);

module.exports = router;
