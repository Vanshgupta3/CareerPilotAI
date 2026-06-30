import {
    BrainCircuit,
    FileSearch,
    MessageSquareCode
} from "lucide-react";

function Features() {

    const features = [
        {
            icon: <FileSearch size={40} className="text-blue-500" />,
            title: "AI Resume Intelligence",
            description:
                "Analyze resumes, improve ATS score and receive actionable suggestions."
        },
        {
            icon: <MessageSquareCode size={40} className="text-blue-500" />,
            title: "AI Mock Interviews",
            description:
                "Practice technical interviews generated dynamically from your resume."
        },
        {
            icon: <BrainCircuit size={40} className="text-blue-500" />,
            title: "Career Insights",
            description:
                "Track interview performance, identify skill gaps and improve continuously."
        }
    ];

    return (
        <section
            id="features"
            className="bg-slate-900 py-24"
        >

            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-white text-center">

                    Everything You Need

                </h2>

                <p className="text-slate-400 text-center mt-4">

                    One AI platform for resume optimization,
                    interview preparation and career growth.

                </p>

                <div className="grid md:grid-cols-3 gap-8 mt-16">

                    {features.map((feature, index) => (

                        <div
                            key={index}
                            className="bg-slate-950 rounded-2xl p-8 border border-slate-800 hover:border-blue-500 transition"
                        >

                            {feature.icon}

                            <h3 className="text-white text-2xl font-semibold mt-6">

                                {feature.title}

                            </h3>

                            <p className="text-slate-400 mt-4">

                                {feature.description}

                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}

export default Features;