import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-50 pt-6 sm:justify-center sm:pt-0 dark:bg-gradient-to-br dark:from-[#0f172a] dark:to-[#1e293b]">
            <div className="transition-transform duration-500 hover:scale-105">
                <Link href="/">
                    <ApplicationLogo className="h-24 w-24 fill-current text-indigo-600 dark:text-indigo-400 drop-shadow-2xl" />
                </Link>
            </div>

            <div className="mt-8 w-full overflow-hidden bg-white px-8 py-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:max-w-md sm:rounded-2xl dark:bg-[#1e293b]/50 dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:border dark:border-white/[0.05] dark:ring-1 dark:ring-white/[0.1]">
                <div className="relative z-10">{children}</div>
            </div>
        </div>
    );
}
