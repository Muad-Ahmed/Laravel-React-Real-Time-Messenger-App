import React, { useEffect, useRef } from "react";

const NewMessageInput = ({ value, onChange, onSend }) => {
    const input = useRef();
    const MAX_HEIGHT = 160; // 160px corresponds to max-h-40 in Tailwind

    const onInputKeyDown = (ev) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            onSend();
        }
    };

    const adjustHeight = () => {
        setTimeout(() => {
            if (input.current) {
                // 1. Reset height to get the true scrollHeight
                input.current.style.height = "auto";

                const scrollHeight = input.current.scrollHeight;

                // 2. Check if we reached the max limit
                if (scrollHeight > MAX_HEIGHT) {
                    input.current.style.height = `${MAX_HEIGHT}px`;
                    input.current.style.overflowY = "auto"; // Show scrollbar
                } else {
                    input.current.style.height = `${scrollHeight}px`;
                    input.current.style.overflowY = "hidden"; // Hide scrollbar
                }
            }
        }, 100);
    };

    const onChangeEvent = (ev) => {
        setTimeout(() => {
            adjustHeight();
        }, 10);
        onChange(ev);
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={input}
            value={value}
            rows="1"
            placeholder="Type a message..."
            onKeyDown={onInputKeyDown}
            onChange={(ev) => onChangeEvent(ev)}
            className="w-full resize-none py-3 px-5 
                       bg-white/5 dark:bg-slate-800/40 
                       text-slate-900 dark:text-slate-100 
                       placeholder-slate-500 dark:placeholder-slate-400
                       border border-slate-200 dark:border-white/[0.08] 
                       rounded-2xl rounded-r-none
                       focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                       focus:bg-white dark:focus:bg-slate-800 
                       shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]
                       transition-all duration-200 custom-scrollbar"
        ></textarea>
    );
};

export default NewMessageInput;
