import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="w-full bg-slate-950 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <h1 className="text-2xl font-bold text-blue-500">
                    CareerPilot AI
                </h1>

                <div className="flex items-center gap-8">

                    <a
                        href="#features"
                        className="text-slate-300 hover:text-white transition"
                    >
                        Features
                    </a>

                    <Link
                        to="/login"
                        className="text-slate-300 hover:text-white transition"
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                    >
                        Get Started
                    </Link>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;