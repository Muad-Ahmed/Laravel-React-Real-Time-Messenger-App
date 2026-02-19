export const formatMessageDateLong = (date) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isToday(inputDate)) {
        return formatTimeHM(inputDate);
    }

    if (isYesterday(inputDate)) {
        return `Yesterday ${formatTimeHM(inputDate)}`;
    }

    if (inputDate.getFullYear() === now.getFullYear()) {
        return formatDateDM(inputDate);
    }

    return formatDateYMD(inputDate);
};

export const formatMessageDateShort = (date) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isToday(inputDate)) {
        return formatTimeHM(inputDate);
    }

    if (isYesterday(inputDate)) {
        return "Yesterday";
    }

    if (inputDate.getFullYear() === now.getFullYear()) {
        return formatDateDM(inputDate);
    }

    return formatDateYMD(inputDate);
};

export const isToday = (date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    );
};
const formatTimeHM = (date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
};

const formatDateDM = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    return `${day} ${month}`;
};

const formatDateYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
};

// For Attachments

/**
 * Formats a given number of bytes into a human-readable string (KB, MB, GB).
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];

    let i = 0;
    let size = bytes;

    while (size >= k) {
        size /= k;
        i++;
    }

    return parseFloat(size.toFixed(dm)) + " " + sizes[i];
};

/**
 * Checks if the attachment type is an image.
 */
export const isImage = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "image";
};

/**
 * Checks if the attachment type is a video.
 */
export const isVideo = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "video";
};

/**
 * Checks if the attachment type is an audio file.
 */
export const isAudio = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "audio";
};

/**
 * Checks if the attachment is a PDF document.
 */
export const isPDF = (attachment) => {
    let mime = attachment.mime || attachment.type;
    return mime === "application/pdf";
};

/**
 * Checks if the attachment can be previewed (Image, Video, Audio, or PDF).
 */
export const isPreviewable = (attachment) => {
    return (
        isImage(attachment) ||
        isVideo(attachment) ||
        isAudio(attachment) ||
        isPDF(attachment)
    );
};
