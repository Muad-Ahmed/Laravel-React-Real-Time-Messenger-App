import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";

const CustomAudioPlayer = ({ file, showVolume = true }) => {
    const audioRef = useRef(); 
    const [isPlaying, setIsPlaying] = useState(false); 
    const [volume, setVolume] = useState(1); 
    const [duration, setDuration] = useState(0); 
    const [currentTime, setCurrentTime] = useState(0); 

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
        <div className="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl bg-gradient-to-b from-slate-800/90 to-slate-900 border-t border-white/10 shadow-xl shadow-black/20">
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
            <button
                onClick={togglePlayPause}
                className="flex-shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 group focus:outline-none"
            >
                {isPlaying && (
                    <PauseCircleIcon className="w-9 h-9 text-indigo-400 group-hover:text-indigo-300 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                )}
                {!isPlaying && (
                    <PlayCircleIcon className="w-9 h-9 text-slate-300 group-hover:text-white drop-shadow-md" />
                )}
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
                    className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all opacity-60 hover:opacity-100"
                />
            )}

            {/* Playback progress and seeking slider */}
            <input
                type="range"
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 shadow-inner"
                min="0"
                max={duration}
                step="0.01"
                value={currentTime}
                onChange={handleSeekChange}
            />

            <span className="text-[10px] font-mono font-medium text-slate-400 tabular-nums">
                {Math.floor(currentTime / 60)}:
                {Math.floor(currentTime % 60)
                    .toString()
                    .padStart(2, "0")}
            </span>
        </div>
    );
};

export default CustomAudioPlayer;
