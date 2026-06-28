const signup = (req, res) => {

    const { name, email, password } = req.body;

    // Validation
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required"
        });
    }

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);

    res.status(201).json({
        success: true,
        message: "User registered successfully!",
        user: {
            name,
            email
        }
    });

};

module.exports = {
    signup
};