import { Link } from "react-router-dom";

function CTA() {
    return (
        <section className="bg-slate-950 py-24">

            <div className="max-w-5xl mx-auto text-center px-6">

                <h2 className="text-5xl font-bold text-white">

                    Ready to Ace Your Next Interview?

                </h2>

                <p className="text-slate-400 mt-6 text-lg">

                    Upload your resume, improve your ATS score,
                    practice AI-powered interviews and
                    prepare with confidence.

                </p>

                <Link
                    to="/signup"
                    className="inline-block mt-10 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl text-white font-semibold"
                >
                    Get Started Free
                </Link>

            </div>

        </section>
    );
}

export default CTA;