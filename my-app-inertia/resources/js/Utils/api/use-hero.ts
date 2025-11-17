import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UseHeroReturn {
    isMutating: boolean;
    handleUpdate: (
        page_key: string,
        formData: FormData,
        onValidationError: (errors: Record<string, string[]>) => void,
        onSuccess: () => void
    ) => Promise<boolean>;
}

export default function useHero(): UseHeroReturn {
    const [isMutating, setIsMutating] = useState(false);

    const handleUpdate = useCallback(
        async (
            page_key: string,
            formData: FormData,
            onValidationError: (errors: Record<string, string[]>) => void,
            onSuccess: () => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Updating hero content...");

            formData.append("_method", "PUT");

            try {
                await axios.post(`/api/admin/hero/${page_key}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                toast.success("Hero content updated successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to update hero:", err);

                if (
                    axios.isAxiosError<ValidationErrorResponse>(err) &&
                    err.response?.status === 422
                ) {
                    onValidationError(err.response.data.errors);
                    toast.error(
                        err.response.data.message ||
                            "Validation failed. Please check the form.",
                        { id: toastId }
                    );
                } else {
                    toast.error(
                        err.response?.data?.message || "Failed to update hero.",
                        { id: toastId }
                    );
                }

                setIsMutating(false);
                return false;
            }
        },
        []
    );

    return {
        isMutating,
        handleUpdate,
    };
}
