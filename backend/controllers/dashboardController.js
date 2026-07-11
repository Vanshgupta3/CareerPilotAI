const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (req, res) => {

    const stats = await dashboardService.getDashboardStats(
        req.user.id
    );

    res.status(200).json({

        success: true,

        stats

    });

});
const getDashboardAnalytics = asyncHandler(async (req, res) => {

    const analytics =
        await dashboardService.getDashboardAnalytics(
            req.user.id
        );

    res.status(200).json({

        success: true,

        analytics

    });

});

module.exports = {

    getDashboardStats,
    getDashboardAnalytics

};