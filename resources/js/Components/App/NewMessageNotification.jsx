import { useEventBus } from "@/EventBus";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";

export default function NewMessageNotification({}) {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("newMessageNotification", ({ message, user, group_id }) => {
            const uuid = uuidv4();

            setToasts((oldToasts) => [
                ...oldToasts,
                { message, uuid, user, group_id },
            ]);

            setTimeout(() => {
                setToasts((oldToasts) =>
                    oldToasts.filter((toast) => toast.uuid !== uuid),
                );
            }, 5000);
        });
    }, [on]);

    return (
        <div className="toast toast-top toast-center min-w-[320px] pointer-events-none z-[100] top-4">
            {toasts.map((toast, index) => (
                <div
                    key={toast.uuid}
                    className="mb-3 pointer-events-auto overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300
                               bg-gradient-to-r from-slate-800/95 to-slate-900/95 
                               border border-emerald-500/30 ring-1 ring-white/10
                               shadow-[0_10px_30px_rgba(0,0,0,0.4)] px-4 py-3 rounded-2xl"
                >
                    <Link
                        href={
                            toast.group_id
                                ? route("chat.group", toast.group_id)
                                : route("chat.user", toast.user.id)
                        }
                        className="flex items-center gap-3 group transition-all"
                    >
                        <div className="shrink-0 group-hover:scale-110 transition-transform">
                            <UserAvatar user={toast.user} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">
                                New Message
                            </span>
                            <span className="text-sm text-slate-100 font-medium truncate group-hover:text-emerald-300 transition-colors">
                                {toast.message}
                            </span>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
