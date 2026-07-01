import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Navbar() {

    const navigate = useNavigate();

    const { logoutUser } = useAuth();

    const handleLogout = () => {

        logoutUser();

        navigate("/login");

    };

    return (

        <nav className="bg-slate-900 border-b border-slate-800">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <h1 className="text-2xl font-bold text-white">

                    CareerPilot AI

                </h1>

                <div className="flex items-center gap-6">

                    <Link
                        to="/dashboard"
                        className="text-slate-300 hover:text-white"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/resume"
                        className="text-slate-300 hover:text-white"
                    >
                        Resume
                    </Link>

                    <Link
                        to="/interview"
                        className="text-slate-300 hover:text-white"
                    >
                        Interview
                    </Link>

                    <Link
                        to="/feedback"
                        className="text-slate-300 hover:text-white"
                    >
                        Feedback
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