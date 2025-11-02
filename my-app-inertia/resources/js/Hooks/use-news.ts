import useSWR from "swr";
import { useCallback, useState } from "react";
import {
    NewsItem,
    createNews,
    deleteNews,
    updateNews,
    fetcher,
} from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const NEWS_API_URL = "/api/admin/news";

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UseNewsReturn {
    newsItems: NewsItem[] | undefined;
    isLoading: boolean;
    isMutating: boolean;
    error: any;
    handleDelete: (id: number) => Promise<void>;

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
    mutateNews: () => Promise<NewsItem[] | undefined>;
}

export default function useNews(): UseNewsReturn {
    const { data, error, isLoading, mutate } = useSWR<NewsItem[]>(
        NEWS_API_URL,
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
            const toastId = toast.loading("Creating news item...");
            try {
                const newNewsItem = await createNews(formData);

                mutate(
                    (currentData = []) => [...currentData, newNewsItem],
                    true
                );

                toast.success("News item created successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to create news item:", err);
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
                            "Failed to create news item.",
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
                    "Are you sure you want to delete this news item?"
                )
            ) {
                setIsMutating(true);
                const toastId = toast.loading("Deleting news item...");

                mutate(
                    (currentData) =>
                        currentData?.filter((item) => item.id !== id),
                    false
                );

                try {
                    await deleteNews(id);
                    toast.success("News item deleted successfully.", {
                        id: toastId,
                    });
                } catch (err: any) {
                    console.error("Failed to delete news item:", err);
                    toast.error(
                        err.response?.data?.message ||
                            "Failed to delete news item.",
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
            const toastId = toast.loading("Updating news item...");
            try {
                const updatedNewsItem = await updateNews(slug, formData);

                mutate(
                    (currentData = []) =>
                        currentData.map((item) =>
                            item.slug === slug ? updatedNewsItem : item
                        ),
                    true
                );

                toast.success("News item updated successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to update news item:", err);
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
                            "Failed to update news item.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutate]
    );

    const mutateNews = useCallback(() => {
        return mutate();
    }, [mutate]);

    return {
        newsItems: data,
        isLoading,
        isMutating,
        error,
        handleDelete,
        handleCreate,
        handleUpdate,
        mutateNews,
    };
}
