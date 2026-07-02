function SummaryCard({ summary }) {

    return (

        <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">

            <h2 className="text-2xl font-bold text-white">

                Professional Summary

            </h2>

            <p className="text-slate-300 mt-5 leading-8">

                {summary}

            </p>

        </div>

    );

}

export default SummaryCard;