function StatCard({

    title,

    value,

    color

}) {

    const colors = {

        blue: "border-blue-500",

        green: "border-green-500",

        yellow: "border-yellow-500",

        purple: "border-purple-500"

    };

    return (

        <div
            className={`
                bg-slate-900
                rounded-2xl
                border
                ${colors[color]}
                p-6
            `}
        >

            <p className="text-slate-400">

                {title}

            </p>

            <h2 className="text-4xl font-bold text-white mt-3">

                {value}

            </h2>

        </div>

    );

}

export default StatCard;