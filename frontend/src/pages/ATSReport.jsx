import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

import ScoreCard from "../components/ats/ScoreCard";
import MetricCard from "../components/ats/MetricCard";
import SummaryCard from "../components/ats/SummaryCard";
import SkillsCard from "../components/ats/SkillsCard";
import TextCard from "../components/ats/TextCard";

import { useAuth } from "../context/AuthContext";
import { getLatestAnalysis } from "../services/resumeService";

function ATSReport() {

    const { token } = useAuth();

    const [analysis, setAnalysis] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchAnalysis = async () => {

            try {

                const result = await getLatestAnalysis(token);

                setAnalysis(result.analysis);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchAnalysis();

    }, [token]);

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <h1 className="text-white text-3xl">

                    Loading ATS Report...

                </h1>

            </div>

        );

    }

    if (!analysis) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <h1 className="text-red-400 text-3xl">

                    No ATS report found.

                </h1>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

                {/* Page Header */}

                <div>

                    <h1 className="text-5xl font-bold text-white">

                        ATS Resume Report

                    </h1>

                    <p className="text-slate-400 mt-3 text-lg">

                        AI-powered analysis of your resume based on ATS optimization,
                        formatting, grammar, readability and keyword relevance.

                    </p>

                </div>

                {/* ATS Score */}

                <ScoreCard
                    score={analysis.atsScore}
                />

                {/* Resume Metrics */}

                <section className="space-y-6">

                    <h2 className="text-2xl font-bold text-white">

                        Resume Metrics

                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <MetricCard
                            title="Grammar Score"
                            score={analysis.grammarScore}
                        />

                        <MetricCard
                            title="Formatting Score"
                            score={analysis.formatScore}
                        />

                    </div>

                </section>

                {/* Summary */}

                <section className="space-y-6">

                    <h2 className="text-2xl font-bold text-white">

                        AI Summary

                    </h2>

                    <SummaryCard
                        summary={analysis.summary}
                    />

                </section>

                {/* Skills */}

                <section className="space-y-6">

                    <h2 className="text-2xl font-bold text-white">

                        Skills Analysis

                    </h2>

                    <div className="grid lg:grid-cols-2 gap-6">

                        <SkillsCard
                            title="Skills"
                            skills={analysis.skills}
                            color="bg-green-600"
                        />

                        <SkillsCard
                            title="Missing Keywords"
                            skills={analysis.missingKeywords}
                            color="bg-red-600"
                        />

                    </div>

                </section>

                {/* Feedback */}

                <section className="space-y-6">

                    <h2 className="text-2xl font-bold text-white">

                        Detailed Feedback

                    </h2>

                    <TextCard
                        title="Strengths"
                        content={analysis.strengths}
                    />

                    <TextCard
                        title="Weaknesses"
                        content={analysis.weaknesses}
                    />

                    <TextCard
                        title="Suggestions"
                        content={analysis.suggestions}
                    />

                </section>

            </div>

        </div>

    );

}

export default ATSReport;