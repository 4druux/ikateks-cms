import useSWR from "swr";
import { useCallback, useState } from "react";
import {
    Principal,
    createPrincipal,
    deletePrincipal,
    fetcher,
} from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const PRINCIPALS_API_URL = "/api/admin/principals";

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UsePrincipalsReturn {
    principals: Principal[] | undefined;
    isLoading: boolean;
    isMutating: boolean;
    error: any;
    handleDelete: (id: number) => Promise<void>;
    handleCreate: (
        formData: FormData,
        onValidationError: (errors: Record<string, string[]>) => void,
        onSuccess?: () => void
    ) => Promise<boolean>;
    mutatePrincipals: () => Promise<Principal[] | undefined>;
}

export default function usePrincipals(): UsePrincipalsReturn {
    const { data, error, isLoading, mutate } = useSWR<Principal[]>(
        PRINCIPALS_API_URL,
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
            onValidationError: (errors: Record<string, string[]>) => void,
            onSuccess?: () => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Adding principal logo...");
            try {
                const newPrincipal = await createPrincipal(formData);

                mutate(
                    (currentData = []) => [...currentData, newPrincipal],
                    true
                );

                toast.success("Principal logo added successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to add principal logo:", err);
                if (
                    axios.isAxiosError<ValidationErrorResponse>(err) &&
                    err.response?.status === 422
                ) {
                    onValidationError(err.response.data.errors);
                    toast.error(
                        err.response.data.message ||
                            "Validation failed. Please check the image.",
                        { id: toastId }
                    );
                } else {
                    toast.error(
                        err.response?.data?.message ||
                            "Failed to add principal logo.",
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
        async (id: number) => {
            if (
                window.confirm(
                    "Are you sure you want to delete this principal logo?"
                )
            ) {
                setIsMutating(true);
                const toastId = toast.loading("Deleting principal logo...");

                mutate(
                    (currentData) =>
                        currentData?.filter((principal) => principal.id !== id),
                    false
                );

                try {
                    await deletePrincipal(id);
                    toast.success("Principal logo deleted successfully.", {
                        id: toastId,
                    });
                } catch (err: any) {
                    console.error("Failed to delete principal logo:", err);
                    toast.error(
                        err.response?.data?.message ||
                            "Failed to delete principal logo.",
                        { id: toastId }
                    );
                    mutate();
                } finally {
                    setIsMutating(false);
                }
            }
        },
        [mutate]
    );

    const mutatePrincipals = useCallback(() => {
        return mutate();
    }, [mutate]);

    return {
        principals: data,
        isLoading,
        isMutating,
        error,
        handleDelete,
        handleCreate,
        mutatePrincipals,
    };
}
