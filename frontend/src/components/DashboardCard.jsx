import { Link } from "react-router-dom";

function DashboardCard({

    title,
    description,
    buttonText,
    link

}) {

    const icons = {

        "Resume Analysis": "📄",
        "AI Mock Interview": "🎤",
        "Interview Feedback": "📊",
        "Career Progress": "📈"

    };

    return (

        <div
            className="
                group
                bg-gradient-to-br
                from-slate-900
                to-slate-800
                border
                border-slate-800
                rounded-2xl
                p-7
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-blue-500
                hover:shadow-2xl
                hover:shadow-blue-500/20
            "
        >

            <div className="flex items-center gap-4">

                <div className="text-5xl">

                    {icons[title] || "✨"}

                </div>

                <div>

                    <h2 className="text-2xl font-bold text-white">

                        {title}

                    </h2>

                    <p className="text-slate-400 mt-2">

                        {description}

                    </p>

                </div>

            </div>

            <div className="mt-8 flex justify-between items-center">

                <Link
                    to={link}
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        px-6
                        py-3
                        rounded-xl
                        text-white
                        font-semibold
                        transition
                    "
                >

                    {buttonText}

                </Link>

                <span
                    className="
                        text-3xl
                        text-slate-500
                        transition-all
                        duration-300
                        group-hover:text-blue-400
                        group-hover:translate-x-2
                    "
                >

                    →

                </span>

            </div>

        </div>

    );

}

export default DashboardCard;