export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "w-5 h-5 rounded-md cursor-pointer transition-all duration-200 " +
                "border-slate-300 dark:border-white/10 " +
                "bg-white dark:bg-slate-800/50 " +
                "text-indigo-500 shadow-sm " +
                "focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0 " +
                "dark:checked:bg-indigo-500 dark:checked:border-indigo-500 " +
                "hover:border-indigo-400 dark:hover:border-white/20 " +
                className
            }
        />
    );
}
