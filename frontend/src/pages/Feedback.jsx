import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
    downloadInterviewReport,
    getInterviewFeedback
} from "../services/interviewService";

import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function Feedback() {

    const { interviewId } = useParams();

    const navigate = useNavigate();

    const { token } = useAuth();

    const [feedback, setFeedback] = useState(null);

    const [questionReviews, setQuestionReviews] = useState([]);

    const [loading, setLoading] = useState(true);

    const [isDownloadingReport, setIsDownloadingReport] =
        useState(false);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {

        try {

            const result = await getInterviewFeedback(
                interviewId,
                token
            );

            setFeedback(result.feedback);
            setQuestionReviews(result.questionReviews || []);

        } catch (error) {

            console.error(error);

            toast.error("Failed to load feedback.");

        } finally {

            setLoading(false);

        }

    };

    const handleDownloadReport = async () => {

        try {

            setIsDownloadingReport(true);

            const report = await downloadInterviewReport(
                interviewId,
                token
            );

            const url = window.URL.createObjectURL(report);
            const link = document.createElement("a");

            link.href = url;
            link.download = "CareerPilot_Interview_Report.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(error);
            toast.error("Failed to generate the interview report.");

        } finally {

            setIsDownloadingReport(false);

        }

    };

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <h1 className="text-white text-2xl">
                    Loading Feedback...
                </h1>
            </div>
        );

    }

    if (!feedback) {

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <h1 className="text-white text-2xl">
                    Feedback not found.
                </h1>
            </div>
        );

    }

    const getPerformance = (score) => {

        if (score >= 85)
            return {
                text: "Excellent",
                color: "text-green-400",
                bg: "bg-green-500/20"
            };

        if (score >= 70)
            return {
                text: "Good",
                color: "text-blue-400",
                bg: "bg-blue-500/20"
            };

        if (score >= 50)
            return {
                text: "Average",
                color: "text-yellow-400",
                bg: "bg-yellow-500/20"
            };

        return {
            text: "Needs Improvement",
            color: "text-red-400",
            bg: "bg-red-500/20"
        };

    };

    const performance = getPerformance(feedback.overallScore);

    return (

        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex justify-between items-center">

                    <div>

                        <h1 className="text-4xl font-bold text-white">
                            Interview Performance
                        </h1>

                        <p className="text-slate-400 mt-2">
                            AI Generated Interview Analysis
                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
                    >
                        Dashboard
                    </button>

                    <button
                        onClick={handleDownloadReport}
                        disabled={isDownloadingReport}
                        className="bg-slate-700 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60 text-white px-5 py-3 rounded-xl"
                    >
                        {isDownloadingReport
                            ? "Generating report..."
                            : "Download Report"}
                    </button>

                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-10">

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center">

                        <h2 className="text-2xl font-semibold text-white mb-6">
                            Overall Score
                        </h2>

                        <div className="w-52 h-52">

                            <CircularProgressbar
                                value={feedback.overallScore}
                                text={`${feedback.overallScore}%`}
                                styles={buildStyles({
                                    textColor: "#fff",
                                    pathColor: "#3b82f6",
                                    trailColor: "#1e293b"
                                })}
                            />

                        </div>

                        <div
                            className={`${performance.bg} mt-6 px-5 py-2 rounded-full`}
                        >
                            <span
                                className={`font-semibold ${performance.color}`}
                            >
                                {performance.text}
                            </span>
                        </div>

                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                        <h2 className="text-2xl font-semibold text-white mb-8">
                            Performance Analysis
                        </h2>

                        <SkillBar
                            title="Technical Knowledge"
                            value={feedback.technicalScore}
                        />

                        <SkillBar
                            title="Communication"
                            value={feedback.communicationScore}
                        />

                        <SkillBar
                            title="Confidence"
                            value={feedback.confidenceScore}
                        />

                        <SkillBar
                            title="Problem Solving"
                            value={feedback.problemSolvingScore}
                        />

                    </div>

                </div>

                {questionReviews.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-2xl font-semibold text-white">
                            Questions and Ideal Answers
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Compare each response with the key points a strong answer should include.
                        </p>

                        <div className="mt-6 space-y-6">
                            {questionReviews.map((review, index) => (
                                <div key={`${review.question}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <h3 className="text-lg font-semibold text-white">Question {index + 1}</h3>
                                        {review.score != null && <span className="rounded-full bg-blue-500/15 px-3 py-1 text-sm font-medium text-blue-300">Score: {review.score}{review.score <= 10 ? "/10" : "%"}</span>}
                                    </div>

                                    <p className="mt-3 leading-7 text-slate-200">{review.question}</p>
                                    <AnswerPanel title="Your answer" content={review.candidateAnswer} />
                                    <AnswerPanel title="Ideal answer" content={review.idealAnswer} accent />
                                    {review.strengths && <AnswerPanel title="What you did well" content={review.strengths} />}
                                    {review.improvements && <AnswerPanel title="What to improve" content={review.improvements} />}
                                    {review.explanation && <AnswerPanel title="AI feedback" content={review.explanation} />}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                                <div className="grid md:grid-cols-2 gap-8 mt-10">

                    <InfoCard
                        title="💪 Strengths"
                        content={feedback.strengths}
                    />

                    <InfoCard
                        title="📉 Areas to Improve"
                        content={feedback.weaknesses}
                    />

                    <InfoCard
                        title="💡 AI Suggestions"
                        content={feedback.suggestions}
                    />

                    <InfoCard
                        title="📝 Interview Summary"
                        content={feedback.summary}
                    />

                </div>

                <div className="flex justify-center gap-5 mt-12">

                    <button
                        onClick={() => navigate("/interview")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Take Another Interview
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Dashboard
                    </button>

                </div>

            </div>

        </div>

    );

}

function SkillBar({ title, value }) {

    return (

        <div className="mb-6">

            <div className="flex justify-between items-center mb-2">

                <span className="text-white font-medium">
                    {title}
                </span>

                <span className="text-blue-400 font-semibold">
                    {value}%
                </span>

            </div>

            <div className="w-full bg-slate-800 rounded-full h-3">

                <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-700"
                    style={{
                        width: `${value}%`
                    }}
                />

            </div>

        </div>

    );

}

function InfoCard({ title, content }) {

    const renderContent = () => {

        if (Array.isArray(content)) {

            return (

                <ul className="space-y-3">

                    {content.map((item, index) => (

                        <li
                            key={index}
                            className="text-slate-300 flex items-start gap-2"
                        >
                            <span className="text-blue-400 mt-1">•</span>

                            <span>{item}</span>

                        </li>

                    ))}

                </ul>

            );

        }

        return (

            <p className="text-slate-300 whitespace-pre-line leading-7">

                {content}

            </p>

        );

    };

    return (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition-all">

            <h2 className="text-2xl font-semibold text-white mb-5">

                {title}

            </h2>

            {renderContent()}

        </div>

    );

}

function AnswerPanel({ title, content, accent = false }) {
    return (
        <div className={`mt-5 rounded-xl border p-4 ${accent ? "border-green-500/30 bg-green-500/10" : "border-slate-800 bg-slate-950/50"}`}>
            <h4 className={`text-sm font-semibold ${accent ? "text-green-300" : "text-slate-300"}`}>{title}</h4>
            <p className="mt-2 whitespace-pre-line leading-7 text-slate-200">{content}</p>
        </div>
    );
}

export default Feedback;
