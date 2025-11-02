import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { useForm } from "@inertiajs/react";

interface EntityFormData {
    mainField: string;
    description: string;
    mainField_id: string;
    description_id: string;
    image: File | null;
}

type FormErrors = Record<
    "mainField" | "description" | "mainField_id" | "description_id" | "image",
    string | undefined
>;

export interface UseEntityFormReturn {
    data: EntityFormData;
    errors: FormErrors;
    setData: (key: keyof EntityFormData, value: any) => void;
    setError: (key: keyof FormErrors | string, value: string) => void;
    clearErrors: (...args: any) => void;
    reset: () => void;
    imagePreview: string | null;
    setImagePreview: (src: string | null) => void;
    setExistingImageUrl: (src: string | null) => void;
    handleChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    handleImageChange: (file: File | null) => void;
    handleRemoveImage: () => void;
    buildFormData: (
        mainFieldKey: "title" | "name",
        additionalData?: Record<string, any>
    ) => FormData;
}

export function useEntityForm(): UseEntityFormReturn {
    const { data, setData, errors, setError, clearErrors, reset } =
        useForm<EntityFormData>({
            mainField: "",
            description: "",
            mainField_id: "",
            description_id: "",
            image: null,
        });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
        null
    );

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setData(name as keyof EntityFormData, value);

            if (errors[name as keyof FormErrors]) {
                clearErrors(name as keyof FormErrors);
            }
        },
        [errors, setData, clearErrors]
    );

    const handleImageChange = useCallback(
        (file: File | null) => {
            setData("image", file);
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
                if (errors.image) {
                    clearErrors("image");
                }
            } else {
                setImagePreview(existingImageUrl);
            }
        },
        [errors, setData, clearErrors, existingImageUrl]
    );

    const handleRemoveImage = useCallback(() => {
        setData("image", null);
        setImagePreview(null);
    }, [setData]);

    const buildFormData = useCallback(
        (
            mainFieldKey: "title" | "name",
            additionalData?: Record<string, any>
        ): FormData => {
            const formDataToSend = new FormData();
            const mainFieldIdKey =
                mainFieldKey === "title" ? "title_id" : "name_id";

            formDataToSend.append(mainFieldKey, data.mainField);
            formDataToSend.append("description", data.description);
            formDataToSend.append(mainFieldIdKey, data.mainField_id);
            formDataToSend.append("description_id", data.description_id);

            if (data.image) {
                formDataToSend.append("image", data.image);
            }

            if (additionalData) {
                Object.keys(additionalData).forEach((key) => {
                    if (
                        additionalData[key] !== null &&
                        additionalData[key] !== undefined
                    ) {
                        formDataToSend.append(key, additionalData[key]);
                    }
                });
            }

            return formDataToSend;
        },
        [data]
    );

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return {
        data,
        errors: errors as FormErrors,
        setData,
        setError: setError as (
            key: keyof FormErrors | string,
            value: string
        ) => void,
        clearErrors,
        reset,
        imagePreview,
        setImagePreview,
        setExistingImageUrl,
        handleChange,
        handleImageChange,
        handleRemoveImage,
        buildFormData,
    };
}
