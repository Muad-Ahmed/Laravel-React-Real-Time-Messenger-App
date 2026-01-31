import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";

const CustomAudioPlayer = ({ file, showVolume = true }) => {
    const audioRef = useRef(); // مرجع لعنصر الصوت HTML5
    const [isPlaying, setIsPlaying] = useState(false); // حالة التشغيل/الإيقاف
    const [volume, setVolume] = useState(1); // حالة مستوى الصوت (0 إلى 1)
    const [duration, setDuration] = useState(0); // حالة المدة الكلية للملف
    const [currentTime, setCurrentTime] = useState(0); // حالة الوقت الحالي للتشغيل

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            console.log(audio, audio.duration);
            setDuration(audio.duration);
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Handle volume slider change
    const handleVolumeChange = (e) => {
        const volume = e.target.value;
        audioRef.current.volume = volume;
        setVolume(volume);
    };

    // Update current time during playback
    const handleTimeUpdate = (e) => {
        const audio = audioRef.current;
        setDuration(audio.duration);
        setCurrentTime(e.target.currentTime);
    };

    // Get metadata like duration once loaded
    const handleLoadedMetadata = (e) => {
        setDuration(e.target.duration);
    };

    // Handle seeking to a specific time
    const handleSeekChange = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-800">
            {/* Hidden HTML5 audio element handled via ref */}
            <audio
                ref={audioRef}
                src={file.url}
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
            />

            {/* Play/Pause toggle button */}
            <button onClick={togglePlayPause}>
                {isPlaying && <PauseCircleIcon className="w-6 text-gray-400" />}
                {!isPlaying && <PlayCircleIcon className="w-6 text-gray-400" />}
            </button>

            {/* Optional volume control slider */}
            {showVolume && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                />
            )}

            {/* Playback progress and seeking slider */}
            <input
                type="range"
                className="flex-1"
                min="0"
                max={duration}
                step="0.01"
                value={currentTime}
                onChange={handleSeekChange}
            />
        </div>
    );
};

export default CustomAudioPlayer;
