function CurrentResumeCard({

    resume,
    onAnalyze,
    onReplace,
    loading

}) {

    const resumeUrl =
        `http://localhost:5000/${resume.fileUrl.replace(/\\/g, "/")}`;

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

            </div>

            <div className="flex flex-wrap gap-4 mt-8">

                <button
                    onClick={onAnalyze}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 px-6 py-3 rounded-xl text-white transition"
                >

                    {loading
                        ? "Analyzing..."
                        : "🤖 Analyze Again"}

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