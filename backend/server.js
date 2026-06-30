require("dotenv").config();

const express = require("express");

const userRoutes = require("./routes/userRoutes");
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes =require("./routes/interviewRoutes");
const answerRoutes = require("./routes/answerRoutes");
const errorMiddleware =require("./middlewares/errorMiddleware");
const resumeAnalysisRoutes =
require("./routes/resumeAnalysisRoutes");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/", homeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/answer", answerRoutes);
app.use(errorMiddleware);
app.use(
    "/api/resume-analysis",
    resumeAnalysisRoutes
);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});