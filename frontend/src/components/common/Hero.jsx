import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="min-h-[90vh] bg-slate-950 flex items-center">

            <div className="max-w-7xl mx-auto px-6">

                <h1 className="text-6xl font-bold text-white leading-tight">

                    Your AI Career

                    <span className="text-blue-500">
                        {" "}Companion
                    </span>

                </h1>

                <p className="mt-6 text-slate-400 text-xl max-w-2xl">

                    Analyze your resume, improve ATS score,
                    practice AI interviews and land your dream job.

                </p>

                <div className="mt-10 flex gap-4">

                    <Link
                        to="/signup"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl"
                    >
                        Get Started
                    </Link>

                    <Link
                        to="/login"
                        className="border border-slate-700 text-white px-8 py-4 rounded-xl"
                    >
                        Login
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default Hero;