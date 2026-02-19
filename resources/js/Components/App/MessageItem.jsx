import { usePage } from "@inertiajs/react";
import ReactMarkdown from "react-markdown";
import React from "react";
import UserAvatar from "./UserAvatar";
import { formatMessageDateLong } from "@/helpers";
import MessageAttachments from "./MessageAttachments";
import MessageOptionsDropdown from "./MessageOptionsDropdown";

const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;

    return (
        <div
            className={
                "chat " +
                (message.sender_id === currentUser.id
                    ? "chat-end mb-2"
                    : "chat-start mt-4 mb-2")
            }
        >
            <div className="chat-image avatar drop-shadow-md">
                <UserAvatar user={message.sender} />
            </div>

            <div className="chat-header mb-1 tracking-tight">
                {message.sender_id !== currentUser.id ? (
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {message.sender.name}
                    </span>
                ) : (
                    ""
                )}
                <time className="text-[10px] font-medium opacity-50 ml-2 capitalize">
                    {formatMessageDateLong(message.created_at)}
                </time>
            </div>

            <div
                className={
                    "chat-bubble relative border-t border-white/10 shadow-lg " +
                    (message.sender_id === currentUser.id
                        ? "chat-bubble-info bg-gradient-to-br from-[#00b6ff] to-[#00b6ff]/90  sm:text-[16.5px]  shadow-info/20"
                        : "bg-[#273246] bg-gradient-to-b from-[#2d3a54] to-[#273246  text-white shadow-black/20 border-l border-white/5")
                }
            >
                {message.sender_id == currentUser.id && (
                    <div className="opacity-60 hover:opacity-100 transition-opacity">
                        <MessageOptionsDropdown message={message} />
                    </div>
                )}

                <div className="chat-message">
                    <div className="chat-message-content prose prose-sm max-w-none prose-invert font-normal leading-relaxed">
                        <ReactMarkdown>{message.message}</ReactMarkdown>
                    </div>

                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-1 rounded-lg border border-white/5 bg-black/10 overflow-hidden">
                            <MessageAttachments
                                attachments={message.attachments}
                                attachmentClick={attachmentClick}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
