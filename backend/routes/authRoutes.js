const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post(
    "/profile",
    authMiddleware,
    authController.getProfile
);

module.exports = router;