import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 dark:bg-gradient-to-br dark:from-[#0f172a] dark:to-[#1e293b]">
            {/* Main Wrapper:*/}
            <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-10 w-full max-w-7xl">
                {/*  Left Section (Instructions)*/}
                <div className="w-full lg:w-[30rem] animate-in fade-in slide-in-from-left-6 duration-1000">
                    <div className="p-6 rounded-[2rem] bg-indigo-500/[0.03] border border-indigo-500/10 backdrop-blur-md dark:bg-indigo-400/[0.03] dark:border-indigo-400/10 shadow-xl">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 shadow-inner flex-shrink-0 mt-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4" />
                                    <path d="M12 8h.01" />
                                </svg>
                            </div>

                            <div className="flex-1">
                                <h4 className="text-lg font-black text-indigo-950 dark:text-white uppercase tracking-widest">
                                    Quick Access
                                </h4>
                                <p className="text-sm text-slate-600 tracking-wide dark:text-slate-300 mt-1 mb-4 font-medium leading-relaxed">
                                    Testing the platform? Use these credentials:
                                </p>

                                <div className="space-y-3.5">
                                    <div className="group">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 tracking-widest">
                                            Admin Email
                                        </p>
                                        <code className="block p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 text-base font-bold text-indigo-500 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 shadow-sm group-hover:border-indigo-300 transition-all tracking-wide">
                                            dev.access@company.com
                                        </code>
                                    </div>

                                    <div className="group">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 ml-1 tracking-widest">
                                            Password
                                        </p>
                                        <code className="block p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 text-base font-bold text-indigo-500 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 shadow-sm group-hover:border-indigo-300 transition-all tracking-wide">
                                           secret_token_99
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Middle Section (Login) */}
                <div className="flex flex-col items-center w-full sm:max-w-md lg:-mr-16 animate-in fade-in zoom-in-95 duration-700">
                    <div className="transition-transform duration-700 hover:scale-110 mb-6 drop-shadow-2xl">
                        <Link href="/">
                            <ApplicationLogo className="h-16 w-16 fill-current text-indigo-600 dark:text-indigo-400" />
                        </Link>
                    </div>

                    <div className="w-full overflow-hidden bg-white px-8 pt-10 pb-8 shadow-[0_30px_60px_rgba(0,0,0,0.12)] sm:rounded-[2.5rem] dark:bg-[#1e293b]/60 dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] dark:border dark:border-white/[0.05] dark:ring-1 dark:ring-white/[0.1] backdrop-blur-xl">
                        <div className="relative z-10">{children}</div>
                    </div>
                </div>

                {/* Right Balancer*/}
                <div className="hidden lg:block lg:w-[22rem]"></div>
            </div>
        </div>
    );
}
