import Button from "../ui/Button";
import DashboardPreview from "./DashboardPreview";

function Hero() {
    return (
        <section className="min-h-screen bg-slate-950 flex items-center">

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

                <div>

                    <p className="text-blue-500 font-semibold mb-4">

                        AI Powered Career Platform

                    </p>

                    <h1 className="text-6xl font-bold text-white leading-tight">

                        Land More Interviews

                        <br />

                        with

                        <span className="text-blue-500">
                            {" "}CareerPilot AI
                        </span>

                    </h1>

                    <p className="text-slate-400 text-xl mt-8 leading-8">

                        Analyze resumes, improve ATS score,
                        practice AI interviews,
                        and prepare for your dream job.

                    </p>

                    <div className="flex gap-4 mt-10">

                        <Button to="/signup">

                            Get Started

                        </Button>

                        <Button
                            to="/login"
                            variant="secondary"
                        >

                            Login

                        </Button>

                    </div>

                </div>

                <DashboardPreview />

            </div>

        </section>
    );
}

export default Hero;