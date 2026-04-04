import { useCallback, useEffect, useRef, useState } from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import ChatLayout from "../Layouts/ChatLayout";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import ConversationHeader from "../Components/App/ConversationHeader";
import MessageItem from "../Components/App/MessageItem";
import MessageInput from "../Components/App/MessageInput";
import { useEventBus } from "@/EventBus";
import AttachmentPreviewModal from "../Components/App/AttachmentPreviewModal";

function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const loadMoreIntersect = useRef(null);
    const messagesCtrRef = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const { on } = useEventBus();

    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
        if (
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id)
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
        }
    };

    const messageDeleted = ({ message }) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) => {
                return prevMessages.filter((m) => m.id !== message.id);
            });
        }
        if (
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id)
        ) {
            setLocalMessages((prevMessages) => {
                return prevMessages.filter((m) => m.id !== message.id);
            });
        }
    };

    const loadMoreMessages = useCallback(() => {
        if (noMoreMessages) {
            return;
        }
        // Find the first message object
        const firstMessage = localMessages[0];

        axios
            .get(route("message.loadOlder", firstMessage.id))
            .then(({ data }) => {
                if (data.data.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }

                // Calculate how much is scrolled from bottom and scroll to the same position
                // from bottom after messages are loaded
                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;

                const tmpScrollFromBottom =
                    scrollHeight - scrollTop - clientHeight;

                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

                setLocalMessages((prevMessages) => {
                    return [...data.data.reverse(), ...prevMessages];
                });
            });
    }, [localMessages, noMoreMessages]);

    const onAttachmentClick = (attachments, ind) => {
        setPreviewAttachment({
            attachments,
            ind,
        });

        setShowAttachmentPreview(true);
    };

    useEffect(() => {
        if (messagesCtrRef.current) {
            setTimeout(() => {
                messagesCtrRef.current.scrollTo({
                    top: messagesCtrRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }, 10);
        }
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);

        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
            offDeleted();
        };
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        // Recover scroll from bottom after messages are loaded
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessages) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages(),
                );
            },
            {
                rootMargin: "0px 0px 250px 0px",
            },
        );

        if (loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100);
        }

        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    return (
        <>
            {!messages && (
                /* Empty state */
                <div className="flex flex-col justify-center items-center text-center h-full relative overflow-hidden bg-slate-950/20 backdrop-blur-sm">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center max-w-md px-6">
                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full group-hover:bg-indigo-500/30 transition-all duration-500" />
                            <div className="relative bg-gradient-to-b from-white/10 to-white/[0.02] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-md">
                                <ChatBubbleLeftRightIcon className="w-20 h-20 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                            Choose a{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                                Conversation
                            </span>
                        </h2>

                        <p className="text-slate-400 text-lg leading-relaxed font-light">
                            Select a conversation from the sidebar to start
                            chatting. Your connections are waiting for you.
                        </p>

                        <div className="mt-10 flex gap-2">
                            <div
                                className="w-2 h-2 rounded-full bg-indigo-500/40 animate-bounce"
                                style={{ animationDelay: "0ms" }}
                            />
                            <div
                                className="w-2 h-2 rounded-full bg-indigo-500/40 animate-bounce"
                                style={{ animationDelay: "150ms" }}
                            />
                            <div
                                className="w-2 h-2 rounded-full bg-indigo-500/40 animate-bounce"
                                style={{ animationDelay: "300ms" }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto p-5 bg-black/10 shadow-inner custom-scrollbar"
                    >
                        {/* Messages */}
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-400 bg-white/5 px-6 py-2 rounded-full border border-white/5">
                                    No messages found
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex-1 flex flex-col">
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        attachmentClick={onAttachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {/* This addition might lead to issues */}
                    <div className="border-t border-white/[0.05] bg-white/[0.01]">
                        <MessageInput conversation={selectedConversation} />
                    </div>
                </>
            )}

            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
}
// That way to provide Persistent layouts in Inertia
Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};

export default Home;
