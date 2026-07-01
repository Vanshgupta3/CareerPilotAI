import Navbar from "../components/Navbar";

function Dashboard() {

    return (

        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-16">

                <h1 className="text-4xl font-bold text-white">

                    Welcome to CareerPilot AI 👋

                </h1>

                <p className="text-slate-400 mt-3">

                    Your personalized AI career assistant.

                </p>

            </div>

        </div>

    );

}

export default Dashboard;