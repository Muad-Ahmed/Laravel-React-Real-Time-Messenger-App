import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import TextInput from "../Components/TextInput";
import ConversationItem from "../Components/App/ConversationItem";
import { useEventBus } from "../EventBus";
import GroupModal from "../Components/App/GroupModal";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const { emit, on } = useEventBus();

    const isUserOnline = (userId) => onlineUsers[userId];

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            }),
        );
    };

    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                // If the message is for user
                if (
                    message.receiver_id &&
                    !u.is_group &&
                    (u.id == message.sender_id || u.id == message.receiver_id)
                ) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u;
                }

                // If the message is for group
                if (
                    message.group_id &&
                    u.is_group &&
                    u.id == message.group_id
                ) {
                    u.last_message = message.message;
                    u.last_message_date = message.created_at;
                    return u;
                }

                return u;
            });
        });
    };

    const messageDeleted = ({ prevMessage }) => {
        if (!prevMessage) {
            return;
        }
        // Find the conversation by prevMessage and updated its last_message_id and date
        messageCreated(prevMessage);
    };

    useEffect(() => {
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offModalShow = on("GroupModal.show", (group) => {
            setShowGroupModal(true);
        });

        const offGroupDelete = on("group.deleted", ({ id, name }) => {
            setLocalConversations((oldConversations) => {
                return oldConversations.filter((con) => con.id !== id);
            });

            emit("toast.show", `Group "${name}" was deleted`);

            if (
                !selectedConversation ||
                (selectedConversation.is_group && selectedConversation.id == id)
            ) {
                router.visit(route("dashboard"));
            }
        });

        return () => {
            offCreated();
            offDeleted();
            offModalShow();
            offGroupDelete();
        };
    }, [on]);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                // 1. logic of sorting blocked chats
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }

                // 2. logic of sorting chats depending on last message
                if (a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date,
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            }),
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user]),
                );

                setOnlineUsers((prevOnlineUsers) => {
                    return { ...prevOnlineUsers, ...onlineUsersObj };
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.log("error", error);
            });

        return () => {
            Echo.leave("online");
        };
    }, []);

    return (
        <>
            <div className="flex-1 w-full flex overflow-hidden bg-slate-900">
                <div
                    className={`transition-all duration-300 w-full sm:w-[240px] md:w-[320px] bg-white/[0.02] border-r border-indigo-500/30 shadow-[1px_0_15px_-4px_rgba(99,102,241,0.2)]
                    flex flex-col overflow-hidden ${
                        selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                    }`}
                >
                    <div className="flex items-center justify-between py-5 px-5">
                        <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-lg">
                            My Conversations
                        </h2>
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create new Group"
                        >
                            <button
                                onClick={() => {
                                    emit("GroupModal.show", null);
                                    setShowGroupModal(true);
                                }}
                                className="p-2.5 pt-1.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-indigo-600/20 border border-white/5 hover:border-indigo-500/50 transition-all duration-300 active:scale-95"
                            >
                                <PencilSquareIcon className="w-4 h-4 inline-block" />
                            </button>
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users and groups"
                            className="w-full bg-black/40 border-white/5 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl py-2.5 px-4 text-sm text-gray-200 placeholder-gray-500 transition-all"
                        />
                    </div>
                    <div className="flex-1 overflow-auto px-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
                        {/* Here */}
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <div
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "user_"
                                    }${conversation.id}`}
                                    className="rounded-xl transition-colors hover:bg-white/5 border border-transparent hover:border-white/5 active:bg-white/[0.02]"
                                >
                                    <ConversationItem
                                        conversation={conversation}
                                        online={!!isUserOnline(conversation.id)}
                                        selectedConversation={
                                            selectedConversation
                                        }
                                    />
                                </div>
                            ))}
                    </div>
                </div>
                {/* Main Chat Area: Slightly lighter than sidebar for distinction */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.01]">
                    {children}
                </div>
            </div>
            <GroupModal
                show={showGroupModal}
                onClose={() => setShowGroupModal(false)}
            />
        </>
    );
};

export default ChatLayout;
