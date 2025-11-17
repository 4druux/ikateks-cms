import React, { ChangeEvent } from "react";
import { UploadCloud, X } from "lucide-react";

interface MediaUploadFieldProps {
    label: string;
    onMediaChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onRemoveMedia: () => void;
    mediaPreview: string | null;
    error?: string;
    accept?: string;
    previewType: "image" | "video";
}

const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
    label,
    onMediaChange,
    onRemoveMedia,
    mediaPreview,
    error,
    accept = "image/*,video/*",
    previewType,
}) => {
    const fieldClasses = [
        "relative",
        "block",
        "w-full",
        "border-2",
        "border-dashed",
        "rounded-lg",
        "p-6",
        "text-center",
        "hover:border-zinc-400",
        "transition-colors",
        "duration-200",
        "ease-in-out",
        error ? "border-red-500" : "border-zinc-300",
    ].join(" ");

    const labelClasses = [
        "pointer-events-none",
        "absolute",
        "left-3",
        "top-0",
        "-translate-y-1/2",
        "transform",
        "bg-white",
        "px-1",
        "text-sm",
        error ? "text-red-500" : "text-zinc-500",
    ].join(" ");

    return (
        <div className="w-full">
            <div className="relative mt-2">
                {" "}
                <label className={labelClasses}>{label}</label>
                <div className={fieldClasses}>
                    {mediaPreview ? (
                        <div className="relative group">
                            {previewType === "image" ? (
                                <img
                                    src={mediaPreview}
                                    alt="Media preview"
                                    className="mx-auto max-h-48 w-auto object-contain rounded"
                                />
                            ) : (
                                <video
                                    src={mediaPreview}
                                    controls
                                    className="mx-auto max-h-48 w-auto object-contain rounded"
                                >
                                    <track kind="captions" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            <button
                                type="button"
                                onClick={onRemoveMedia}
                                className="absolute -top-2 -right-2 z-10 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove media"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <UploadCloud className="w-12 h-12 text-zinc-400" />
                            <p className="mt-2 text-sm text-zinc-600">
                                Drag & drop, or click to upload
                            </p>
                            <p className="text-xs text-zinc-500">
                                {accept === "image/*,video/*"
                                    ? "Image or Video"
                                    : accept}
                            </p>
                            <input
                                type="file"
                                id="media-upload"
                                name="media-upload"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={onMediaChange}
                                accept={accept}
                            />
                        </div>
                    )}
                </div>
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default MediaUploadField;
