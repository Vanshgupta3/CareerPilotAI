import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

import { getLatestFeedback } from "../services/interviewService";

function Navbar() {

    const navigate = useNavigate();

    const { token, logoutUser } = useAuth();

    const handleLogout = () => {

        logoutUser();

        navigate("/login");

    };

    const handleFeedback = async () => {

        try {

            const result = await getLatestFeedback(token);

            navigate(`/feedback/${result.interviewId}`);

        } catch (error) {

            console.error(error);

            toast.error("No interview feedback found.");

        }

    };

    return (

        <nav className="bg-slate-900 border-b border-slate-800">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <h1
                    onClick={() => navigate("/dashboard")}
                    className="text-2xl font-bold text-white cursor-pointer"
                >
                    CareerPilot AI
                </h1>

                <div className="flex items-center gap-6">

                    <Link
                        to="/dashboard"
                        className="text-slate-300 hover:text-white transition"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/resume"
                        className="text-slate-300 hover:text-white transition"
                    >
                        Resume
                    </Link>

                    <Link
                        to="/interview"
                        className="text-slate-300 hover:text-white transition"
                    >
                        Interview
                    </Link>

                    <button
                        onClick={handleFeedback}
                        className="text-slate-300 hover:text-white transition"
                    >
                        Feedback
                    </button>
                    <Link
    to="/history"
    className="text-slate-300 hover:text-white"
>
    History
</Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;