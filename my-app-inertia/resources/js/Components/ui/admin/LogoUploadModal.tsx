import React, { useState, useCallback, FormEvent, ChangeEvent } from "react";
import Button from "@/Components/common/Button";
import { X, UploadCloud } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface LogoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<boolean>;
    isMutating: boolean;
    modalTitle: string;
    inputLabel: string;
}

const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isMutating,
    modalTitle,
    inputLabel,
}) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | undefined>();

    const handleFileChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const acceptedTypes = [
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/gif",
                    "image/svg+xml",
                    "image/webp",
                ];
                if (!acceptedTypes.includes(file.type)) {
                    setError(
                        "Invalid file type. Please select an image (PNG, JPG, GIF, SVG, WEBP)."
                    );
                    setImageFile(null);
                    setImagePreview(null);
                    event.target.value = "";
                    return;
                }
                if (file.size > 2 * 1024 * 1024) {
                    setError("File size exceeds 2MB limit.");
                    setImageFile(null);
                    setImagePreview(null);
                    event.target.value = "";
                    return;
                }

                setImageFile(file);
                setError(undefined);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setImageFile(null);
                setImagePreview(null);
            }
        },
        []
    );

    const handleRemoveImage = useCallback(() => {
        setImageFile(null);
        setImagePreview(null);
        setError(undefined);
        const input = document.getElementById(
            "logo-upload-input"
        ) as HTMLInputElement;
        if (input) input.value = "";
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!imageFile) {
            setError("Please select an image file.");
            return;
        }
        setError(undefined);

        const formData = new FormData();
        formData.append("image", imageFile);

        const success = await onSubmit(formData);
        if (success) {
            handleRemoveImage();
            onClose();
        }
    };

    const handleClose = () => {
        if (isMutating) return;
        handleRemoveImage();
        setError(undefined);
        onClose();
    };

    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={overlayVariants}
                    transition={{ duration: 0.2 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col"
                        variants={modalVariants}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-medium text-zinc-900">
                                {modalTitle} {/* Use dynamic title */}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="p-1 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-50"
                                disabled={isMutating}
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="p-4 overflow-auto flex-grow space-y-4 flex flex-col"
                        >
                            <div className="flex-grow">
                                <label
                                    htmlFor="logo-upload-input"
                                    className="block text-sm font-medium text-zinc-700 mb-1"
                                >
                                    {inputLabel} {/* Use dynamic label */}
                                </label>
                                <div
                                    className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                                        error
                                            ? "border-red-500"
                                            : "border-zinc-300"
                                    } border-dashed rounded-md cursor-pointer hover:border-red-500 transition-colors`}
                                >
                                    <div className="space-y-1 text-center">
                                        {imagePreview ? (
                                            <div className="relative group max-w-xs mx-auto mb-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-h-40 object-contain mx-auto shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-0 right-0 m-1 p-1 bg-red-800 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    aria-label="Remove image"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <UploadCloud
                                                className="mx-auto h-12 w-12 text-zinc-400"
                                                strokeWidth={1}
                                            />
                                        )}
                                        <div className="flex text-sm text-zinc-600 justify-center">
                                            <label
                                                htmlFor="logo-upload-input"
                                                className="relative cursor-pointer bg-transparent font-medium text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 hover:text-red-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="logo-upload-input"
                                                    name="image"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    accept="image/png, image/jpeg, image/jpg, image/gif, image/svg+xml, image/webp"
                                                />
                                            </label>
                                            <p className="pl-1 hidden sm:block">
                                                or drag and drop
                                            </p>
                                        </div>
                                        <p className="text-xs text-zinc-500">
                                            PNG, JPG, GIF, SVG, WEBP up to 2MB
                                        </p>
                                    </div>
                                </div>
                                {error && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <div className="p-0 pt-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    disabled={isMutating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isMutating || !imageFile}
                                >
                                    {isMutating ? "Adding..." : "Add Logo"}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LogoUploadModal;
