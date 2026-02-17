import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`${className} animate-in fade-in duration-700`}>
            <header>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Update Password
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-8 space-y-7">
                <div className="group">
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                        className="group-focus-within:text-indigo-500 transition-colors duration-300"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        type="password"
                        className="mt-2 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 shadow-inner transition-all"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2 font-medium"
                    />
                </div>

                <div className="group">
                    <InputLabel
                        htmlFor="password"
                        value="New Password"
                        className="group-focus-within:text-indigo-500 transition-colors duration-300"
                    />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        type="password"
                        className="mt-2 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 shadow-inner transition-all"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password}
                        className="mt-2 font-medium"
                    />
                </div>

                <div className="group">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="group-focus-within:text-indigo-500 transition-colors duration-300"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        type="password"
                        className="mt-2 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 shadow-inner transition-all"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 font-medium"
                    />
                </div>

                <div className="flex items-center gap-5 pt-2">
                    <PrimaryButton
                        disabled={processing}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 border-none shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                    >
                        Update Key
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-[-10px]"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                            Changes saved successfully.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
