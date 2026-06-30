import {
    Brain,
    FileText,
    Briefcase,
    TrendingUp
} from "lucide-react";

import Card from "../ui/Card";
import Container from "../ui/Container";
import Section from "../ui/Section";

function WhyChoose() {

    const features = [
        {
            icon: <FileText size={42} className="text-blue-500" />,
            title: "Resume Intelligence",
            description:
                "Analyze your resume with AI, improve ATS score, identify missing keywords and receive personalized suggestions."
        },
        {
            icon: <Brain size={42} className="text-blue-500" />,
            title: "AI Mock Interviews",
            description:
                "Practice resume-based interviews with AI-generated questions and receive detailed answer evaluations."
        },
        {
            icon: <Briefcase size={42} className="text-blue-500" />,
            title: "Job Match",
            description:
                "Compare your resume with job descriptions and discover the exact skills recruiters are looking for."
        },
        {
            icon: <TrendingUp size={42} className="text-blue-500" />,
            title: "Career Growth",
            description:
                "Track interview performance, monitor progress and receive AI-powered recommendations to improve."
        }
    ];

    return (
        <Section className="bg-slate-900">

            <Container>

                <div className="text-center">

                    <h2 className="text-4xl font-bold text-white">

                        Why CareerPilot AI?

                    </h2>

                    <p className="text-slate-400 mt-4 max-w-2xl mx-auto">

                        Everything you need to prepare smarter,
                        improve continuously and confidently land
                        your next opportunity.

                    </p>

                </div>

                <div className="grid lg:grid-cols-2 gap-8 mt-16">

                    {features.map((feature, index) => (

                        <Card key={index}>

                            <div className="mb-6">

                                {feature.icon}

                            </div>

                            <h3 className="text-2xl font-semibold text-white">

                                {feature.title}

                            </h3>

                            <p className="text-slate-400 mt-4 leading-7">

                                {feature.description}

                            </p>

                        </Card>

                    ))}

                </div>

            </Container>

        </Section>
    );
}

export default WhyChoose;