const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {

    const user = await authService.register(req.body);

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user
    });

});

const login = asyncHandler(async (req, res) => {

    const result = await authService.login(req.body);

    res.status(200).json({
        success: true,
        message: "Login successful",
        ...result
    });

});

const getProfile = asyncHandler(async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: req.user
    });

});

module.exports = {
    register,
    login,
    getProfile
};