import { Link, usePage } from "@inertiajs/react";
import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import GroupDescriptionPopover from "./GroupDescriptionPopover";
import GroupUsersPopover from "./GroupUsersPopover";
import { useEventBus } from "../../EventBus";
import { useState } from "react";
import DeleteGroupModal from "./DeleteGroupModal";

const ConversationHeader = ({ selectedConversation }) => {
    const authUser = usePage().props.auth.user;
    const { emit } = useEventBus();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const onDeleteGroup = () => {
        setIsDeleteOpen(true);
    };

    const confirmDeleteGroup = () => {
        setIsDeleteOpen(false);
        console.log("action arrived");
        axios
            .delete(route("group.destroy", selectedConversation.id))
            .then((res) => {
                emit("toast.show", res.data.message);
            })
            .catch(console.log);
    };

    return (
        <>
            {selectedConversation && (
                <div className="px-2 sm:px-4 py-2 flex justify-between items-center border-b border-white/[0.05] bg-gradient-to-b from-slate-800/50 to-slate-900/80 shadow-lg min-w-0">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 ">
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden text-slate-400 hover:text-white transition-colors duration-200 flex-shrink-0"
                        >
                            <ArrowLeftIcon className="w-6 sm:w-7" />
                        </Link>
                        {selectedConversation.is_user && (
                            <div className="ring-2 max-h-11 ring-indigo-500/20 rounded-full p-0.5 flex-shrink-0">
                                <UserAvatar user={selectedConversation} />
                            </div>
                        )}
                        {selectedConversation.is_group && (
                            <div className="ring-2 ring-emerald-500/20 rounded-full p-0.5 flex-shrink-0">
                                <GroupAvatar />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h3 className="font-extrabold text-white tracking-tight text-sm sm:text-lg leading-tight truncate">
                                {selectedConversation.name}
                            </h3>
                            {selectedConversation.is_group && (
                                <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></span>
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                    {selectedConversation.is_group && (
                        <div className="flex  gap-1 sm:gap-2 bg-black/20 p-1 sm:p-1.5 rounded-xl border border-white/[0.03] flex-shrink-0 ml-2">
                            <GroupDescriptionPopover
                                description={selectedConversation.description}
                            />
                            <GroupUsersPopover
                                users={selectedConversation.users}
                            />

                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                    <div
                                        className="tooltip tooltip-left before:text-xs mt-1 sm:mt-0 "
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            onClick={(ev) =>
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversation,
                                                )
                                            }
                                            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
                                        >
                                            <PencilSquareIcon className="w-4 sm:w-5" />
                                        </button>
                                    </div>

                                    <div
                                        className="tooltip tooltip-left before:text-xs  mt-1 sm:mt-0 "
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            onClick={onDeleteGroup}
                                            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                        >
                                            <TrashIcon className="w-4 sm:w-5" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
            <DeleteGroupModal
                open={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDeleteGroup}
            />
        </>
    );
};

export default ConversationHeader;
