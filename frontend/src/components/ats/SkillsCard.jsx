function SkillsCard({

    title,
    skills,
    color

}) {

    const icon =
        title === "Skills"
            ? "✅"
            : "❌";

    return (

        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-lg">

            <h2 className="text-2xl font-bold text-white">

                {title}

            </h2>

            <p className="text-slate-400 mt-2">

                {skills.length} items detected

            </p>

            <div className="flex flex-wrap gap-3 mt-6">

                {skills.map((skill, index) => (

                    <span
                        key={index}
                        className={`${color} px-4 py-2 rounded-full text-white font-medium flex items-center gap-2`}
                    >

                        <span>

                            {icon}

                        </span>

                        {skill}

                    </span>

                ))}

            </div>

        </div>

    );

}

export default SkillsCard;