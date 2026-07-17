import { useNavigate } from "react-router-dom";

function CurrentResumeCard({

    resume,
    analysis,
    onAnalyze,
    onReplace,
    loading

}) {

    const navigate = useNavigate();

    const serverUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
        .replace(/\/api\/?$/, "");

    const resumeUrl =
        `${serverUrl}/${resume.fileUrl.replace(/\\/g, "/")}`;

    return (

        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">

            <h2 className="text-3xl font-bold text-white">

                Current Resume

            </h2>

            <div className="mt-6">

                <p className="text-xl text-green-400">

                    📄 {resume.title}

                </p>

                <p className="text-slate-400 mt-2">

                    Uploaded:{" "}
                    {new Date(resume.uploadedAt).toLocaleDateString()}

                </p>

                {analysis && (

                    <div className="mt-5 bg-slate-800 rounded-xl p-4">

                        <h3 className="text-white font-semibold">

                            Latest Analysis

                        </h3>

                        <p className="text-green-400 text-2xl font-bold mt-2">

                            🎯 ATS Score: {analysis.atsScore}%

                        </p>

                        <p className="text-slate-400 mt-2">

                            Grammar: {analysis.grammarScore}% | Formatting: {analysis.formatScore}%

                        </p>

                    </div>

                )}

            </div>

            <div className="flex flex-wrap gap-4 mt-8">

                {analysis && (

                    <button
                        onClick={() => navigate("/ats-report")}
                        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl text-white transition"
                    >

                        📊 View ATS Report

                    </button>

                )}

                <button
                    onClick={onAnalyze}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-6 py-3 rounded-xl text-white transition"
                >

                    {loading
                        ? "Analyzing..."
                        : analysis
                        ? "🔄 Analyze Again"
                        : "🤖 Analyze Resume"}

                </button>

                <button
                    onClick={() => window.open(resumeUrl, "_blank")}
                    className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl text-white transition"
                >

                    👁 View Resume

                </button>

                <a
                    href={resumeUrl}
                    download={resume.title}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl text-white transition text-center"
                >

                    📥 Download Resume

                </a>

                <button
                    onClick={onReplace}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white transition"
                >

                    🔄 Replace Resume

                </button>

            </div>

        </div>

    );

}

export default CurrentResumeCard;
