import { Link } from "react-router-dom";

function DashboardCard({

    title,

    description,

    buttonText,

    link

}) {

    
    return (

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">

            <h2 className="text-2xl font-semibold text-white">

                {title}

            </h2>

            <p className="text-slate-400 mt-3">

                {description}

            </p>

            <Link
                to={link}
                className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-medium"
            >

                {buttonText}

            </Link>

        </div>

    );

}

export default DashboardCard;