import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, errorMessage, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
{/* success message */}
            {status && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm font-semibold text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-top-1">
                    {status}
                </div>
            )}

            {/* error message */}
            {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email Address"
                        className="dark:text-slate-300"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 transition-all duration-300 shadow-inner"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError
                        message={errors.email}
                        className="mt-2 font-medium"
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="dark:text-slate-300"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 transition-all duration-300 shadow-inner"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError
                        message={errors.password}
                        className="mt-2 font-medium"
                    />
                </div>

                <div className="flex items-center justify-between mt-6">
                    <label className="flex items-center group cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="dark:bg-slate-900 dark:border-slate-700"
                        />
                        <span className="ms-2 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                            Keep me logged in
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="mt-8 ">
                    <PrimaryButton
                        className="w-full justify-center py-3 !text-white  bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 border-none shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all"
                        disabled={processing}
                    >
                        Sign in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
