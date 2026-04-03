import React, { useEffect, useRef } from "react";

const NewMessageInput = ({ value, onChange, onSend }) => {
    const inputRef = useRef(null);
    const rafRef = useRef(null);
    const debounceRef = useRef(null);
    const roRef = useRef(null);
    const lastHeightRef = useRef(0);

    const MAX_HEIGHT = 160; // px

    const adjustHeight = () => {
        if (!inputRef.current) return;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const el = inputRef.current;

            el.style.height = "auto";

            const scrollHeight = el.scrollHeight;
            const newHeight = Math.min(scrollHeight, MAX_HEIGHT);

            if (lastHeightRef.current === newHeight) {
                el.style.height = `${newHeight}px`;
                return;
            }

            lastHeightRef.current = newHeight;

            el.style.height = `${newHeight}px`;
            el.style.overflowY = scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
        });
    };

    const onInputKeyDown = (ev) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            onSend();
        }
    };

    const onChangeEvent = (ev) => {
        onChange(ev);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(adjustHeight, 30);
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;

        const isMobile = window.innerWidth < 768;

        if (!isMobile && typeof ResizeObserver !== "undefined") {
            roRef.current = new ResizeObserver(() => {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(adjustHeight, 40);
            });
            roRef.current.observe(el);
        }

        const onWindowResize = () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(adjustHeight, 60);
        };

        window.addEventListener("resize", onWindowResize);
        window.addEventListener("orientationchange", onWindowResize);

        // clear
        return () => {
            if (roRef.current) roRef.current.disconnect();
            window.removeEventListener("resize", onWindowResize);
            window.removeEventListener("orientationchange", onWindowResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    return (
        <textarea
            ref={inputRef}
            value={value}
            rows={1}
            placeholder="Type a message..."
            onKeyDown={onInputKeyDown}
            onChange={onChangeEvent}
            className="w-full resize-none py-3 px-5 
                       bg-white/5 dark:bg-slate-800/40 
                       text-slate-900 dark:text-slate-100 
                       placeholder-slate-500 dark:placeholder-slate-400
                       border border-slate-200 dark:border-white/[0.08] 
                       rounded-2xl rounded-r-none
                       focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                       focus:bg-white dark:focus:bg-slate-800 
                       shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]
                       transition-all duration-200 custom-scrollbar box-border"
            style={{ overflowY: "hidden" }}
        />
    );
};

export default NewMessageInput;
