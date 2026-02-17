import React from "react";

export default function DeleteGroupModal({ open, onClose, onConfirm }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 animate-in fade-in duration-300">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-2xl shadow-black/50 border border-white/10 transform animate-in zoom-in-95 duration-200">
                <h2 className="mb-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Delete Group
                </h2>

                <p className="mb-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    Are you sure you want to delete this group? This action
                    <span className="font-semibold text-red-500 dark:text-red-400"> cannot be undone</span>. 
                    All messages and data will be permanently removed.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-gray-200 dark:border-white/5 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-xl bg-gradient-to-r from-red-600 to-rose-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 hover:from-red-500 hover:to-rose-600 transition-all active:scale-95"
                    >
                        Delete Group
                    </button>
                </div>
            </div>
        </div>
    );
}