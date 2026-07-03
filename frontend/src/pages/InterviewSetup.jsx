import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";

import { getProfile } from "../services/authService";
import { startInterview } from "../services/interviewService";

function InterviewSetup() {

    const navigate = useNavigate();

    const { token } = useAuth();

    const [resume, setResume] = useState(null);

    const [selectedRole, setSelectedRole] = useState("Frontend Developer");
    const [customRole, setCustomRole] = useState("");

    const [level, setLevel] = useState("Intern");

    const [type, setType] = useState("Technical");

    const [questionCount, setQuestionCount] = useState(10);

    const [loading, setLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    const fetchProfile = async () => {

        try {

            const result = await getProfile(token);

            setResume(result.resume);

        } catch (error) {

            console.error(error);

        } finally {

            setPageLoading(false);

        }

    };

    useEffect(() => {

        fetchProfile();

    }, []);

    const handleStartInterview = async () => {

        if (!resume) {

            toast.error("Please upload a resume first.");

            navigate("/resume");

            return;

        }

        if (questionCount < 2 || questionCount > 30) {

            toast.error("Number of questions must be between 2 and 30.");

            return;

        }

        const role =

            selectedRole === "Other"

                ? customRole.trim()

                : selectedRole;

        if (!role) {

            toast.error("Please enter a custom job role.");

            return;

        }

        setLoading(true);

        try {

            const result = await startInterview(

                {

                    resumeId: resume.id,

                    role,

                    level,

                    type,

                    questionCount

                },

                token

            );

            toast.success("Interview created successfully.");

            navigate(`/interview/${result.interview.interviewId}`);

        } catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ||

                "Failed to start interview."

            );

        } finally {

            setLoading(false);

        }

    };

    if (pageLoading) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <h1 className="text-white text-2xl">

                    Loading...

                </h1>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-10">

                <div className="mb-10">

                    <h1 className="text-4xl font-bold text-white">

                        AI Mock Interview

                    </h1>

                    <p className="text-slate-400 mt-3">

                        Practice personalized interviews generated from your resume.

                    </p>

                </div>

                {!resume ? (

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

                        <h2 className="text-2xl font-semibold text-white">

                            No Resume Found

                        </h2>

                        <p className="text-slate-400 mt-4">

                            Upload a resume before starting an interview.

                        </p>

                        <button

                            onClick={() => navigate("/resume")}

                            className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white"

                        >

                            Upload Resume

                        </button>

                    </div>

                ) : (

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                        <div className="grid md:grid-cols-2 gap-6">

                            <div>

                                <label className="text-slate-300">

                                    Job Role

                                </label>

                                <select

                                    value={selectedRole}

                                    onChange={(e) => setSelectedRole(e.target.value)}

                                    className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"

                                >

                                    <option>Frontend Developer</option>
                                    <option>Backend Developer</option>
                                    <option>Full Stack Developer</option>
                                    <option>Software Engineer</option>
                                    <option>Java Developer</option>
                                    <option>Python Developer</option>
                                    <option>Data Scientist</option>
                                    <option>Machine Learning Engineer</option>
                                    <option>DevOps Engineer</option>
                                    <option>QA Engineer</option>
                                    <option>Other</option>

                                </select>

                                {selectedRole === "Other" && (

                                    <input

                                        type="text"

                                        value={customRole}

                                        onChange={(e) => setCustomRole(e.target.value)}

                                        placeholder="Enter custom role"

                                        className="w-full mt-4 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"

                                    />

                                )}

                            </div>

                            <div>

                                <label className="text-slate-300">

                                    Experience Level

                                </label>

                                <select

                                    value={level}

                                    onChange={(e) => setLevel(e.target.value)}

                                    className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"

                                >

                                    <option>Intern</option>
                                    <option>Fresher</option>
                                    <option>Junior</option>
                                    <option>Mid-Level</option>
                                    <option>Senior</option>

                                </select>

                            </div>

                            <div>

                                <label className="text-slate-300">

                                    Interview Type

                                </label>

                                <select

                                    value={type}

                                    onChange={(e) => setType(e.target.value)}

                                    className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"

                                >

                                    <option>Technical</option>
                                    <option>HR</option>
                                    <option>Behavioral</option>

                                </select>

                            </div>

                            <div>

                                <label className="text-slate-300">

                                    Number of Questions

                                </label>

                                <input

                                    type="number"

                                    min={2}

                                    max={30}

                                    value={questionCount}

                                    onChange={(e) => setQuestionCount(Number(e.target.value))}

                                    className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white"

                                />

                                <p className="text-slate-400 text-sm mt-2">

                                    Minimum 2 • Maximum 30

                                </p>

                            </div>

                        </div>

                        <div className="mt-8 bg-slate-800 rounded-xl p-5">

                            <h3 className="text-white font-semibold">

                                Current Resume

                            </h3>

                            <p className="text-green-400 mt-2">

                                📄 {resume.title}

                            </p>

                        </div>

                        <button

                            onClick={handleStartInterview}

                            disabled={loading}

                            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-4 rounded-xl text-white font-semibold transition"

                        >

                            {

                                loading

                                    ? "Generating Questions..."

                                    : "🚀 Start Interview"

                            }

                        </button>

                    </div>

                )}

            </div>

        </div>

    );

}

export default InterviewSetup;