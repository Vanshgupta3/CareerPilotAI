import { useState } from "react";

import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";

function ResumeAnalysis() {

    const [selectedFile, setSelectedFile] = useState(null);

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
                />

            </div>

        </div>

    );

}

export default ResumeAnalysis;