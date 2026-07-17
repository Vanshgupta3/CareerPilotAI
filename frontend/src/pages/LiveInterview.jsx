import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import {
    generateLiveFeedback,
    getLiveInterview,
    submitLiveAnswer
} from "../services/liveInterviewService";

function LiveInterview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [interview, setInterview] = useState(null);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [generatingFeedback, setGeneratingFeedback] = useState(false);
    const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechRecognition();

    const questionCount = useMemo(
        () => interview?.messages?.filter(
            (message) => message.role === "AI" && message.messageType === "QUESTION"
        ).length || 0,
        [interview]
    );

    const currentQuestion = useMemo(
        () => [...(interview?.messages || [])].reverse().find(
            (message) => message.role === "AI" && message.messageType === "QUESTION"
        ),
        [interview]
    );

    const loadInterview = async () => {
        try {
            const result = await getLiveInterview(id, token);
            setInterview(result.interview);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to load live interview.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInterview();
    }, [id, token]);

    useEffect(() => {
        if (transcript) setAnswer(transcript);
    }, [transcript]);

    const handleSubmitAnswer = async () => {
        const value = answer.trim();
        if (!value) {
            toast.error("Please provide an answer before continuing.");
            return;
        }

        stopListening();
        setSubmitting(true);
        try {
            const result = await submitLiveAnswer(id, value, token);
            setAnswer("");
            resetTranscript();

            if (result.interview.action === "END_INTERVIEW") {
                setInterview((current) => ({ ...current, status: "COMPLETED" }));
                toast.success("Interview completed. Generate your feedback next.");
                return;
            }

            await loadInterview();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Could not submit your answer.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleGenerateFeedback = async () => {
        setGeneratingFeedback(true);
        try {
            await generateLiveFeedback(id, token);
            toast.success("Interview feedback is ready.");
            navigate(`/feedback/${id}`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to generate feedback.");
        } finally {
            setGeneratingFeedback(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">Loading live interview...</div>;
    }

    if (!interview) return null;

    const isComplete = interview.status === "COMPLETED";

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />
            <main className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-blue-400 font-semibold tracking-wide text-sm">LIVE ADAPTIVE INTERVIEW</p>
                        <h1 className="text-3xl md:text-4xl font-bold mt-2">{interview.role}</h1>
                        <p className="text-slate-400 mt-2">{interview.level} · {interview.type} · Question {questionCount} of up to 12</p>
                    </div>
                    <span className={`w-fit px-3 py-1 rounded-full text-sm font-medium ${isComplete ? "bg-green-500/15 text-green-300" : "bg-blue-500/15 text-blue-300"}`}>
                        {isComplete ? "Completed" : "In progress"}
                    </span>
                </div>

                {!isComplete ? (
                    <>
                        <div className="mt-8 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((questionCount / 12) * 100, 100)}%` }} />
                        </div>
                        <section className="mt-8 rounded-2xl border border-blue-500/30 bg-slate-900 p-6 md:p-8 shadow-xl shadow-blue-950/20">
                            <p className="text-blue-300 text-sm font-semibold">INTERVIEWER QUESTION</p>
                            <h2 className="mt-3 text-xl md:text-2xl leading-relaxed font-semibold">{currentQuestion?.content || "Preparing the next question..."}</h2>
                            {currentQuestion?.topic && <div className="flex gap-2 mt-5 text-xs"><span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{currentQuestion.topic}</span><span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{currentQuestion.difficulty}</span></div>}
                        </section>
                        <section className="mt-6">
                            <div className="flex items-center justify-between gap-4 mb-3">
                                <label className="text-slate-200 font-medium" htmlFor="live-answer">Your answer</label>
                                <button type="button" onClick={isListening ? stopListening : startListening} className={`text-sm px-4 py-2 rounded-lg transition ${isListening ? "bg-red-600 hover:bg-red-500" : "bg-slate-800 hover:bg-slate-700"}`}>{isListening ? "Stop recording" : "Use microphone"}</button>
                            </div>
                            <textarea id="live-answer" rows={8} value={answer} onChange={(event) => setAnswer(event.target.value)} disabled={submitting} placeholder="Explain your reasoning clearly. The interviewer will adapt the next question to your answer." className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 p-5 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60" />
                            {isListening && <p className="mt-2 text-sm text-red-300 animate-pulse">Listening…</p>}
                        </section>
                        <div className="mt-6 flex justify-end"><button onClick={handleSubmitAnswer} disabled={submitting || isListening} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 transition">{submitting ? "Interviewer is thinking..." : "Submit answer"}</button></div>
                    </>
                ) : (
                    <section className="mt-10 rounded-2xl border border-green-500/30 bg-slate-900 p-8 text-center">
                        <h2 className="text-2xl font-bold">Interview complete</h2>
                        <p className="max-w-xl mx-auto mt-3 text-slate-400">Generate a detailed assessment with scores, strengths, improvement areas, and ideal answers for every reviewed question.</p>
                        <button onClick={interview.feedback ? () => navigate(`/feedback/${id}`) : handleGenerateFeedback} disabled={generatingFeedback} className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60 transition">{interview.feedback ? "View feedback" : generatingFeedback ? "Generating feedback..." : "Generate feedback"}</button>
                    </section>
                )}

                <section className="mt-10 border-t border-slate-800 pt-8">
                    <h2 className="text-lg font-semibold">Conversation</h2>
                    <div className="mt-4 space-y-3">{interview.messages?.map((message) => <div key={message.id} className={`rounded-xl p-4 ${message.role === "AI" ? "bg-slate-900 border border-slate-800" : "bg-blue-600/10 border border-blue-500/20"}`}><p className="text-xs font-semibold text-slate-400">{message.role === "AI" ? "INTERVIEWER" : "YOU"}</p><p className="mt-1 leading-relaxed text-slate-200">{message.content}</p></div>)}</div>
                </section>
            </main>
        </div>
    );
}

export default LiveInterview;
