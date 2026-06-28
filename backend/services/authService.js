const bcrypt = require("bcrypt");
const prisma = require("../prisma/prismaClient");

const register = async (userData) => {

    const { name, email, password } = userData;

    // Validation
    if (!name || !email || !password) {
        throw new Error("All fields are required.");
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (existingUser) {
        throw new Error("Email already registered.");
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

    // Return safe data
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    };
};

module.exports = {
    register
};