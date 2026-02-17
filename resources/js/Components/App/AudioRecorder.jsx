import { MicrophoneIcon, StopCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const AudioRecorder = ({ fileReady }) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recording, setRecording] = useState(false);

    const onMicrophoneClick = async () => {
        if (recording) {
            setRecording(false);
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
            return;
        }

        setRecording(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const newMediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            newMediaRecorder.addEventListener("dataavailable", (event) => {
                chunks.push(event.data);
            });

            newMediaRecorder.addEventListener("stop", () => {
                let audioBlob = new Blob(chunks, {
                    type: "audio/ogg; codecs=opus",
                });

                let audioFile = new File([audioBlob], "recorded_audio.ogg", {
                    type: "audio/ogg; codecs=opus",
                });

                const url = URL.createObjectURL(audioFile);

                fileReady(audioFile, url);
            });

            newMediaRecorder.start();
            setMediaRecorder(newMediaRecorder);
        } catch (error) {
            setRecording(false);
            console.error("Error accessing microphone:", error);
        }
    };

    return (
        <button
            onClick={onMicrophoneClick}
            className={`p-2 rounded-full transition-all duration-300 outline-none active:scale-90 ${
                recording
                    ? "bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    : "hover:bg-white/10 text-slate-400 hover:text-indigo-400"
            }`}
        >
            {recording && (
                <StopCircleIcon className="w-6 h-6 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            )}
            {!recording && (
                <MicrophoneIcon className="w-6 h-6 transition-colors" />
            )}
        </button>
    );
};

export default AudioRecorder;
