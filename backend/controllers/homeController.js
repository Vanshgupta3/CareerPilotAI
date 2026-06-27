const home = (req, res) => {
    res.send("Welcome to AI Interview Platform 🚀");
};

const health = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running successfully!",
        version: "1.0.0"
    });
};

module.exports = {
    home,
    health
};