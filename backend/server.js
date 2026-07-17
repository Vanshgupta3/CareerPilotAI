require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const answerRoutes = require("./routes/answerRoutes");
const resumeAnalysisRoutes = require("./routes/resumeAnalysisROutes");
const dashboardRoutes =
    require("./routes/dashboardRoutes");
const liveInterviewRoutes =
    require("./routes/liveInterviewRoutes");

const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const path = require("path");
const uploadDirectory = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");
const reportRoutes =
    require("./routes/reportRoutes");

app.use(
    "/uploads",
    express.static(uploadDirectory)
);

app.use("/", homeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/resume-analysis", resumeAnalysisRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/live-interview", liveInterviewRoutes);
app.use("/api/report", reportRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
