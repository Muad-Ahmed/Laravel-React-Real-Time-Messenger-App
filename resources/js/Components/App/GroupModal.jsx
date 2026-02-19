import TextAreaInput from "@/Components/TextAreaInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import UserPicker from "@/Components/App/UserPicker";
import { useForm, usePage } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";

export default function GroupModal({ show = false, onClose = () => {} }) {
    const page = usePage();
    const conversations = page.props.conversations;
    const { on, emit } = useEventBus();
    const [group, setGroup] = useState({});

    const { data, setData, processing, reset, post, put, errors } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });

    const users = conversations.filter((c) => !c.is_group);

    const createOrUpdateGroup = (e) => {
        e.preventDefault();

        if (group.id) {
            put(route("group.update", group.id), {
                onSuccess: () => {
                    closeModal();
                    emit("toast.show", `Group "${data.name}" was updated`);
                },
            });
            return;
        }

        post(route("group.store"), {
            onSuccess: () => {
                emit("toast.show", `Group "${data.name}" was created`);
                closeModal();
            },
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    useEffect(() => {
        return on("GroupModal.show", (group) => {
            if (!group) {
                setGroup({});
                reset(); 
                return;
            }

            setGroup(group);
            setData({
                name: group.name,
                description: group.description,
                user_ids: group.users
                    .filter((u) => group.owner_id !== u.id)
                    .map((u) => u.id),
            });
        });
    }, [on]);

    return (
        <Modal show={show} onClose={closeModal}>
            <form
                onSubmit={createOrUpdateGroup}
                className="p-8 overflow-y-visible bg-white dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl border border-white/10"
            >
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-cyan-400">
                    {group.id
                        ? `Edit Group "${group.name}"`
                        : "Create New Group"}
                </h2>

                <div className="mt-8 space-y-6">
                    {/*  name section */}
                    <div className="relative group">
                        <InputLabel
                            htmlFor="name"
                            value="Group Name"
                            className="text-indigo-500 dark:text-indigo-400 font-semibold mb-1"
                        />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 rounded-xl transition-all"
                            value={data.name}
                            disabled={!!group.id}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            isFocused
                        />

                        <InputError
                            className="mt-2 text-xs"
                            message={errors.name}
                        />
                    </div>

                    {/* description section  */}
                    <div>
                        <InputLabel
                            htmlFor="description"
                            value="Description"
                            className="text-indigo-500 dark:text-indigo-400 font-semibold mb-1"
                        />

                        <TextAreaInput
                            id="description"
                            rows="3"
                            className="mt-1 block w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 rounded-xl transition-all"
                            value={data.description || ""}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />

                        <InputError
                            className="mt-2 text-xs"
                            message={errors.description}
                        />
                    </div>

                    {/*  select users section  */}
                    <div className="p-4 bg-slate-100 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
                        <InputLabel
                            value="Select Team Members"
                            className="text-slate-600 dark:text-slate-400 font-bold mb-3 uppercase text-[10px] tracking-widest"
                        />

                        <UserPicker
                            value={
                                users.filter(
                                    (u) =>
                                        group.owner_id !== u.id &&
                                        data.user_ids.includes(u.id),
                                ) || []
                            }
                            options={users}
                            onSelect={(users) =>
                                setData(
                                    "user_ids",
                                    users.map((u) => u.id),
                                )
                            }
                        />

                        <InputError
                            className="mt-2 text-xs"
                            message={errors.user_ids}
                        />
                    </div>
                </div>

                {/* buttons section  */}
                <div className="mt-10 flex justify-end items-center gap-4">
                    <SecondaryButton
                        onClick={closeModal}
                        className="border-none hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors uppercase text-xs font-bold tracking-widest"
                    >
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 border-none rounded-xl transition-all active:scale-95 disabled:opacity-50"
                        disabled={processing}
                    >
                        {group.id ? "Update Changes" : "Create Group"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
