import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";
import Checkbox from "../Checkbox";

export default function NewUserModal({ show = false, onClose = () => {} }) {
    const { emit } = useEventBus();

    const { data, setData, processing, reset, post, errors } = useForm({
        name: "",
        email: "",
        is_admin: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("user.store"), {
            onSuccess: () => {
                emit("toast.show", `User "${data.name}" was created`);
                closeModal();
            },
        });
    };

    const closeModal = () => {
        reset();
        onClose();
    };

    return (
        <Modal show={show} onClose={closeModal}>
            <form
                onSubmit={submit}
                className="p-8 overflow-y-visible bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-white/10 shadow-2xl"
            >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-2 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                    Create New User
                </h2>

                <div className="mt-10 space-y-6">
                    {/* name section*/}
                    <div className="relative">
                        <InputLabel
                            htmlFor="name"
                            value="Full Name"
                            className="dark:text-slate-400 font-semibold ml-1 mb-1.5"
                        />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 rounded-2xl focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            isFocused
                        />
                        <InputError
                            className="mt-2 text-xs"
                            message={errors.name}
                        />
                    </div>

                    {/* email section*/}
                    <div className="relative">
                        <InputLabel
                            htmlFor="email"
                            value="Email Address"
                            className="dark:text-slate-400 font-semibold ml-1 mb-1.5"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 rounded-2xl focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError
                            className="mt-2 text-xs"
                            message={errors.email}
                        />
                    </div>

                    {/* admin section*/}
                    <div className="mt-6 p-4 bg-indigo-500/5 dark:bg-white/[0.02] rounded-2xl border border-indigo-500/10 dark:border-white/5 transition-all hover:bg-indigo-500/10">
                        <label className="flex items-center cursor-pointer group">
                            <Checkbox
                                name="is_admin"
                                checked={data.is_admin}
                                onChange={(e) =>
                                    setData("is_admin", e.target.checked)
                                }
                                className="rounded-lg border-slate-300 dark:border-white/20 text-indigo-600 focus:ring-indigo-500/30"
                            />
                            <span className="ms-3 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-400 transition-colors">
                                Upgrade User to Admin
                            </span>
                        </label>
                        <InputError
                            className="mt-2 text-xs"
                            message={errors.is_admin}
                        />
                    </div>
                </div>

                {/* control buttons*/}
                <div className="mt-10 flex justify-end items-center gap-3">
                    <SecondaryButton
                        onClick={closeModal}
                        className="border-none hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-widest transition-all"
                    >
                        Cancel
                    </SecondaryButton>

                    <PrimaryButton
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-500/20 border-none rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
                        disabled={processing}
                    >
                        Create User
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
