import useSWR from "swr";
import { useCallback, useState } from "react";
import {
    Product,
    createProduct,
    deleteProduct,
    updateProduct,
    fetcher,
    Category,
} from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

interface ProductsResponse {
    category: Category;
    products: Product[];
}

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UseProductsReturn {
    products: Product[] | undefined;
    category: Category | undefined;
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
    mutateProducts: () => Promise<ProductsResponse | undefined>;
}

export default function useProducts(
    categorySlug: string | null
): UseProductsReturn {
    const PRODUCTS_API_URL = categorySlug
        ? `/api/admin/categories/products/${categorySlug}`
        : null;

    const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
        PRODUCTS_API_URL,
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
            const toastId = toast.loading("Creating product...");
            try {
                const newProduct = await createProduct(formData);

                mutate(
                    (currentData) =>
                        currentData
                            ? {
                                  ...currentData,
                                  products: [
                                      ...currentData.products,
                                      newProduct,
                                  ],
                              }
                            : undefined,
                    true
                );

                toast.success("Product created successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to create product:", err);
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
                            "Failed to create product.",
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
                window.confirm("Apakah Anda yakin ingin menghapus produk ini?")
            ) {
                setIsMutating(true);
                const toastId = toast.loading("Menghapus produk...");

                mutate(
                    (currentData) =>
                        currentData
                            ? {
                                  ...currentData,
                                  products: currentData.products.filter(
                                      (p) => p.id !== id
                                  ),
                              }
                            : undefined,
                    false
                );

                try {
                    await deleteProduct(id);
                    toast.success("Produk berhasil dihapus.", {
                        id: toastId,
                    });
                } catch (err: any) {
                    console.error("Failed to delete product:", err);
                    toast.error(
                        err.response?.data?.message ||
                            "Gagal menghapus produk.",
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
            const toastId = toast.loading("Updating product...");
            try {
                const updatedProduct = await updateProduct(slug, formData);

                mutate(
                    (currentData) =>
                        currentData
                            ? {
                                  ...currentData,
                                  products: currentData.products.map((p) =>
                                      p.slug === slug ? updatedProduct : p
                                  ),
                              }
                            : undefined,
                    true
                );

                toast.success("Product updated successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to update product:", err);
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
                            "Failed to update product.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutate]
    );

    const mutateProducts = useCallback(() => {
        return mutate();
    }, [mutate]);

    return {
        products: data?.products,
        category: data?.category,
        isLoading,
        isMutating,
        error,
        handleDelete,
        handleCreate,
        handleUpdate,
        mutateProducts,
    };
}
