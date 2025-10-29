import useSWR from "swr";
import { useCallback, useState } from "react";
import { Customer, createCustomer, deleteCustomer, fetcher } from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const CUSTOMERS_API_URL = "/api/admin/customers";

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UseCustomersReturn {
    customers: Customer[] | undefined;
    isLoading: boolean;
    isMutating: boolean;
    error: any;
    handleDelete: (id: number) => Promise<void>;
    handleCreate: (
        formData: FormData,
        onValidationError: (errors: Record<string, string[]>) => void,
        onSuccess?: () => void
    ) => Promise<boolean>;
    mutateCustomers: () => Promise<Customer[] | undefined>;
}

export default function useCustomers(): UseCustomersReturn {
    const { data, error, isLoading, mutate } = useSWR<Customer[]>(
        CUSTOMERS_API_URL,
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
            const toastId = toast.loading("Adding customer logo...");
            try {
                const newCustomer = await createCustomer(formData);

                mutate(
                    (currentData = []) => [...currentData, newCustomer],
                    true
                );

                toast.success("Customer logo added successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to add customer logo:", err);
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
                            "Failed to add customer logo.",
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
                    "Are you sure you want to delete this customer logo?"
                )
            ) {
                setIsMutating(true);
                const toastId = toast.loading("Deleting customer logo...");

                mutate(
                    (currentData) =>
                        currentData?.filter((cust) => cust.id !== id),
                    false
                );

                try {
                    await deleteCustomer(id);
                    toast.success("Customer logo deleted successfully.", {
                        id: toastId,
                    });
                } catch (err: any) {
                    console.error("Failed to delete customer logo:", err);
                    toast.error(
                        err.response?.data?.message ||
                            "Failed to delete customer logo.",
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

    const mutateCustomers = useCallback(() => {
        return mutate();
    }, [mutate]);

    return {
        customers: data,
        isLoading,
        isMutating,
        error,
        handleDelete,
        handleCreate,
        mutateCustomers,
    };
}
