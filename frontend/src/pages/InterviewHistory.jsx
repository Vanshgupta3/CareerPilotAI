import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

import {
    getInterviewHistory
} from "../services/InterviewService";

function InterviewHistory() {

    const navigate = useNavigate();

    const { token } = useAuth();

    const [interviews, setInterviews] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchHistory();

    }, []);

    const fetchHistory = async () => {

        try {

            const result =
                await getInterviewHistory(token);

            setInterviews(result.interviews);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load interview history."
            );

        } finally {

            setLoading(false);

        }

    };

    const getScoreColor = (score) => {

        if (score >= 80)
            return "bg-green-500/20 text-green-400";

        if (score >= 60)
            return "bg-blue-500/20 text-blue-400";

        if (score >= 40)
            return "bg-yellow-500/20 text-yellow-400";

        return "bg-red-500/20 text-red-400";

    };

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <h1 className="text-2xl text-white">

                    Loading Interview History...

                </h1>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">

                <div className="flex justify-between items-center">

                    <div>

                        <h1 className="text-4xl font-bold text-white">

                            Interview History

                        </h1>

                        <p className="text-slate-400 mt-2">

                            Review all your previous AI interviews.

                        </p>

                    </div>

                    <button

                        onClick={() => navigate("/interview")}

                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"

                    >

                        New Interview

                    </button>

                </div>

                {

                    interviews.length === 0 ? (

                        <div className="text-center mt-20">

                            <h2 className="text-3xl text-white">

                                No Interviews Yet

                            </h2>

                            <p className="text-slate-400 mt-4">

                                Start your first AI interview.

                            </p>

                        </div>

                    ) : (

                        <div className="grid gap-6 mt-10">                            {

                                interviews.map((interview) => (

                                    <div
                                        key={interview.id}
                                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition-all duration-300"
                                    >

                                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

                                            <div>

                                                <h2 className="text-2xl font-bold text-white">

                                                    {interview.role}

                                                </h2>

                                                <p className="text-slate-400 mt-2">

                                                    {interview.level} • {interview.type}

                                                </p>

                                                <p className="text-slate-500 mt-3">

                                                    {new Date(
                                                        interview.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric"
                                                        }
                                                    )}

                                                </p>

                                            </div>

                                            <div className="flex flex-col items-start lg:items-end gap-4">

                                                {

                                                    interview.feedback ? (

                                                        <>

                                                            <span

                                                                className={`px-4 py-2 rounded-full font-semibold ${getScoreColor(

                                                                    interview.feedback.overallScore

                                                                )}`}

                                                            >

                                                                Overall Score • {interview.feedback.overallScore}%

                                                            </span>

                                                            <button

                                                                onClick={() =>
                                                                    navigate(
                                                                        `/feedback/${interview.id}`
                                                                    )
                                                                }

                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"

                                                            >

                                                                View Feedback

                                                            </button>

                                                        </>

                                                    ) : (

                                                        <>

                                                            <span

                                                                className="px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-400 font-semibold"

                                                            >

                                                                Interview Incomplete

                                                            </span>

                                                            <button

                                                                disabled

                                                                className="bg-slate-700 text-slate-400 px-6 py-3 rounded-xl cursor-not-allowed"

                                                            >

                                                                Feedback Unavailable

                                                            </button>

                                                        </>

                                                    )

                                                }

                                            </div>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default InterviewHistory;
