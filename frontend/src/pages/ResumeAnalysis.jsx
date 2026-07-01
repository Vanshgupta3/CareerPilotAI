import { useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";

import { useAuth } from "../context/AuthContext";
import { uploadResume } from "../services/resumeService";

function ResumeAnalysis() {

    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const { token } = useAuth();

    const handleAnalyze = async () => {

        if (!selectedFile) {

            toast.error("Please select a resume first.");

            return;

        }

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append("resume", selectedFile);

            const result = await uploadResume(
                formData,
                token
            );

            toast.success(result.message);

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Resume upload failed."
            );

        } finally {

            setLoading(false);

        }

    };

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
                        missing skills analysis, and personalized suggestions
                        to improve your chances of getting shortlisted.

                    </p>

                </div>

                <UploadBox
                    title="Upload Your Resume"
                    description="Drag & drop your resume or click the button below."
                    buttonText="Choose Resume"
                    selectedFile={selectedFile}
                    onFileSelect={setSelectedFile}
                    onAnalyze={handleAnalyze}
                    loading={loading}
                />

            </div>

        </div>

    );

}

export default ResumeAnalysis;