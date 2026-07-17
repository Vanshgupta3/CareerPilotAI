const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

// Storage configuration
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);
    }

});

// File filter
const fileFilter = (req, file, cb) => {

    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed."), false);
    }

};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;
