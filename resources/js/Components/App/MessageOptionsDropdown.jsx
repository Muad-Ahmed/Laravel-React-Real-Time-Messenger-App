import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEventBus } from "../../EventBus";

export default function MessageOptionsDropdown({ message }) {
    const { emit } = useEventBus();

    const onMessageDelete = () => {
        axios
            .delete(route("message.destroy", message.id))
            .then((res) => {
                emit("message.deleted", {
                    message,
                    prevMessage: res.data.message,
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <div className="absolute right-full text-slate-200 top-1/2 -translate-y-1/2 z-20 px-2">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <MenuButton className="flex justify-center items-center w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-90">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </MenuButton>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <MenuItems className="absolute left-0 mt-2 w-36 origin-top-left rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/[0.08] ring-1 ring-white/[0.05] z-50 focus:outline-none">
                        <div className="p-1.5">
                            <MenuItem>
                                {({ focus }) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={` ${
                                            focus
                                                ? "bg-red-500/10 text-red-400"
                                                : "text-slate-300"
                                        } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150`}
                                    >
                                        <TrashIcon
                                            className={`w-4 h-4 mr-2.5 ${focus ? "text-red-400" : "text-slate-400"}`}
                                        />
                                        Delete
                                    </button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>
        </div>
    );
}
