import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { useEventBus } from "../EventBus";
import Toast from "../Components/App/Toast";
import NewMessageNotification from "../Components/App/NewMessageNotification";
import PrimaryButton from "../Components/PrimaryButton";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import NewUserModal from "../Components/App/NewUserModal";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const conversations = usePage().props.conversations;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [showNewUserModal, setShowNewUserModal] = useState(false);
    const { emit } = useEventBus();

    // Listen to real-time message channels via Laravel Echo
    useEffect(() => {
        conversations.forEach((conversation) => {
            let channel = `message.group.${conversation.id}`;

            if (conversation.is_user) {
                channel = `message.user.${[
                    parseInt(user.id),
                    parseInt(conversation.id),
                ]
                    .sort((a, b) => a - b)
                    .join("-")}`;
            }

            Echo.private(channel)
                .error((error) => {
                    console.error(error);
                })
                .listen("SocketMessage", (e) => {
                    const message = e.message;

                    emit("message.created", message);

                    if (message.sender_id === user.id) {
                        return;
                    }
                    emit("newMessageNotification", {
                        user: message.sender,
                        group_id: message.group_id,
                        message:
                            message.message ||
                            `Shared ${
                                message.attachments.length === 1
                                    ? "an attachment"
                                    : message.attachments.length +
                                      " attachments"
                            }`,
                    });
                });

            if (conversation.is_group) {
                Echo.private(`group.deleted.${conversation.id}`)
                    .listen("GroupDeleted", (e) => {
                        console.log("GroupDeleted", e);
                        emit("group.deleted", { id: e.id, name: e.name });
                    })
                    .error((e) => {
                        console.error(e);
                    });
            }
        });

        return () => {
            conversations.forEach((conversation) => {
                let channel = `message.group.${conversation.id}`;

                if (conversation.is_user) {
                    channel = `message.user.${[
                        parseInt(user.id),
                        parseInt(conversation.id),
                    ]
                        .sort((a, b) => a - b)
                        .join("-")}`;
                }
                Echo.leave(channel);

                if (conversation.is_group) {
                    Echo.leave(`group.deleted.${conversation.id}`);
                }
            });
        };
    }, [conversations]);

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-[#0b0e14] flex flex-col h-screen transition-colors duration-500">
                <nav className="border-b border-gray-200 bg-white/90 dark:border-white/[0.05] dark:bg-[#11141d]/80 sticky top-0 z-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <Link
                                        href="/"
                                        className="hover:opacity-80 transition-opacity"
                                    >
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-indigo-600 dark:text-indigo-500" />
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route("dashboard")}
                                        active={route().current("dashboard")}
                                        className="inline-flex items-center px-1 pt-1 text-sm font-bold leading-5 transition duration-150 ease-in-out"
                                    >
                                        Dashboard
                                    </NavLink>
                                </div>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center gap-4">
                                <div className="relative flex ms-3 items-center gap-3">
                                    {user.is_admin && (
                                        <PrimaryButton
                                            onClick={(ev) => {
                                                setShowNewUserModal(true);
                                            }}
                                            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 border-none shadow-lg shadow-indigo-500/20 active:scale-95 transition-all py-2 font-bold"
                                        >
                                            <UserPlusIcon className="h-4 w-4 mr-2" />
                                            Add New User
                                        </PrimaryButton>
                                    )}

                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-lg border border-gray-300 dark:border-white/10 bg-white px-4 py-2 text-sm font-bold leading-4 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none dark:bg-[#1a1f2b] dark:text-gray-200 dark:hover:bg-[#242a38] dark:hover:text-white shadow-sm"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4 opacity-60"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content className="dark:bg-[#1a1f2b] dark:border-white/10 shadow-2xl">
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                                className="font-medium"
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-xl p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:outline-none dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                                >
                                    <svg
                                        className="h-7 w-7"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            (showingNavigationDropdown ? "block" : "hidden") +
                            " sm:hidden bg-white dark:bg-[#11141d] border-t dark:border-white/5 animate-in slide-in-from-top-2 duration-200"
                        }
                    >
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                                className="font-bold"
                            >
                                Dashboard
                            </ResponsiveNavLink>
                        </div>

                        <div className="border-t border-gray-200 pb-1 pt-4 dark:border-white/5">
                            <div className="px-4">
                                <div className="text-base font-bold text-gray-800 dark:text-gray-100">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route("profile.edit")}
                                    className="font-medium"
                                >
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                    className="font-medium text-red-500"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-white/50 shadow-sm border-b border-gray-100 dark:bg-[#11141d]/50 dark:border-white/[0.03] backdrop-blur-sm">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <div className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                {header}
                            </div>
                        </div>
                    </header>
                )}

                {/* <main className="flex-1 overflow-hidden">{children}</main> */}
                {children}
            </div>
            <Toast />
            <NewMessageNotification />
            <NewUserModal
                show={showNewUserModal}
                onClose={(ev) => setShowNewUserModal(false)}
            />
        </>
    );
}
