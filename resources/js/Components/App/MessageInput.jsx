import { useState, Fragment } from "react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";
import NewMessageInput from "./NewMessageInput";
import AudioRecorder from "./AudioRecorder";
import EmojiPicker from "emoji-picker-react";
import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
} from "@headlessui/react";
import AttachmentPreview from "./AttachmentPreview";
import CustomAudioPlayer from "./CustomAudioPlayer";
import { isAudio, isImage } from "../../helpers";

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onFileChange = (ev) => {
        const files = ev.target.files;

        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            };
        });
        ev.target.value = null;

        setChosenFiles((prevFiles) => {
            return [...prevFiles, ...updatedFiles];
        });
    };

    const onSendClick = () => {
        if (messageSending) {
            return;
        }
        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessage(
                "Please provide a message or upload attachments.",
            );

            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
            return;
        }

        const formData = new FormData();
        chosenFiles.forEach((file) => {
            formData.append("attachments[]", file.file);
        });
        formData.append("message", newMessage);

        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formData.append("group_id", conversation.id);
        }

        setMessageSending(true);

        axios
            .post(route("message.store"), formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100,
                    );
                    setUploadProgress(progress);
                },
            })
            .then((response) => {
                setNewMessage("");
                setMessageSending(false);
                setUploadProgress(0);
                setChosenFiles([]);
            })
            .catch((error) => {
                setMessageSending(false);
                setChosenFiles([]);
                const message = error?.response?.data?.message;
                setInputErrorMessage(
                    message || "An error occurred while sending message",
                );
            });
    };

    const onLikeClick = () => {
        if (messageSending) {
            return;
        }

        const data = {
            message: "👍",
        };

        if (conversation.is_user) {
            data["receiver_id"] = conversation.id;
        } else if (conversation.is_group) {
            data["group_id"] = conversation.id;
        }

        axios.post(route("message.store"), data);
    };

    const recordedAudioReady = (file, url) => {
        setChosenFiles((prevFiles) => [...prevFiles, { file, url }]);
    };

    return (
        <div className="flex flex-wrap items-start border-t border-white/5 bg-[#0f111a]/80 py-4 px-2 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
            {/* Attachment buttons */}
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2 flex gap-1">
                <button className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-full transition-all relative">
                    <PaperClipIcon className="w-5" />
                    <input
                        type="file"
                        multiple
                        onChange={onFileChange}
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-full transition-all relative">
                    <PhotoIcon className="w-5" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={onFileChange}
                        className="absolute left-0 top-0 right-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <AudioRecorder fileReady={recordedAudioReady} />
            </div>

            {/* Main text input field and send button */}
            <div className="order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative">
                <div className="flex items-end bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all shadow-inner">
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSendClick}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                    />
                    <button
                        onClick={onSendClick}
                        disabled={messageSending}
                        className="btn btn-info outline outline-1 outline-[#00b6ff] rounded-l-none"
                    >
                        <PaperAirplaneIcon className="w-6" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>

                {!!uploadProgress && (
                    <progress
                        className="progress progress-info w-full h-1 shadow-glow"
                        value={uploadProgress}
                        max="100"
                    ></progress>
                )}
                {inputErrorMessage && (
                    <p className="text-[10px] text-red-400 mt-1 font-medium ml-2 uppercase tracking-wide italic">
                        {inputErrorMessage}
                    </p>
                )}

                {/* File Previews Area */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {chosenFiles.map((file) => (
                        <div
                            key={file.file.name}
                            className="
                             relative group inline-flex w-fit
                                rounded-lg overflow-hidden
                                border border-white/10 shadow-lg
                            "
                        >
                            {/* Render thumbnail if the file is an image */}
                            {isImage(file.file) && (
                                <img
                                    src={file.url}
                                    alt=""
                                    className="w-20 h-20 object-cover hover:scale-105 transition-transform"
                                />
                            )}

                            {/* Render a custom audio player if the file is an audio type */}
                            {isAudio(file.file) && (
                                <div className="p-1 bg-white/5">
                                    <CustomAudioPlayer
                                        file={file}
                                        showVolume={false}
                                    />
                                </div>
                            )}

                            {/* Render a generic attachment preview for other file types */}
                            {!isAudio(file.file) && !isImage(file.file) && (
                                <AttachmentPreview file={file} />
                            )}

                            {/* Delete button: Removes the specific file from the chosenFiles state */}
                            <button
                                onClick={() => {
                                    setChosenFiles(
                                        chosenFiles.filter(
                                            (f) =>
                                                f.file.name !== file.file.name,
                                        ),
                                    );
                                }}
                                className="absolute -right-1 -top-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full shadow-xl"
                            >
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick interaction buttons  (Emojis & Like) */}
            <div className="order-3 xs:order-3 p-2 flex gap-1 items-center">
                <Popover className="relative">
                    <PopoverButton className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-full transition-all">
                        <FaceSmileIcon className="w-5 h-5" />
                    </PopoverButton>
                    <PopoverPanel className="absolute z-[100] right-0 bottom-full mb-4 shadow-2xl border border-white/10 rounded-2xl overflow-hidden">
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={(ev) => {
                                setNewMessage(newMessage + ev.emoji);
                            }}
                        />
                    </PopoverPanel>
                </Popover>

                {/* Like Button */}
                <button
                    onClick={onLikeClick}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/5 rounded-full transition-all active:scale-125"
                >
                    <HandThumbUpIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
