import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save, X } from "lucide-react";
import PasswordField from "@/Components/common/PasswordField";
import Button from "@/Components/common/Button";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    approved_at: string | null;
}

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onResetPassword: (newPass: string, confirmPass: string) => Promise<void>;
}

interface FormData {
    new_password: string;
    password_confirmation: string;
}

interface Errors {
    [key: string]: string | undefined;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    isOpen,
    onClose,
    user,
    onResetPassword,
}) => {
    const [formData, setFormData] = useState<FormData>({
        new_password: "",
        password_confirmation: "",
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (isOpen) {
            setFormData({
                new_password: "",
                password_confirmation: "",
            });
            setErrors({});
        }
    }, [isOpen, user]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        let validationErrors: Errors = {};
        if (!formData.new_password) {
            validationErrors.new_password = "New password is required.";
        } else if (formData.new_password.length < 8) {
            validationErrors.new_password =
                "Password must be at least 8 characters.";
        }
        if (formData.new_password !== formData.password_confirmation) {
            validationErrors.password_confirmation =
                "Password confirmation does not match.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await onResetPassword(
                formData.new_password,
                formData.password_confirmation
            );
            onClose();
        } catch (err: any) {
            const serverErrors = err?.response?.data?.errors;
            if (serverErrors) {
                const mappedErrors: Errors = {};
                if (serverErrors.password) {
                    mappedErrors.new_password = serverErrors.password[0];
                }
                if (serverErrors.new_password) {
                    mappedErrors.new_password = serverErrors.new_password[0];
                }
                if (serverErrors.password_confirmation) {
                    mappedErrors.password_confirmation =
                        serverErrors.password_confirmation[0];
                }
                setErrors(mappedErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 250,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="fixed bottom-0 left-0 right-0 w-full max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-white shadow-xl md:static md:max-w-2xl md:max-h-[100%] md:rounded-2xl"
                    >
                        <div className="sticky top-0 z-10 flex justify-center bg-white py-4 md:hidden">
                            <div className="h-1 w-16 rounded-full bg-gray-300" />
                        </div>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="border-b border-slate-300 px-4 pb-4 md:p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-700">
                                        Reset User Password
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="group cursor-pointer rounded-full p-2 hover:bg-slate-50"
                                    >
                                        <X className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:rotate-120 group-hover:text-gray-800" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-4 p-4 md:space-y-6 md:p-6">
                                {user && (
                                    <p className="text-sm text-gray-600">
                                        You are about to reset the password for
                                        user{" "}
                                        <span className="font-semibold">
                                            {user.name} - {user.email}.
                                        </span>
                                    </p>
                                )}

                                <PasswordField
                                    id="new_password"
                                    name="new_password"
                                    label="New Password"
                                    value={formData.new_password}
                                    onChange={handleFormChange}
                                    error={errors.new_password}
                                    disabled={isSubmitting}
                                    required
                                />

                                <PasswordField
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    label="Confirm Password"
                                    value={formData.password_confirmation}
                                    onChange={handleFormChange}
                                    error={errors.password_confirmation}
                                    disabled={isSubmitting}
                                    required
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        size="md"
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        iconLeft={<X className="h-4 w-4" />}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="md"
                                        type="submit"
                                        variant="primary"
                                        disabled={
                                            isSubmitting ||
                                            !formData.new_password ||
                                            !formData.password_confirmation
                                        }
                                        iconLeft={
                                            isSubmitting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Save className="h-4 w-4" />
                                            )
                                        }
                                    >
                                        {isSubmitting
                                            ? "Resetting..."
                                            : "Reset Password"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResetPasswordModal;
