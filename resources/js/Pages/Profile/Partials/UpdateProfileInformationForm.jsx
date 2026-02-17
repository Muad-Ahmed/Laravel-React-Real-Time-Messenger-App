import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import UserAvatar from "../../../Components/App/UserAvatar";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            avatar: null,
            email: user.email,
            _method: "PATCH",
        });

    const submit = (e) => {
        e.preventDefault();

        post(route("profile.update"));
    };

    return (
        <section className={`${className} animate-in fade-in duration-500`}>
            <header>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Profile Information
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-7">
                <div className="flex items-center gap-6 drop-shadow-xl">
                    <UserAvatar user={user} profile={true} />
                </div>

                <div>
                    <InputLabel htmlFor="avatar" value="Profile Picture" className="mb-2" />

                    <input
                        id="avatar"
                        type="file"
                        className="file-input file-input-bordered w-full max-w-xs bg-white dark:bg-slate-950/40 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 transition-all focus:ring-2 focus:ring-indigo-500/20"
                        onChange={(e) => setData("avatar", e.target.files[0])}
                    />
                    <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-500 italic">
                        Recommended: Square image (e.g., 512px &times; 512px)
                    </p>

                    <InputError className="mt-2" message={errors.avatar} />
                </div>

                <div className="group">
                    <InputLabel htmlFor="name" value="Full Name" className="group-focus-within:text-indigo-500 transition-colors" />

                    <TextInput
                        id="name"
                        className="mt-2 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 shadow-inner transition-all"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div className="group">
                    <InputLabel htmlFor="email" value="Email Address" className="group-focus-within:text-indigo-500 transition-colors" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-2 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 shadow-inner transition-all"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
                        <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="ml-2 rounded-lg px-2 py-1 text-sm text-amber-700 underline decoration-amber-500/30 hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-amber-400 dark:hover:text-amber-200 transition-all"
                            >
                                Re-send verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                                ✓ A new verification link has been sent.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-5 pt-2">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 border-none shadow-lg shadow-indigo-500/25 active:scale-95 transition-all px-8 py-2.5"
                    >
                        Save Changes
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-x-[-10px]"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Profile updated.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}