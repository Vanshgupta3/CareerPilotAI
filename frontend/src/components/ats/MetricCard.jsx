function MetricCard({

    title,
    score

}) {

    let color = "bg-red-500";
    let status = "Needs Work";

    if (score >= 80) {

        color = "bg-green-500";
        status = "Excellent";

    } else if (score >= 60) {

        color = "bg-yellow-500";
        status = "Good";

    }

    return (

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-lg">

            <div className="flex justify-between items-center">

                <h2 className="text-xl font-semibold text-white">

                    {title}

                </h2>

                <span className="text-slate-400">

                    {status}

                </span>

            </div>

            <h1 className="text-5xl font-bold text-white mt-6">

                {score}%

            </h1>

            <div className="w-full h-3 bg-slate-700 rounded-full mt-6 overflow-hidden">

                <div
                    className={`${color} h-full rounded-full transition-all duration-1000`}
                    style={{
                        width: `${score}%`
                    }}
                />

            </div>

        </div>

    );

}

export default MetricCard;