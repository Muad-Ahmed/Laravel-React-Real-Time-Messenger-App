const UserAvatar = ({ user, online = null, profile = false }) => {
    let onlineClass =
        online === true ? "online" : online === false ? "offline" : "";

    const sizeClass = profile ? "w-40" : "w-10"; 

    return (
        <>
            {user.avatar_url && (
                <div className={`chat-image avatar shadow-md ${onlineClass}`}>
                    <div
                        className={`rounded-full ring-2 ring-white/10 dark:ring-white/5 transition-transform duration-300 hover:scale-105 ${sizeClass}`}
                    >
                        <img
                            src={user.avatar_url}
                            className="rounded-full object-cover shadow-inner"
                        />
                    </div>
                </div>
            )}
            {!user.avatar_url && (
                <div
                    className={`chat-image avatar placeholder shadow-md ${onlineClass}`}
                >
                    <div
                        className={`bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold rounded-full flex items-center justify-center border border-white/20 dark:border-white/10 shadow-lg ${sizeClass}`}
                    >
                        <span
                            className={
                                profile
                                    ? "text-6xl uppercase tracking-tighter"
                                    : "text-sm uppercase"
                            }
                        >
                            {user.name.substring(0, 1)}
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserAvatar;
