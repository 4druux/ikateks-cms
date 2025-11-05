import useSWR from "swr";
import { useCallback, useState } from "react";
import {
    AdvantageItem,
    createAdvantage,
    deleteAdvantage,
    updateAdvantage,
    fetcher,
} from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const ADVANTAGE_API_URL = "/api/admin/company-advantages";

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UseAdvantageReturn {
    advantageItems: AdvantageItem[] | undefined;
    isLoading: boolean;
    isMutating: boolean;
    error: any;
    handleDelete: (id: number) => Promise<boolean>;

    handleCreate: (
        formData: FormData,
        onSuccess: () => void,
        onValidationError: (errors: Record<string, string[]>) => void
    ) => Promise<boolean>;

    handleUpdate: (
        id: number,
        formData: FormData,
        onValidationError: (errors: Record<string, string[]>) => void,
        onSuccess?: () => void
    ) => Promise<boolean>;
    mutateAdvantage: () => Promise<AdvantageItem[] | undefined>;
}

export default function useAdvantage(): UseAdvantageReturn {
    const { data, error, isLoading, mutate } = useSWR<AdvantageItem[]>(
        ADVANTAGE_API_URL,
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        }
    );
    const [isMutating, setIsMutating] = useState(false);

    const handleCreate = useCallback(
        async (
            formData: FormData,

            onSuccess: () => void,
            onValidationError: (errors: Record<string, string[]>) => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Creating advantage item...");
            try {
                const newAdvantageItem = await createAdvantage(formData);

                mutate(
                    (currentData = []) => [...currentData, newAdvantageItem],
                    true
                );

                toast.success("Advantage item created successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to create advantage item:", err);
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
                        err.response?.data?.message ||
                            "Failed to create advantage item.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutate]
    );

    const handleDelete = useCallback(
        async (id: number): Promise<boolean> => {
            if (
                !window.confirm(
                    "Are you sure you want to delete this advantage item?"
                )
            ) {
                return false;
            }

            setIsMutating(true);
            const toastId = toast.loading("Deleting advantage item...");

            mutate(
                (currentData) => currentData?.filter((item) => item.id !== id),
                false
            );

            try {
                await deleteAdvantage(id);
                toast.success("Advantage item deleted successfully.", {
                    id: toastId,
                });
                return true;
            } catch (err: any) {
                console.error("Failed to delete advantage item:", err);
                toast.error(
                    err.response?.data?.message ||
                        "Failed to delete advantage item.",
                    { id: toastId }
                );
                mutate();
                return false;
            } finally {
                setIsMutating(false);
            }
        },
        [mutate]
    );

    const handleUpdate = useCallback(
        async (
            id: number,
            formData: FormData,
            onValidationError: (errors: Record<string, string[]>) => void,
            onSuccess?: () => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Updating advantage item...");
            try {
                const updatedAdvantageItem = await updateAdvantage(id, formData);

                mutate(
                    (currentData = []) =>
                        currentData.map((item) =>
                            item.id === id ? updatedAdvantageItem : item
                        ),
                    true
                );

                toast.success("Advantage item updated successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to update advantage item:", err);
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
                        err.response?.data?.message ||
                            "Failed to update advantage item.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutate]
    );

    const mutateAdvantage = useCallback(() => {
        return mutate();
    }, [mutate]);

    return {
        advantageItems: data,
        isLoading,
        isMutating,
        error,
        handleDelete,
        handleCreate,
        handleUpdate,
        mutateAdvantage,
    };
}
