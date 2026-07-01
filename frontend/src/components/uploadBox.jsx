import { useRef } from "react";
import toast from "react-hot-toast";

function UploadBox({

    title,
    description,
    buttonText,
    selectedFile,
    onFileSelect,
    onAnalyze,
    loading

}) {

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {

        fileInputRef.current?.click();

    };

    const handleFileChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        if (file.type !== "application/pdf") {

            toast.error("Please select a PDF file.");

            fileInputRef.current.value = "";

            return;

        }

        onFileSelect(file);

    };

    const handleRemove = () => {

        onFileSelect(null);

        fileInputRef.current.value = "";

        toast.success("Resume removed.");

    };

    return (

        <div className="bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center hover:border-blue-500 transition">

            <div className="text-6xl">

                📄

            </div>

            <h2 className="text-3xl font-bold text-white mt-6">

                {title}

            </h2>

            <p className="text-slate-400 mt-3">

                {description}

            </p>

            <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            <button
                onClick={handleButtonClick}
                disabled={loading}
                className="mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed px-8 py-3 rounded-xl text-white font-semibold transition"
            >

                {buttonText}

            </button>

            {selectedFile && (

                <div className="mt-8 bg-slate-800 rounded-xl p-5">

                    <p className="text-green-400 font-semibold">

                        ✅ Ready for Analysis

                    </p>

                    <p className="text-white mt-2">

                        {selectedFile.name}

                    </p>

                    <p className="text-slate-400 text-sm mt-1">

                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB

                    </p>

                    <div className="flex justify-center gap-4 mt-6">

                        <button
                            onClick={handleRemove}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed px-5 py-2 rounded-lg text-white transition"
                        >

                            Remove

                        </button>

                        <button
                            onClick={onAnalyze}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed px-5 py-2 rounded-lg text-white transition"
                        >

                            {loading ? "Uploading..." : "Analyze Resume"}

                        </button>

                    </div>

                </div>

            )}

            <p className="text-slate-500 text-sm mt-6">

                Supported format: PDF • Maximum size: 5 MB

            </p>

        </div>

    );

}

export default UploadBox;