import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";
import { formatMessageDateShort } from "../../helpers";

const ConversationItem = ({
    conversation,
    selectedConversation = null,
    online = null,
}) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = " border-transparent";

    if (selectedConversation) {
        if (
            selectedConversation.id == conversation.id
        ) {
            classes =
                "border-indigo-500 bg-indigo-500/10 lg:shadow-[inset_4px_0_15px_-5px_rgba(99,102,241,0.4)]";
        }
    }

    return (
        <Link
            href={
                conversation.is_group
                    ? route("chat.group", conversation)
                    : route("chat.user", conversation)
            }
            preserveState
            className={
                "conversation-item flex items-center gap-3 p-3 text-gray-400 transition-colors duration-200 cursor-pointer border-l-[3px] hover:bg-white/[0.05] " +
                classes +
                (conversation.is_user && currentUser.is_admin
                    ? " pr-2"
                    : " pr-4")
            }
        >
            {conversation.is_user && (
                <UserAvatar user={conversation} online={online} />
            )}
            {conversation.is_group && <GroupAvatar />}

            <div
                className={
                    `flex-1 text-xs max-w-full overflow-hidden ` +
                    (conversation.is_user && conversation.blocked_at
                        ? " opacity-40"
                        : "")
                }
            >
                <div className="flex gap-1 justify-between items-center mb-1">
                    <h3 className="text-[14px] font-bold overflow-hidden text-nowrap text-ellipsis text-gray-100 tracking-tight">
                        {conversation.name}
                    </h3>
                    {conversation.last_message_date && (
                        <span className="text-[10px] text-nowrap font-medium text-gray-500 capitalize tracking-tighter">
                            {formatMessageDateShort(
                                conversation.last_message_date,
                            )}
                        </span>
                    )}
                </div>
                {conversation.last_message && (
                    <p className="text-[12px] text-nowrap overflow-hidden text-ellipsis text-gray-500 font-medium">
                        {conversation.last_message}
                    </p>
                )}
            </div>
            {!!currentUser.is_admin && conversation.is_user && (
                // <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                //     <UserOptionsDropdown conversation={conversation} />
                // </div>
                <UserOptionsDropdown conversation={conversation} />
            )}
        </Link>
    );
};

export default ConversationItem;
