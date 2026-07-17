import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";

import useSpeechRecognition from "../hooks/useSpeechRecognition";

import {
    getInterviewQuestions,
    submitAnswers,
    generateInterviewFeedback
} from "../services/InterviewService";

function InterviewSession() {

    const { id } = useParams();

    const navigate = useNavigate();

    const { token } = useAuth();

    const [questions, setQuestions] = useState([]);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [answers, setAnswers] = useState({});

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const {

        transcript,
        isListening,
        startListening,
        stopListening,
        resetTranscript

    } = useSpeechRecognition();

    const fetchQuestions = async () => {

        try {

            const result = await getInterviewQuestions(
                id,
                token
            );

            setQuestions(result.questions);

        } catch (error) {

            console.error(error);

            toast.error("Failed to load interview.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchQuestions();

    }, []);

    useEffect(() => {

        const questionId = questions[currentQuestion]?.id;

        if (!questionId || !transcript) return;

        setAnswers((prev) => {

            if (prev[questionId] === transcript) {

                return prev;

            }

            return {

                ...prev,

                [questionId]: transcript

            };

        });

    }, [transcript, currentQuestion, questions]);

    const handleFinishInterview = async () => {

        stopListening();

        setSubmitting(true);

        try {

            const formattedAnswers = Object.entries(
                answers
            ).map(

                ([questionId, answerText]) => ({

                    questionId,

                    answerText

                })

            );

            await submitAnswers(

                formattedAnswers,

                token

            );

            await generateInterviewFeedback(

                id,

                token

            );

            toast.success(

                "Interview completed successfully."

            );

            navigate(`/feedback/${id}`);

        } catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ||

                "Failed to finish interview."

            );

        } finally {

            setSubmitting(false);

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <h1 className="text-white text-2xl">

                    Loading Interview...

                </h1>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold text-white">

                    AI Mock Interview

                </h1>

                <p className="text-slate-400 mt-3">

                    Question {currentQuestion + 1} of {questions.length}

                </p>

                <div className="w-full bg-slate-800 rounded-full h-3 mt-6">

                    <div

                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"

                        style={{

                            width: `${((currentQuestion + 1) / questions.length) * 100}%`

                        }}

                    />

                </div>

                <div className="mt-10 bg-slate-900 rounded-2xl border border-slate-800 p-8">

                    <h2 className="text-2xl font-semibold text-white">

                        {questions[currentQuestion]?.questionText}

                    </h2>

                </div>

                <div className="mt-8">

                    <label className="block text-slate-300 mb-3">

                        Your Answer

                    </label>

                    <div className="flex items-center gap-4 mb-4">

                        <button

                            type="button"

                            onClick={

                                isListening

                                    ? stopListening

                                    : startListening

                            }

                            className={`px-4 py-2 rounded-lg text-white transition ${

                                isListening

                                    ? "bg-red-600 hover:bg-red-700"

                                    : "bg-blue-600 hover:bg-blue-700"

                            }`}

                        >

                            {

                                isListening

                                    ? "🛑 Stop Recording"

                                    : "🎤 Start Recording"

                            }

                        </button>

                        {

                            isListening && (

                                <span className="text-red-400 font-medium animate-pulse">

                                    Listening...

                                </span>

                            )

                        }

                    </div>

                    <textarea

                        rows={8}

                        value={

                            answers[

                                questions[currentQuestion]?.id

                            ] || ""

                        }

                        onChange={(e) =>

                            setAnswers({

                                ...answers,

                                [questions[currentQuestion]?.id]:

                                    e.target.value

                            })

                        }

                        placeholder="Type your answer here..."

                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"

                    />
                                    </div>

                <div className="flex justify-between mt-8">

                    <button

                        disabled={currentQuestion === 0 || isListening}

                        onClick={() => {

                            stopListening();

                            resetTranscript();

                            setCurrentQuestion((prev) => prev - 1);

                        }}

                        className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-white transition"

                    >

                        Previous

                    </button>

                    {

                        currentQuestion === questions.length - 1 ? (

                            <button

                                onClick={handleFinishInterview}

                                disabled={submitting || isListening}

                                className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-white transition"

                            >

                                {

                                    submitting

                                        ? "Generating Feedback..."

                                        : "Finish Interview"

                                }

                            </button>

                        ) : (

                            <button

                                disabled={isListening}

                                onClick={() => {

                                    stopListening();

                                    resetTranscript();

                                    setCurrentQuestion((prev) => prev + 1);

                                }}

                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-6 py-3 rounded-xl text-white transition"

                            >

                                Next

                            </button>

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default InterviewSession;
