import DescriptionField from "@/Components/common/DescriptionField";
import InputField from "@/Components/common/InputField";
import React, { ChangeEvent } from "react";
import IconPicker from "@/Components/ui/admin/IconPicker";

interface FormFieldsIconProps {
    data: {
        mainField: string;
        description: string;
        mainField_id: string;
        description_id: string;
        icon_name: string;
        order: number;
        methodology?: string;
        methodology_id?: string;
    };
    errors: Record<string, string | undefined>;
    handleChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    onIconChange: (name: string) => void;
    iconLabel: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    titleIdLabel: string;
    titleIdPlaceholder: string;
    descriptionIdLabel: string;
    descriptionIdPlaceholder: string;
    orderLabel: string;
    methodologyLabel?: string;
    methodologyPlaceholder?: string;
    methodologyIdLabel?: string;
    methodologyIdPlaceholder?: string;
}

const FormFieldsIcon: React.FC<FormFieldsIconProps> = ({
    data,
    errors,
    handleChange,
    onIconChange,
    iconLabel,
    titleLabel,
    titlePlaceholder,
    descriptionLabel,
    descriptionPlaceholder,
    titleIdLabel,
    titleIdPlaceholder,
    descriptionIdLabel,
    descriptionIdPlaceholder,
    orderLabel,
    methodologyLabel,
    methodologyPlaceholder,
    methodologyIdLabel,
    methodologyIdPlaceholder,
}) => {
    return (
        <>
            <IconPicker
                label={iconLabel}
                selectedIcon={data.icon_name}
                onChange={onIconChange}
                error={errors.icon_name}
            />

            <InputField
                id="mainField"
                name="mainField"
                label={titleLabel}
                value={data.mainField}
                onChange={handleChange}
                error={errors.mainField || errors.title || errors.name}
                placeholder={titlePlaceholder}
            />

            <DescriptionField
                id="description"
                name="description"
                label={descriptionLabel}
                rows={6}
                value={data.description}
                onChange={handleChange}
                error={errors.description}
                placeholder={descriptionPlaceholder}
            />

            <hr className="my-4" />

            <InputField
                id="mainField_id"
                name="mainField_id"
                label={titleIdLabel}
                value={data.mainField_id}
                onChange={handleChange}
                error={errors.mainField_id || errors.title_id || errors.name_id}
                placeholder={titleIdPlaceholder}
            />

            <DescriptionField
                id="description_id"
                name="description_id"
                label={descriptionIdLabel}
                rows={6}
                value={data.description_id}
                onChange={handleChange}
                error={errors.description_id}
                placeholder={descriptionIdPlaceholder}
            />

            {methodologyLabel && (
                <>
                    <hr className="my-4" />
                    <DescriptionField
                        id="methodology"
                        name="methodology"
                        label={methodologyLabel}
                        rows={6}
                        value={data.methodology || ""}
                        onChange={handleChange}
                        error={errors.methodology}
                        placeholder={methodologyPlaceholder}
                    />

                    <DescriptionField
                        id="methodology_id"
                        name="methodology_id"
                        label={methodologyIdLabel || ""}
                        rows={6}
                        value={data.methodology_id || ""}
                        onChange={handleChange}
                        error={errors.methodology_id}
                        placeholder={methodologyIdPlaceholder || ""}
                    />
                </>
            )}

            <hr className="my-4" />

            <InputField
                id="order"
                name="order"
                type="number"
                label={orderLabel}
                value={data.order}
                onChange={handleChange}
                error={errors.order}
                placeholder="e.g., 1"
            />
        </>
    );
};

export default FormFieldsIcon;
