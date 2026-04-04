import { UsersIcon } from "@heroicons/react/24/solid";

const GroupAvatar = ({}) => {
    return (
        <>
            <div className={`avatar placeholder`}>
                <div
                    className={`bg-gradient-to-br from-emerald-400 to-teal-600 text-white rounded-full w-10 flex items-center justify-center ring-2 max-h-11 ring-white/10 dark:ring-white/5 shadow-lg transition-transform duration-200 hover:scale-105`}
                >
                    <span className="text-xl">
                        <UsersIcon className="w-5 drop-shadow-sm" />
                    </span>
                </div>
            </div>
        </>
    );
};

export default GroupAvatar;
