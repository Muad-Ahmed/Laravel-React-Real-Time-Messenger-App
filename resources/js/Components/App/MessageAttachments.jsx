import {
    PaperClipIcon,
    ArrowDownTrayIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { isAudio, isImage, isPDF, isPreviewable, isVideo } from "../../helpers";

const MessageAttachments = ({ attachments, attachmentClick }) => {
    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap justify-end gap-2">
                    {attachments.map((attachment, ind) => (
                        <div
                            key={attachment.id}
                            onClick={(ev) => attachmentClick(attachments, ind)}
                            className={
                                `group flex flex-col items-center justify-center 
                                text-slate-300 relative cursor-pointer rounded-xl 
                                 border border-white/10 shadow-md 
                                transition-all duration-200 hover:shadow-xl hover:border-white/20 ` +
                                (isAudio(attachment)
                                    ? "w-72 sm:w-80 bg-transparent "
                                    : "w-32 aspect-square bg-slate-700/40 overflow-hidden")
                            }
                        >
                            {/* Download button: Visible on hover for non-audio files */}
                            {!isAudio(attachment) && (
                                <a
                                    // Stop event propagation to prevent preview trigger
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 
                                            w-9 h-9 flex items-center justify-center text-white 
                                            bg-black/60 backdrop-blur-sm rounded-bl-xl absolute right-0 top-0 
                                            cursor-pointer hover:bg-black/80 border-l border-b border-white/10"
                                >
                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                </a>
                            )}

                            {isImage(attachment) && (
                                <img
                                    src={attachment.url}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                />
                            )}

                            {isVideo(attachment) && (
                                <div className="relative flex justify-center items-center w-full h-full overflow-hidden">
                                    <PlayCircleIcon className="z-20 absolute w-12 h-12 text-white/90 drop-shadow-2xl transition-transform group-hover:scale-110" />
                                    {/* Overlay behind the icon to enhance the vision */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                                    <video
                                        src={attachment.url}
                                        className="object-cover w-full h-full"
                                    ></video>
                                </div>
                            )}

                            {/* Render audio using default browser controls */}
                            {isAudio(attachment) && (
                                <div className="relative flex justify-center items-center w-full">
                                    <audio
                                        src={attachment.url}
                                        controls
                                        className="w-full h-10"
                                    ></audio>
                                </div>
                            )}

                            {/* Render PDF file using an iframe */}
                            {isPDF(attachment) && (
                                <div className="relative flex justify-center items-center w-full h-full bg-slate-800">
                                    <div className="absolute inset-0 z-10 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                    <iframe
                                        src={attachment.url}
                                        className="w-full h-full border-none pointer-events-none"
                                    ></iframe>
                                </div>
                            )}

                            {!isPreviewable(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="flex flex-col justify-center items-center p-4 w-full h-full bg-gradient-to-br from-slate-700 to-slate-800"
                                >
                                    <PaperClipIcon className="w-8 h-8 mb-2 text-indigo-400 group-hover:rotate-12 transition-transform" />
                                    <small className="text-center text-[10px] font-medium leading-tight truncate w-full px-2 text-slate-300">
                                        {attachment.name}
                                    </small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MessageAttachments;
