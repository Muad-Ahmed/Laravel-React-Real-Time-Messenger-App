import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Toast({}) {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("toast.show", (message) => {
            const uuid = uuidv4();

            setToasts((oldToasts) => [...oldToasts, { message, uuid }]);

            setTimeout(() => {
                setToasts((oldToasts) =>
                    oldToasts.filter((toast) => toast.uuid !== uuid),
                );
            }, 5000);
        });
    }, [on]);

    return (
        <div className="toast toast-top toast-end min-w-[320px] w-full xs:w-auto p-4 pointer-events-none space-y-3 z-[100]">
            {toasts.map((toast, index) => (
                <div
                    key={toast.uuid}
                    className="alert pointer-events-auto bg-gradient-to-r from-emerald-600 to-teal-700 py-3.5 px-5 text-white font-medium rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 animate-in slide-in-from-right-5 duration-300"
                >
                    <div className="flex items-center gap-2">
                        <div className="bg-white/20 rounded-full p-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <span className="tracking-wide">{toast.message}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
