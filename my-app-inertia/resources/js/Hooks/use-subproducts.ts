import useSWR from "swr";
import { useCallback, useState } from "react";
import {
    Product,
    SubProduct,
    createSubProduct,
    deleteSubProduct,
    updateSubProduct,
    fetcher,
} from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

interface SubProductsResponse {
    product: Product;
    subProducts: SubProduct[];
}

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UseSubProductsReturn {
    subProducts: SubProduct[] | undefined;
    product: Product | undefined;
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
        slug: string,
        formData: FormData,
        onValidationError: (errors: Record<string, string[]>) => void,
        onSuccess?: () => void
    ) => Promise<boolean>;

    mutateSubProducts: () => Promise<SubProductsResponse | undefined>;
}

export default function useSubProducts(
    productSlug: string | null
): UseSubProductsReturn {
    const SUB_PRODUCTS_API_URL = productSlug
        ? `/api/admin/products/${productSlug}/subproducts`
        : null;

    const { data, error, isLoading, mutate } = useSWR<SubProductsResponse>(
        SUB_PRODUCTS_API_URL,
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
            const toastId = toast.loading("Creating sub-product...");
            try {
                const newSubProduct = await createSubProduct(formData);

                mutate(
                    (currentData) =>
                        currentData
                            ? {
                                  ...currentData,
                                  subProducts: [
                                      ...currentData.subProducts,
                                      newSubProduct,
                                  ],
                              }
                            : undefined,
                    true
                );

                toast.success("Sub-product created successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to create sub-product:", err);
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
                            "Failed to create sub-product.",
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
                window.confirm(
                    "Are you sure you want to delete this sub-product?"
                )
            ) {
                setIsMutating(true);
                const toastId = toast.loading("Deleting sub-product...");

                mutate(
                    (currentData) =>
                        currentData
                            ? {
                                  ...currentData,
                                  subProducts: currentData.subProducts.filter(
                                      (sp) => sp.id !== id
                                  ),
                              }
                            : undefined,
                    false
                );

                try {
                    await deleteSubProduct(id);
                    toast.success("Sub-product deleted successfully.", {
                        id: toastId,
                    });
                    setIsMutating(false);
                    return true;
                } catch (err: any) {
                    console.error("Failed to delete sub-product:", err);
                    toast.error(
                        err.response?.data?.message ||
                            "Failed to delete sub-product.",
                        { id: toastId }
                    );
                    mutate();
                    setIsMutating(false);
                    return false;
                }
            }
            return false;
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
            const toastId = toast.loading("Updating sub-product...");
            try {
                const updatedSubProduct = await updateSubProduct(
                    slug,
                    formData
                );

                mutate(
                    (currentData) =>
                        currentData
                            ? {
                                  ...currentData,
                                  subProducts: currentData.subProducts.map(
                                      (sp) =>
                                          sp.slug === slug
                                              ? updatedSubProduct
                                              : sp
                                  ),
                              }
                            : undefined,
                    true
                );

                toast.success("Sub-product updated successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to update sub-product:", err);
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
                            "Failed to update sub-product.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutate]
    );

    const mutateSubProducts = useCallback(() => {
        return mutate();
    }, [mutate]);

    return {
        subProducts: data?.subProducts,
        product: data?.product,
        isLoading,
        isMutating,
        error,
        handleDelete,
        handleCreate,
        handleUpdate,
        mutateSubProducts,
    };
}
