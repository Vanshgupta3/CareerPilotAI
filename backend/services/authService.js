const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const prisma = require("../prisma/prismaClient");

const register = async (userData) => {

    const { name, email, password } = userData;

    // Validation
    if (!name || !email || !password) {
    const error = new Error("All fields are required.");
    error.status = 400;
    throw error;
}

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (existingUser) {
    const error = new Error("Email already registered.");
    error.status = 409;
    throw error;
}

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });
    const token = generateToken(user);

    // Return safe data
    return {

    token,

    user: {

        id: user.id,
        name: user.name,
        email: user.email

    }

};
};

const login = async (userData) => {

    const { email, password } = userData;

    if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.status = 400;
    throw error;
}

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
}
    const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
);

if (!isPasswordCorrect) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    throw error;
}
const token = generateToken(user);

return {
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email
    }
};

};
const getProfile = async (userId) => {

    const user = await prisma.user.findUnique({

        where: {
            id: userId
        },

        include: {

            resumes: {

                orderBy: {
                    uploadedAt: "desc"
                },

                take: 1,

                include: {
                    analysis: true
                }

            }

        }

    });

    if (!user) {

        const error = new Error("User not found.");
        error.status = 404;
        throw error;

    }

    const latestResume = user.resumes[0] || null;

    return {

        user: {

            id: user.id,
            name: user.name,
            email: user.email

        },

        resume: latestResume,

        analysis: latestResume?.analysis || null

    };

};

module.exports = {
    register,
    login,
    getProfile
};