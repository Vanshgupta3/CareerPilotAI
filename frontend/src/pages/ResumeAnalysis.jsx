import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import CurrentResumeCard from "../components/CurrentResumeCard";


import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authService";
import {
    uploadResume,
    analyzeResume
} from "../services/resumeService";

function ResumeAnalysis() {

    const navigate = useNavigate();

    const { token } = useAuth();

    const [selectedFile, setSelectedFile] = useState(null);

    const [currentResume, setCurrentResume] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isReplacing, setIsReplacing] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {

        try {

            const result = await getProfile(token);

            setCurrentResume(result.resume);

setAnalysis(result.analysis);

        } catch (error) {

            console.error(error);

        } finally {

            setPageLoading(false);

        }

    };

    useEffect(() => {

        fetchProfile();

    }, []);

    const handleAnalyze = async () => {

        setLoading(true);

        try {

            // Existing resume → only analyze
            if (currentResume && !selectedFile) {

                const analysisResult = await analyzeResume(token);

                toast.success(analysisResult.message);

                navigate("/ats-report");

                return;

            }

            // New upload
            if (!selectedFile) {

                toast.error("Please select a resume first.");

                return;

            }

            const formData = new FormData();

            formData.append("resume", selectedFile);

            const uploadResult = await uploadResume(
                formData,
                token
            );

            toast.success(uploadResult.message);

            const analysisResult = await analyzeResume(token);

            toast.success(analysisResult.message);

            await fetchProfile();
setIsReplacing(false);

setSelectedFile(null);
            navigate("/ats-report");

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Resume analysis failed."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleReplace = () => {

    setIsReplacing(true);

    setSelectedFile(null);

};

    if (pageLoading) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <h1 className="text-white text-2xl">

                    Loading...

                </h1>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-950">

            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">

                <div className="mb-10">

                    <h1 className="text-4xl font-bold text-white">

                        Resume Analysis

                    </h1>

                    <p className="text-slate-400 mt-3">

                        Upload your resume and receive an AI-powered ATS score,
                        missing skills analysis, and personalized suggestions.

                    </p>

                </div>

                {currentResume && (

    <CurrentResumeCard
        resume={currentResume}
        analysis={analysis}
        onAnalyze={handleAnalyze}
        onReplace={handleReplace}
        loading={loading}
    />

)}

{(!currentResume || isReplacing) && (

    <div className="mt-8">

        <UploadBox
            title="Upload New Resume"
            description="Choose a new PDF resume to replace your current one."
            buttonText="Choose Resume"
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            onAnalyze={handleAnalyze}
            loading={loading}
        />

    </div>

)}

            </div>

        </div>

    );

}

export default ResumeAnalysis;