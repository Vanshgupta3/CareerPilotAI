import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";

import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authService";

function Dashboard() {

    const navigate = useNavigate();

    const { user, token } = useAuth();

    const [resume, setResume] = useState(null);

    const [analysis, setAnalysis] = useState(null);

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {

        greeting = "Good Morning ☀️";

    } else if (hour < 17) {

        greeting = "Good Afternoon 🌤️";

    } else if (hour < 21) {

        greeting = "Good Evening 🌙";

    } else {

        greeting = "Good Night 🌌";

    }

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const result = await getProfile(token);

                setResume(result.resume);

                setAnalysis(result.analysis);

            } catch (error) {

                console.error(error);

            }

        };

        if (token) {

            fetchProfile();

        }

    }, [token]);

    return (

        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Hero Section */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-10">

                    <p className="text-blue-400 text-lg font-medium">

                        {greeting}

                    </p>

                    <h1 className="text-4xl font-bold text-white mt-3">

                        Welcome back, {user?.name || "User"} 👋

                    </h1>

                    <p className="text-slate-400 mt-3 text-lg">

                        Ready to improve your career today?
                        Upload your resume, practice AI interviews,
                        and track your progress—all in one place.

                    </p>

                </div>

                {/* Resume Overview */}

               {/* Resume Overview */}

{resume && (

    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 rounded-2xl p-8 mb-10 shadow-lg">

        <div className="flex items-center justify-between mb-8">

            <div>

                <h2 className="text-3xl font-bold text-white">

                    📄 Resume Overview

                </h2>

                <p className="text-slate-400 mt-2">

                    Your latest resume and ATS analysis.

                </p>

            </div>

            {analysis && (

                <button
                    onClick={() => navigate("/ats-report")}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-semibold transition"
                >

                    View ATS Report

                </button>

            )}

        </div>

        <div className="grid md:grid-cols-3 gap-6">

            {/* Resume */}

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">

                <p className="text-slate-400 text-sm">

                    Resume

                </p>

                <h3 className="text-white text-xl font-bold mt-3 truncate">

                    📄 {resume.title}

                </h3>

                <p className="text-slate-500 mt-3 text-sm">

                    Uploaded

                </p>

                <p className="text-white">

                    {new Date(resume.uploadedAt).toLocaleDateString()}

                </p>

            </div>

            {/* ATS */}

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">

                <p className="text-slate-400 text-sm">

                    Latest ATS Score

                </p>

                <h3 className="text-5xl font-bold text-green-400 mt-4">

                    {analysis ? `${analysis.atsScore}%` : "--"}

                </h3>

                <p className="mt-4 text-slate-300">

                    {analysis
                        ? "Resume analyzed successfully"
                        : "Not analyzed yet"}

                </p>

            </div>

            {/* Status */}

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">

                <p className="text-slate-400 text-sm">

                    Resume Status

                </p>

                <h3 className="text-2xl font-bold text-green-400 mt-4">

                    Ready ✅

                </h3>

                <p className="mt-4 text-slate-300">

                    {analysis
                        ? "Ready for interviews"
                        : "Analyze your resume"}

                </p>

            </div>

        </div>

    </div>

)}

                {/* Dashboard Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <DashboardCard
                        title="Resume Analysis"
                        description="Upload your resume and receive an ATS score with personalized improvement suggestions."
                        buttonText="Analyze Resume"
                        link="/resume"
                    />

                    <DashboardCard
                        title="AI Mock Interview"
                        description="Practice technical interviews with AI-generated questions and receive instant feedback."
                        buttonText="Start Interview"
                        link="/interview"
                    />

                    <DashboardCard
                        title="Interview Feedback"
                        description="Review your interview history and analyze your performance over time."
                        buttonText="View Feedback"
                        link="/feedback"
                    />

                    <DashboardCard
                        title="Career Progress"
                        description="Track your resume score, completed interviews, and overall preparation journey."
                        buttonText="Coming Soon"
                        link="/dashboard"
                    />

                </div>

            </div>

        </div>

    );

}

export default Dashboard;