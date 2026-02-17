import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
} from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

export default function GroupDescriptionPopover({ description }) {
    return (
        <Popover className="relative p-2 hidden xs:block">
            {({ open }) => (
                <>
                    <PopoverButton
                        className={`${
                            open
                                ? "text-indigo-400 scale-110"
                                : "text-slate-400"
                        } hover:text-indigo-300 transition-all duration-200 outline-none`}
                    >
                        <ExclamationCircleIcon className="w-5" />
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
                        <PopoverPanel className="absolute right-0 z-50 mt-4 w-[320px] px-4 sm:px-0">
                            <div className="overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/[0.08] ring-1 ring-white/[0.05]">
                                <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-5">
                                    <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                                        Description
                                    </h2>

                                    {description && (
                                        <div className="text-sm leading-relaxed text-slate-200 bg-black/20 p-3 rounded-xl border border-white/[0.03]">
                                            {description}
                                        </div>
                                    )}

                                    {!description && (
                                        <div className="text-sm italic text-slate-500 text-center py-6 bg-black/10 rounded-xl border border-dashed border-white/10">
                                            No description is defined.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
