import useSWR from "swr";
import { useCallback, useState } from "react";
import {
    AboutItem,
    createAbout,
    deleteAbout,
    updateAbout,
    fetcher,
} from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const ABOUT_API_URL = "/api/admin/about";

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UseAboutReturn {
    aboutItems: AboutItem[] | undefined;
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
    mutateAbout: () => Promise<AboutItem[] | undefined>;
}

export default function useAbout(): UseAboutReturn {
    const { data, error, isLoading, mutate } = useSWR<AboutItem[]>(
        ABOUT_API_URL,
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
            const toastId = toast.loading("Creating about item...");
            try {
                const newAboutItem = await createAbout(formData);

                mutate(
                    (currentData = []) => [...currentData, newAboutItem],
                    true
                );

                toast.success("About item created successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to create about item:", err);
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
                            "Failed to create about item.",
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
                    "Are you sure you want to delete this about item?"
                )
            ) {
                return false;
            }

            setIsMutating(true);
            const toastId = toast.loading("Deleting about item...");

            mutate(
                (currentData) => currentData?.filter((item) => item.id !== id),
                false
            );

            try {
                await deleteAbout(id);
                toast.success("About item deleted successfully.", {
                    id: toastId,
                });
                return true;
            } catch (err: any) {
                console.error("Failed to delete about item:", err);
                toast.error(
                    err.response?.data?.message ||
                        "Failed to delete about item.",
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
            const toastId = toast.loading("Updating about item...");
            try {
                const updatedAboutItem = await updateAbout(id, formData);

                mutate(
                    (currentData = []) =>
                        currentData.map((item) =>
                            item.id === id ? updatedAboutItem : item
                        ),
                    true
                );

                toast.success("About item updated successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to update about item:", err);
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
                            "Failed to update about item.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutate]
    );

    const mutateAbout = useCallback(() => {
        return mutate();
    }, [mutate]);

    return {
        aboutItems: data,
        isLoading,
        isMutating,
        error,
        handleDelete,
        handleCreate,
        handleUpdate,
        mutateAbout,
    };
}
