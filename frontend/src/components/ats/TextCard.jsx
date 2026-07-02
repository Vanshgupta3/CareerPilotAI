function TextCard({

    title,
    content

}) {

    const icons = {

        Strengths: "💪",

        Weaknesses: "⚠️",

        Suggestions: "💡"

    };

    return (

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-lg">

            <h2 className="text-2xl font-bold text-white flex items-center gap-3">

                <span>

                    {icons[title]}

                </span>

                {title}

            </h2>

            <p className="text-slate-300 leading-8 mt-6 whitespace-pre-line">

                {content}

            </p>

        </div>

    );

}

export default TextCard;