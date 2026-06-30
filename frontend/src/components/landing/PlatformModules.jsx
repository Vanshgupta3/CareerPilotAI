import {
    FileText,
    BrainCircuit,
    Briefcase,
    LayoutDashboard
} from "lucide-react";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Section from "../ui/Section";
import Container from "../ui/Container";

function PlatformModules() {

    const modules = [
        {
            icon: <FileText size={40} className="text-blue-500" />,
            title: "Resume Intelligence",
            features: [
                "ATS Score",
                "Grammar Analysis",
                "Skills Extraction",
                "AI Suggestions"
            ]
        },
        {
            icon: <BrainCircuit size={40} className="text-blue-500" />,
            title: "AI Interviews",
            features: [
                "Resume-Based Questions",
                "AI Evaluation",
                "Performance Score",
                "Detailed Feedback"
            ]
        },
        {
            icon: <Briefcase size={40} className="text-blue-500" />,
            title: "Job Match",
            badge: "Coming Soon",
            features: [
                "Resume vs JD",
                "Missing Skills",
                "Match Percentage",
                "Recommendations"
            ]
        },
        {
            icon: <LayoutDashboard size={40} className="text-blue-500" />,
            title: "Career Dashboard",
            features: [
                "Interview History",
                "Resume History",
                "Progress Tracking",
                "Career Insights"
            ]
        }
    ];

    return (
        <Section className="bg-slate-950">

            <Container>

                <div className="text-center">

                    <h2 className="text-4xl font-bold text-white">

                        Everything In One Platform

                    </h2>

                    <p className="text-slate-400 mt-4">

                        Designed to help you prepare,
                        practice and grow throughout your career journey.

                    </p>

                </div>

                <div className="grid lg:grid-cols-2 gap-8 mt-16">

                    {modules.map((module, index) => (

                        <Card key={index}>

                            <div className="flex justify-between items-center">

                                {module.icon}

                                {module.badge && (

                                    <Badge>

                                        {module.badge}

                                    </Badge>

                                )}

                            </div>

                            <h3 className="text-2xl font-semibold text-white mt-6">

                                {module.title}

                            </h3>

                            <ul className="mt-6 space-y-3">

                                {module.features.map((feature) => (

                                    <li
                                        key={feature}
                                        className="text-slate-400 flex items-center gap-3"
                                    >

                                        <span className="text-green-500">

                                            ✓

                                        </span>

                                        {feature}

                                    </li>

                                ))}

                            </ul>

                        </Card>

                    ))}

                </div>

            </Container>

        </Section>
    );
}

export default PlatformModules;