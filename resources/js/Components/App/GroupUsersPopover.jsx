import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
} from "@headlessui/react";
import { UsersIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";

export default function GroupUsersPopover({ users = [] }) {
    return (
        <Popover className="relative p-2">
            {({ open }) => (
                <>
                    <PopoverButton
                        className={`
              ${open ? "text-indigo-400 scale-110" : "text-slate-400"}
              hover:text-indigo-300 transition-all duration-200 outline-none
            `}
                    >
                        <UsersIcon className="w-5" />
                    </PopoverButton>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-2"
                    >
                        <PopoverPanel className="absolute right-0 z-50 mt-4 w-[260px] px-4 sm:px-0">
                            {/* تعديل: تطبيق تأثير الزجاج الداكن مع حدود مضيئة وظلال ناعمة */}
                            <div className="overflow-hidden rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.5)] border border-white/[0.08] ring-1 ring-white/[0.05]">
                                <div className="bg-gradient-to-b from-slate-800 to-slate-900 py-3">
                                    <div className="px-4 py-2 mb-1 border-b border-white/[0.05]">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                            Members
                                        </span>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {users.map((user) => (
                                            <Link
                                                href={route(
                                                    "chat.user",
                                                    user.id,
                                                )}
                                                key={user.id}
                                                className="flex items-center gap-3 py-2.5 px-4 transition-colors duration-150 hover:bg-white/[0.03] group"
                                            >
                                                <div className="shrink-0 group-hover:scale-105 transition-transform duration-200">
                                                    <UserAvatar user={user} />
                                                </div>
                                                <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                                                    {user.name}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
