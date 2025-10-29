import React, {
    useState,
    DragEvent,
    ChangeEvent,
    useCallback,
    useRef,
} from "react";
import { Upload, X } from "lucide-react";
import ReactCrop, {
    type Crop,
    centerCrop,
    makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

async function getCroppedImg(
    image: HTMLImageElement,
    pixelCrop: Crop,
    fileName: string
): Promise<File | null> {
    const canvas = document.createElement("canvas");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    if (!pixelCrop.width || !pixelCrop.height) {
        console.error("Pixel crop dimensions are missing");
        return null;
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        console.error("Could not get canvas context");
        return null;
    }

    const cropX = pixelCrop.x * scaleX;
    const cropY = pixelCrop.y * scaleY;
    const cropWidth = pixelCrop.width * scaleX;
    const cropHeight = pixelCrop.height * scaleY;

    ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    console.error("Canvas is empty");
                    reject(new Error("Canvas is empty"));
                    return;
                }
                const croppedFile = new File([blob], fileName, {
                    type: blob.type,
                });
                resolve(croppedFile);
            },
            "image/jpeg",
            0.9
        );
    });
}

interface ImageFieldProps {
    id: string;
    name: string;
    label: string;
    error?: string;
    imagePreview: string | null;
    onChange: (file: File | null) => void;
    onRemove: () => void;
    accept?: string;
    aspectRatio?: number;
}

const ImageField: React.FC<ImageFieldProps> = ({
    id,
    name,
    label,
    error,
    imagePreview,
    onChange,
    onRemove,
    accept = "image/png, image/jpeg, image/jpg, image/gif, image/webp",
    aspectRatio = 4 / 3,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const [showModal, setShowModal] = useState(false);
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleFileChange = useCallback(
        (file: File | null) => {
            if (
                file &&
                accept
                    .split(",")
                    .map((t) => t.trim())
                    .includes(file.type)
            ) {
                setOriginalFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImgSrc(reader.result as string);
                    setShowModal(true);
                };
                reader.readAsDataURL(file);
            } else if (file) {
                console.warn("Invalid file type selected:", file.type);
                onChange(null);
            } else {
                onChange(null);
            }
        },
        [onChange, accept]
    );

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspectRatio));
    };

    const handleCropImage = async () => {
        if (!completedCrop || !imgRef.current || !originalFile) return;

        try {
            const croppedFile = await getCroppedImg(
                imgRef.current,
                completedCrop,
                originalFile.name
            );
            if (croppedFile) {
                onChange(croppedFile);
            }
            setShowModal(false);
        } catch (e) {
            console.error("Error cropping image:", e);
            setShowModal(false);
        }
    };

    const handleRemove = () => {
        setImgSrc(null);
        setCrop(undefined);
        setCompletedCrop(undefined);
        setOriginalFile(null);
        onRemove();
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files?.[0] || null);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0] || null;
        handleFileChange(file);

        const fileInput = document.getElementById(id) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <>
            <div>
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-zinc-700 mb-1"
                >
                    {label}
                </label>
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`mt-1 flex border-2 transition-colors duration-200 ${
                        imagePreview
                            ? "items-start justify-start"
                            : "items-center justify-center"
                    }
                        ${
                            error
                                ? "border-red-500"
                                : isDragging
                                ? "border-red-500"
                                : imagePreview
                                ? "border-transparent"
                                : "border-zinc-300"
                        }
                        ${imagePreview ? "p-0" : "px-6 pt-5 pb-6 border-dashed"}
                        ${isDragging ? "bg-red-50" : "bg-white"}
                    `}
                >
                    <div className="space-y-1">
                        {imagePreview ? (
                            <div className="relative group aspect-[4/3] w-full">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-full w-full object-contain shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="absolute top-0 right-0 m-1 p-1 bg-red-800 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    aria-label="Remove image"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload
                                    className={`mx-auto h-[20dvh] w-[20dvh] ${
                                        isDragging
                                            ? "text-red-500"
                                            : "text-zinc-400"
                                    } transition-colors duration-200`}
                                />
                                <div className="flex text-sm text-zinc-600 justify-center">
                                    <label
                                        htmlFor={id}
                                        className="relative cursor-pointer bg-transparent font-medium text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 hover:text-red-500"
                                    >
                                        <span>Upload a file</span>
                                        <input
                                            id={id}
                                            name={name}
                                            type="file"
                                            className="sr-only"
                                            onChange={handleInputChange}
                                            accept={accept}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-zinc-500">
                                    PNG, JPG, GIF, WEBP up to 2MB
                                </p>
                            </>
                        )}
                    </div>
                </div>
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>

            {showModal && imgSrc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-medium text-zinc-900">
                                Crop Image (4:3 Ratio)
                            </h3>
                        </div>
                        <div className="p-4 overflow-auto flex-grow">
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) =>
                                    setCrop(percentCrop)
                                }
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspectRatio}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                    style={{ maxHeight: "70vh" }}
                                />
                            </ReactCrop>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCropImage}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-800 border border-transparent shadow-sm hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                disabled={
                                    !completedCrop?.width ||
                                    !completedCrop?.height
                                }
                            >
                                Crop Image
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageField;
