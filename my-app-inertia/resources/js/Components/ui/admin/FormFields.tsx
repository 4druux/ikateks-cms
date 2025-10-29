import DescriptionField from "@/Components/common/DescriptionField";
import ImageField from "@/Components/common/ImageField";
import InputField from "@/Components/common/InputField";
import React, { ChangeEvent } from "react";

interface FormFieldsProps {
    data: {
        mainField: string;
        description: string;
        mainField_id: string;
        description_id: string;
        image: File | null;
    };
    errors: Record<string, string | undefined>;
    imagePreview: string | null;
    handleChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    handleImageChange: (file: File | null) => void;
    handleRemoveImage: () => void;

    imageLabel: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;

    titleIdLabel: string;
    titleIdPlaceholder: string;
    descriptionIdLabel: string;
    descriptionIdPlaceholder: string;
}

const FormFields: React.FC<FormFieldsProps> = ({
    data,
    errors,
    imagePreview,
    handleChange,
    handleImageChange,
    handleRemoveImage,
    imageLabel,
    titleLabel,
    titlePlaceholder,
    descriptionLabel,
    descriptionPlaceholder,
    titleIdLabel,
    titleIdPlaceholder,
    descriptionIdLabel,
    descriptionIdPlaceholder,
}) => {
    return (
        <>
            <ImageField
                id="image"
                name="image"
                label={imageLabel}
                error={errors.image}
                imagePreview={imagePreview}
                onChange={handleImageChange}
                onRemove={handleRemoveImage}
            />

            <InputField
                id="mainField"
                name="mainField"
                label={titleLabel}
                value={data.mainField}
                onChange={handleChange}
                error={errors.mainField || errors.title || errors.name}
                required
                placeholder={titlePlaceholder}
            />

            <DescriptionField
                id="description"
                name="description"
                label={descriptionLabel}
                rows={4}
                value={data.description}
                onChange={handleChange}
                error={errors.description}
                placeholder={descriptionPlaceholder}
                required
            />

            <hr className="my-4" />

            <InputField
                id="mainField_id"
                name="mainField_id"
                label={titleIdLabel}
                value={data.mainField_id}
                onChange={handleChange}
                error={errors.mainField_id || errors.title_id || errors.name_id}
                required
                placeholder={titleIdPlaceholder}
            />

            <DescriptionField
                id="description_id"
                name="description_id"
                label={descriptionIdLabel}
                rows={4}
                value={data.description_id}
                onChange={handleChange}
                error={errors.description_id}
                placeholder={descriptionIdPlaceholder}
                required
            />
        </>
    );
};

export default FormFields;
