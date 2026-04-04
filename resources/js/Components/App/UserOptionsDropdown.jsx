import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import {
    EllipsisVerticalIcon,
    LockClosedIcon,
    LockOpenIcon,
    ShieldCheckIcon,
    UserIcon,
} from "@heroicons/react/24/solid";
import { useEventBus } from "../../EventBus";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import axios from "axios";

export default function UserOptionsDropdown({ conversation }) {
    const isMobile = useMediaQuery("(max-width: 640px)");
    const [mobileOpen, setMobileOpen] = useState(false);
    const { emit } = useEventBus();

    const changeUserRole = () => {
        if (!conversation.is_user) return;
        axios
            .post(route("user.changeRole", conversation.id))
            .then((res) => emit("toast.show", res.data.message))
            .catch(console.error);
    };

    const onBlockUser = () => {
        if (!conversation.is_user) return;
        axios
            .post(route("user.blockUnblock", conversation.id))
            .then((res) => emit("toast.show", res.data.message))
            .catch(console.error);
    };

    if (isMobile) {
        return (
            <>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setMobileOpen(true);
                    }}
                    className="flex justify-center items-center w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
                >
                    <EllipsisVerticalIcon className="w-5 h-5" />
                </button>

                <MobileUserActions
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    conversation={conversation}
                    onBlockUser={onBlockUser}
                    changeUserRole={changeUserRole}
                />
            </>
        );
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                className="flex justify-center items-center w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 outline-none"
            >
                <EllipsisVerticalIcon className="h-5 w-5" />
            </MenuButton>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems
                    anchor="bottom end"
                    className="w-52 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-white/[0.08] shadow-2xl z-50 focus:outline-none overflow-hidden"
                >
                    <div className="p-1.5 space-y-0.5">
                        <MenuItem>
                            {({ focus }) => (
                                <button
                                    onClick={onBlockUser}
                                    className={`${focus ? "bg-white/[0.05] text-white" : "text-slate-300"} group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors`}
                                >
                                    {conversation.blocked_at ? (
                                        <>
                                            {" "}
                                            <LockOpenIcon className="w-4 h-4 mr-3 text-emerald-500" />{" "}
                                            Unblock User{" "}
                                        </>
                                    ) : (
                                        <>
                                            {" "}
                                            <LockClosedIcon className="w-4 h-4 mr-3 text-rose-500" />{" "}
                                            Block User{" "}
                                        </>
                                    )}
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ focus }) => (
                                <button
                                    onClick={changeUserRole}
                                    className={`${focus ? "bg-white/[0.05] text-white" : "text-slate-300"} group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors`}
                                >
                                    {conversation.is_admin ? (
                                        <>
                                            {" "}
                                            <UserIcon className="w-4 h-4 mr-3 text-amber-500" />{" "}
                                            Make Regular User{" "}
                                        </>
                                    ) : (
                                        <>
                                            {" "}
                                            <ShieldCheckIcon className="w-4 h-4 mr-3 text-sky-400" />{" "}
                                            Make Admin{" "}
                                        </>
                                    )}
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Transition>
        </Menu>
    );
}

function MobileUserActions({
    open,
    onClose,
    conversation,
    onBlockUser,
    changeUserRole,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end">
            <div
                className="absolute inset-0 bg-black/80 lg:backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative w-full rounded-t-2xl bg-slate-900 border-t border-white/10 p-4 pb-8 animate-in slide-in-from-bottom duration-300">
                <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-6" />
                <div className="space-y-3">
                    <button
                        onClick={() => {
                            onBlockUser();
                            onClose();
                        }}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        {conversation.blocked_at ? (
                            <>
                                {" "}
                                <LockOpenIcon className="w-6 h-6 text-emerald-500" />{" "}
                                Unblock User{" "}
                            </>
                        ) : (
                            <>
                                {" "}
                                <LockClosedIcon className="w-6 h-6 text-rose-500" />{" "}
                                Block User{" "}
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => {
                            changeUserRole();
                            onClose();
                        }}
                        className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        {conversation.is_admin ? (
                            <>
                                {" "}
                                <UserIcon className="w-6 h-6 text-amber-500" />{" "}
                                Make Regular User{" "}
                            </>
                        ) : (
                            <>
                                {" "}
                                <ShieldCheckIcon className="w-6 h-6 text-sky-400" />{" "}
                                Make Admin{" "}
                            </>
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-4 text-slate-400 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
