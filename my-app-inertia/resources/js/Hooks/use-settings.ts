import useSWR from "swr";
import { useCallback, useState } from "react";
import { SettingsData, updateSettings, getSettings } from "@/Utils/api";
import { toast } from "react-hot-toast";
import axios from "axios";

const SETTINGS_API_URL = "/api/admin/settings";

interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string[]>;
}

interface UseSettingsReturn {
    settingsData: SettingsData | undefined;
    isLoading: boolean;
    isMutating: boolean;
    error: any;
    handleUpdate: (
        data: Partial<SettingsData>,
        onValidationError: (errors: Record<string, string[]>) => void,
        onSuccess?: () => void
    ) => Promise<boolean>;
    mutateSettings: () => Promise<SettingsData | undefined>;
}

export default function useSettings(): UseSettingsReturn {
    const { data, error, isLoading, mutate } = useSWR<SettingsData>(
        SETTINGS_API_URL,
        getSettings,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        }
    );

    const [isMutating, setIsMutating] = useState(false);

    const handleUpdate = useCallback(
        async (
            data: Partial<SettingsData>,
            onValidationError: (errors: Record<string, string[]>) => void,
            onSuccess?: () => void
        ): Promise<boolean> => {
            setIsMutating(true);
            const toastId = toast.loading("Updating settings...");

            try {
                const updatedSettings = await updateSettings(data);

                mutate(updatedSettings, false);

                toast.success("Settings updated successfully!", {
                    id: toastId,
                });
                if (onSuccess) {
                    onSuccess();
                }
                setIsMutating(false);
                return true;
            } catch (err: any) {
                console.error("Failed to update settings:", err);
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
                            "Failed to update settings.",
                        { id: toastId }
                    );
                }
                setIsMutating(false);
                return false;
            }
        },
        [mutate]
    );

    const mutateSettings = useCallback(() => {
        return mutate();
    }, [mutate]);

    return {
        settingsData: data,
        isLoading,
        isMutating,
        error,
        handleUpdate,
        mutateSettings,
    };
}
