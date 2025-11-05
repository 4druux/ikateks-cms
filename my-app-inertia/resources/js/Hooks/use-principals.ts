import useSWR from "swr";
import { useCallback, useState } from "react";
import {
    PrincipalItem,
    PrincipalLogo,
    createPrincipals,
    updatePrincipals,
    deletePrincipals,
    createLogoPrincipal,
    deleteLogoPrincipal,
    fetcher,
} from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const PRINCIPALS_API_URL = "/api/admin/principals";
const LOGO_API_URL = "/api/admin/principals/logo";

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UsePrincipalsReturn {
    principals: PrincipalItem[] | undefined;
    logos: PrincipalLogo[] | undefined;
    isLoadingPrincipals: boolean;
    isLoadingLogos: boolean;
    isMutating: boolean;
    errorPrincipals: any;
    errorLogos: any;

    handleCreatePrincipal: (
        formData: FormData,
        onSuccess: () => void,
        onValidationError: (errors: Record<string, string[]>) => void
    ) => Promise<boolean>;

    handleUpdatePrincipal: (
        id: number,
        formData: FormData,
        onValidationError: (errors: Record<string, string[]>) => void,
        onSuccess?: () => void
    ) => Promise<boolean>;

    handleDeletePrincipal: (id: number) => Promise<boolean>;

    handleCreateLogo: (
        formData: FormData,
        onSuccess: () => void,
        onValidationError: (errors: Record<string, string[]>) => void
    ) => Promise<boolean>;

    handleDeleteLogo: (id: number) => Promise<boolean>;

    mutatePrincipals: () => Promise<PrincipalItem[] | undefined>;
    mutateLogos: () => Promise<PrincipalLogo[] | undefined>;
}

export default function usePrincipals(): UsePrincipalsReturn {
    const {
        data: principalsData,
        error: errorPrincipals,
        isLoading: isLoadingPrincipals,
        mutate: mutatePrincipals,
    } = useSWR<PrincipalItem[]>(PRINCIPALS_API_URL, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    const {
        data: logosData,
        error: errorLogos,
        isLoading: isLoadingLogos,
        mutate: mutateLogos,
    } = useSWR<PrincipalLogo[]>(LOGO_API_URL, fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    const [isMutating, setIsMutating] = useState(false);

    const handleCreatePrincipal = useCallback(
        async (
            formData: FormData,
            onSuccess: () => void,
            onValidationError: (errors: Record<string, string[]>) => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Creating principal item...");
            try {
                const newItem = await createPrincipals(formData);
                mutatePrincipals(
                    (currentData = []) => [...currentData, newItem],
                    true
                );
                toast.success("Principal item created successfully!", {
                    id: toastId,
                });
                if (onSuccess) onSuccess();
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to create principal item:", err);
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
                            "Failed to create principal item.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutatePrincipals]
    );

    const handleUpdatePrincipal = useCallback(
        async (
            id: number,
            formData: FormData,
            onValidationError: (errors: Record<string, string[]>) => void,
            onSuccess?: () => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Updating principal item...");
            try {
                const updatedItem = await updatePrincipals(id, formData);
                mutatePrincipals(
                    (currentData = []) =>
                        currentData.map((item) =>
                            item.id === id ? updatedItem : item
                        ),
                    true
                );
                toast.success("Principal item updated successfully!", {
                    id: toastId,
                });
                if (onSuccess) onSuccess();
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to update principal item:", err);
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
                            "Failed to update principal item.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutatePrincipals]
    );

    const handleDeletePrincipal = useCallback(
        async (id: number): Promise<boolean> => {
            if (
                !window.confirm(
                    "Are you sure you want to delete this principal item?"
                )
            ) {
                return false;
            }

            setIsMutating(true);
            const toastId = toast.loading("Deleting principal item...");

            mutatePrincipals(
                (currentData = []) =>
                    currentData.filter((item) => item.id !== id),
                false
            );

            try {
                await deletePrincipals(id);
                toast.success("Principal item deleted successfully.", {
                    id: toastId,
                });
                return true;
            } catch (err: any) {
                console.error("Failed to delete principal item:", err);
                toast.error(
                    err.response?.data?.message ||
                        "Failed to delete principal item.",
                    { id: toastId }
                );
                mutatePrincipals();
                return false;
            } finally {
                setIsMutating(false);
            }
        },
        [mutatePrincipals]
    );

    const handleCreateLogo = useCallback(
        async (
            formData: FormData,
            onSuccess: () => void,
            onValidationError: (errors: Record<string, string[]>) => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Adding principal logo...");
            try {
                const newLogo = await createLogoPrincipal(formData);
                mutateLogos(
                    (currentData = []) => [...currentData, newLogo],
                    true
                );
                toast.success("Principal logo added successfully!", {
                    id: toastId,
                });
                if (onSuccess) onSuccess();
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
        [mutateLogos]
    );

    const handleDeleteLogo = useCallback(
        async (id: number): Promise<boolean> => {
            if (
                !window.confirm(
                    "Are you sure you want to delete this principal logo?"
                )
            ) {
                return false;
            }

            setIsMutating(true);
            const toastId = toast.loading("Deleting principal logo...");

            mutateLogos(
                (currentData = []) =>
                    currentData.filter((logo) => logo.id !== id),
                false
            );

            try {
                await deleteLogoPrincipal(id);
                toast.success("Principal logo deleted successfully.", {
                    id: toastId,
                });
                return true;
            } catch (err: any) {
                console.error("Failed to delete principal logo:", err);
                toast.error(
                    err.response?.data?.message ||
                        "Failed to delete principal logo.",
                    { id: toastId }
                );
                mutateLogos();
                return false;
            } finally {
                setIsMutating(false);
            }
        },
        [mutateLogos]
    );

    return {
        principals: principalsData,
        logos: logosData,
        isLoadingPrincipals,
        isLoadingLogos,
        isMutating,
        errorPrincipals,
        errorLogos,
        handleCreatePrincipal,
        handleUpdatePrincipal,
        handleDeletePrincipal,
        handleCreateLogo,
        handleDeleteLogo,
        mutatePrincipals,
        mutateLogos,
    };
}
