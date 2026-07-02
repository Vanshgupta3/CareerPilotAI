function ScoreCard({ score }) {

    const radius = 90;

    const stroke = 12;

    const normalizedRadius = radius - stroke / 2;

    const circumference = normalizedRadius * 2 * Math.PI;

    const strokeDashoffset =
        circumference - (score / 100) * circumference;

    let strokeColor = "#ef4444";
    let status = "Needs Improvement";

    if (score >= 80) {

        strokeColor = "#22c55e";
        status = "Excellent";

    } else if (score >= 60) {

        strokeColor = "#eab308";
        status = "Good";

    }

    return (

        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-12">

            <div className="flex flex-col items-center">

                <p className="uppercase tracking-[0.35em] text-slate-400 text-sm">

                    ATS SCORE

                </p>

                <div className="relative w-56 h-56 mt-8">

                    <svg
                        width="224"
                        height="224"
                        className="-rotate-90"
                    >

                        <circle
                            stroke="#334155"
                            fill="transparent"
                            strokeWidth={stroke}
                            r={normalizedRadius}
                            cx="112"
                            cy="112"
                        />

                        <circle
                            stroke={strokeColor}
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            r={normalizedRadius}
                            cx="112"
                            cy="112"
                            style={{
                                transition: "stroke-dashoffset 1s ease"
                            }}
                        />

                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">

                        <h1 className="text-6xl font-bold text-white">

                            {score}%

                        </h1>

                        <p
                            className="mt-2 font-semibold"
                            style={{
                                color: strokeColor
                            }}
                        >

                            {status}

                        </p>

                    </div>

                </div>

                <p className="text-slate-400 text-center mt-8 max-w-xl leading-7">

                    Your ATS score estimates how well your resume is likely
                    to perform in Applicant Tracking Systems by evaluating
                    formatting, keywords, readability, grammar and overall
                    structure.

                </p>

            </div>

        </div>

    );

}

export default ScoreCard;