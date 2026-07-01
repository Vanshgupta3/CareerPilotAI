import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import { useAuth } from "../context/AuthContext";

function Dashboard() {

    const { user } = useAuth();

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