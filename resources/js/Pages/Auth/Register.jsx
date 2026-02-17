import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form
                onSubmit={submit}
                className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
                <div className="group">
                    <InputLabel
                        htmlFor="name"
                        value="Full Name"
                        className="group-focus-within:text-indigo-500 transition-colors"
                    />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1.5 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 transition-all duration-300 shadow-inner"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    <InputError
                        message={errors.name}
                        className="mt-2 font-medium"
                    />
                </div>

                <div className="group">
                    <InputLabel
                        htmlFor="email"
                        value="Email Address"
                        className="group-focus-within:text-indigo-500 transition-colors"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 transition-all duration-300 shadow-inner"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />

                    <InputError
                        message={errors.email}
                        className="mt-2 font-medium"
                    />
                </div>

                <div className="group">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="group-focus-within:text-indigo-500 transition-colors"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 transition-all duration-300 shadow-inner"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
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
                        className="group-focus-within:text-indigo-500 transition-colors"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1.5 block w-full dark:bg-slate-950/40 dark:border-white/10 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 transition-all duration-300 shadow-inner"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 font-medium"
                    />
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <Link
                        href={route("login")}
                        className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-md"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton
                        className="ms-4 !text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 border-none shadow-lg shadow-indigo-500/25 active:scale-95 transition-all px-6 py-2.5"
                        disabled={processing}
                    >
                        Create Account
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
