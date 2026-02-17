import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Delete Account
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Delete Account
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form
                    onSubmit={deleteUser}
                    className="p-8 bg-white dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-transparent dark:border-white/[0.05]"
                >
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Please enter your
                        password to confirm you would like to permanently delete
                        your account.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 block w-full sm:w-3/4 dark:bg-slate-950/50 dark:border-white/10 focus:ring-rose-500/20"
                            isFocused
                            placeholder="Confirm with your password"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2 font-medium"
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton
                            onClick={closeModal}
                            className="dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 border-none shadow-none"
                        >
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            className="shadow-lg shadow-rose-500/20 active:scale-95 transition-transform"
                            disabled={processing}
                        >
                            Permanently Delete
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
