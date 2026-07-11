const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const dashboardController =
    require("../controllers/dashboardController");

router.get(
    "/stats",
    authMiddleware,
    dashboardController.getDashboardStats
);
router.get(
    "/analytics",
    authMiddleware,
    dashboardController.getDashboardAnalytics
);
module.exports = router;