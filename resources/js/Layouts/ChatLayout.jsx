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
        // mark last event (kept minimal): update local conversations immutably
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                // direct user conversation
                if (
                    message.receiver_id &&
                    !u.is_group &&
                    (u.id == message.sender_id || u.id == message.receiver_id)
                ) {
                    return {
                        ...u,
                        last_message: message.message,
                        last_message_date: message.created_at,
                    };
                }

                // group conversation
                if (
                    message.group_id &&
                    u.is_group &&
                    u.id == message.group_id
                ) {
                    return {
                        ...u,
                        last_message: message.message,
                        last_message_date: message.created_at,
                    };
                }

                return u;
            });
        });
    };

    const messageDeleted = ({ prevMessage }) => {
        if (!prevMessage) return;
        // reuse messageCreated to update last_message_date back to prev
        messageCreated(prevMessage);
    };

    // Helper: normalize date/time values to numeric epoch for reliable comparison
    const parseToEpoch = (v) => {
        if (!v) return 0;
        if (typeof v === "number") return v;
        const s = String(v).replace(/\s+UTC$/, "");
        const t = Date.parse(s);
        return isNaN(t) ? 0 : t;
    };

    useEffect(() => {
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offModalShow = on("GroupModal.show", () => {
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
        // clone before sorting to avoid mutating original array
        const arr = [...localConversations];

        arr.sort((a, b) => {
            // preserve blocked ordering logic
            if (a.blocked_at && b.blocked_at) {
                return a.blocked_at > b.blocked_at ? 1 : -1;
            } else if (a.blocked_at) {
                return 1;
            } else if (b.blocked_at) {
                return -1;
            }

            const getActivityEpoch = (c) =>
                parseToEpoch(
                    c.last_message_date ?? c.created_at ?? c.updated_at ?? null,
                );

            const aEpoch = getActivityEpoch(a);
            const bEpoch = getActivityEpoch(b);

            if (aEpoch && bEpoch) {
                return bEpoch - aEpoch;
            } else if (aEpoch) {
                return -1;
            } else if (bEpoch) {
                return 1;
            } else {
                return 0;
            }
        });

        setSortedConversations(arr);
    }, [localConversations]);

    useEffect(() => {
        // Build local conversations using composite key (type + id) to avoid collisions
        // Problem: merging by numeric `id` alone caused user/group ID collisions, copying timestamps incorrectly
        
        setLocalConversations((prev) => {
            const newLocal = [];
            const keyFor = (item) => `${item.is_group ? "g" : "u"}_${item.id}`;
            const prevByKey = new Map(prev.map((p) => [keyFor(p), p]));

            conversations.forEach((conv) => {
                const existing = prevByKey.get(keyFor(conv));
                const base = { ...conv };

                if (!existing) {
                    newLocal.push(base);
                    return;
                }

                const existingEpoch = parseToEpoch(existing.last_message_date);
                const serverEpoch = parseToEpoch(conv.last_message_date);

                if (existingEpoch > serverEpoch) {
                    base.last_message = existing.last_message;
                    base.last_message_date = existing.last_message_date;
                }

                newLocal.push(base);
            });

            return newLocal;
        });
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
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <div
                                    key={`${conversation.is_group ? "group_" : "user_"}${conversation.id}`}
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
