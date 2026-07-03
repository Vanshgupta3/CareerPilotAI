import { useEffect, useRef, useState } from "react";

function useSpeechRecognition() {

    const [isListening, setIsListening] = useState(false);

    const [transcript, setTranscript] = useState("");

    const recognitionRef = useRef(null);

    useEffect(() => {

        if (

            !("webkitSpeechRecognition" in window) &&
            !("SpeechRecognition" in window)

        ) {

            return;

        }

        const SpeechRecognition =

            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();

        recognition.continuous = true;

        recognition.interimResults = true;

        recognition.lang = "en-US";

        recognition.onstart = () => {

            setIsListening(true);

        };

        recognition.onend = () => {

            setIsListening(false);

        };

        recognition.onresult = (event) => {

            let finalTranscript = "";

            for (

                let i = 0;

                i < event.results.length;

                i++

            ) {

                finalTranscript += event.results[i][0].transcript;

            }

            setTranscript(finalTranscript);

        };

        recognitionRef.current = recognition;

    }, []);

    const startListening = () => {

        recognitionRef.current?.start();

    };

    const stopListening = () => {

        recognitionRef.current?.stop();

    };

    const resetTranscript = () => {

        setTranscript("");

    };

    return {

        transcript,

        isListening,

        startListening,

        stopListening,

        resetTranscript

    };

}

export default useSpeechRecognition;