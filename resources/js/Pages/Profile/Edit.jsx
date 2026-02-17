import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></span>
                    Profile Settings
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12 overflow-y-auto bg-slate-50/50 dark:bg-transparent">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    
                    {/* edit personal information section*/}
                    <div className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:rounded-3xl sm:p-10 border border-slate-100 dark:border-white/[0.05] ring-1 ring-black/[0.01] dark:ring-white/[0.02]">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* update password section*/}
                    <div className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:rounded-3xl sm:p-10 border border-slate-100 dark:border-white/[0.05] ring-1 ring-black/[0.01] dark:ring-white/[0.02]">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* delete account section*/}
                    <div className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:rounded-3xl sm:p-10 border border-slate-100 dark:border-rose-500/10 ring-1 ring-black/[0.01] dark:ring-rose-500/5">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}