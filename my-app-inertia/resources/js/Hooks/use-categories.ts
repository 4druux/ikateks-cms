import useSWR from "swr";
import { useCallback, useState } from "react";
import {
    Category,
    createCategory,
    deleteCategory,
    updateCategory,
    fetcher,
} from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const CATEGORIES_API_URL = "/api/admin/categories";

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UseCategoriesReturn {
    categories: Category[] | undefined;
    isLoading: boolean;
    isMutating: boolean;
    error: any;
    handleDelete: (id: number) => Promise<void>;
    handleCreate: (
        formData: FormData,
        onSuccess?: () => void
    ) => Promise<boolean>;
    handleUpdate: (
        slug: string,
        formData: FormData,
        onValidationError: (errors: Record<string, string[]>) => void,
        onSuccess?: () => void
    ) => Promise<boolean>;
    mutateCategories: () => Promise<Category[] | undefined>;
}

export default function useCategories(): UseCategoriesReturn {
    const { data, error, isLoading, mutate } = useSWR<Category[]>(
        CATEGORIES_API_URL,
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
            onSuccess?: () => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Creating category...");
            try {
                const newCategory = await createCategory(formData);

                mutate(
                    (currentData = []) => [...currentData, newCategory],
                    true
                );

                toast.success("Category created successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to create category:", err);
                if (
                    axios.isAxiosError<ValidationErrorResponse>(err) &&
                    err.response?.status === 422
                ) {
                    toast.error(
                        err.response.data.message ||
                            "Validation failed. Please check the form.",
                        { id: toastId }
                    );
                } else {
                    toast.error(
                        err.response?.data?.message ||
                            "Failed to create category.",
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
                    "Apakah Anda yakin ingin menghapus kategori ini? Produk terkait juga akan terhapus."
                )
            ) {
                setIsMutating(true);
                const toastId = toast.loading("Menghapus kategori...");

                mutate(
                    (currentData) =>
                        currentData?.filter((cat) => cat.id !== id),
                    false
                );

                try {
                    await deleteCategory(id);
                    toast.success("Kategori berhasil dihapus.", {
                        id: toastId,
                    });
                } catch (err: any) {
                    console.error("Failed to delete category:", err);
                    toast.error(
                        err.response?.data?.message ||
                            "Gagal menghapus kategori.",
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

    const handleUpdate = useCallback(
        async (
            slug: string,
            formData: FormData,
            onValidationError: (errors: Record<string, string[]>) => void,
            onSuccess?: () => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Updating category...");
            try {
                const updatedCategory = await updateCategory(slug, formData);

                mutate(
                    (currentData = []) =>
                        currentData.map((cat) =>
                            cat.slug === slug ? updatedCategory : cat
                        ),
                    true
                );

                toast.success("Category updated successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to update category:", err);
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
                            "Failed to update category.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutate]
    );

    const mutateCategories = useCallback(() => {
        return mutate();
    }, [mutate]);

    return {
        categories: data,
        isLoading,
        isMutating,
        error,
        handleDelete,
        handleCreate,
        handleUpdate,
        mutateCategories,
    };
}
