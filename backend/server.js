require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const answerRoutes = require("./routes/answerRoutes");
const resumeAnalysisRoutes = require("./routes/resumeAnalysisRoutes");
const dashboardRoutes =
    require("./routes/dashboardRoutes");
const liveInterviewRoutes =
    require("./routes/liveInterviewRoutes");

const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;
const path = require("path");

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
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

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});