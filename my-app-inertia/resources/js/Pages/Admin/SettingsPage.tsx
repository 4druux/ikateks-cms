import React, { FormEvent, useState } from "react";
import { Head } from "@inertiajs/react";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import { Settings, Trash2, PlusCircle, Save } from "lucide-react";
import useSettings from "@/Hooks/use-settings";
import { SettingsData, SocialLink } from "@/Utils/api/settings";
import InputField from "@/Components/common/InputField";
import DescriptionField from "@/Components/common/DescriptionField";
import IconSocmedPicker from "@/Components/ui/admin/IconSocmedPicker";

const defaultValues: SettingsData = {
    id: 1,
    footer_description: "",
    footer_description_id: "",
    contact_phone_number: "",
    contact_phone_href: "",
    contact_email: "",
    location_address: "",
    location_address_id: "",
    location_href: "",
    company_name: "",
    copyright_text: "",
    copyright_text_id: "",
    social_links: [],
    created_at: "",
    updated_at: "",
};

interface SettingsFormProps {
    initialData: SettingsData;
    isMutating: boolean;
    onUpdate: (
        data: SettingsData,
        onValidationError: (errors: Record<string, string[]>) => void,
        onSuccess?: () => void
    ) => Promise<boolean>;
}

const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData,
    isMutating,
    onUpdate,
}) => {
    const [data, setData] = useState<SettingsData>(() => ({
        ...defaultValues,
        ...initialData,
        social_links: initialData.social_links || [],
    }));

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSocialChange = (
        index: number,
        field: keyof SocialLink,
        value: string
    ) => {
        const updatedLinks = (data.social_links || []).map((link, i) =>
            i === index ? { ...link, [field]: value } : link
        );
        setData((prevData) => ({ ...prevData, social_links: updatedLinks }));
    };

    const addSocialLink = () => {
        const newLink: SocialLink = { name: "", href: "", icon_name: "FaLink" };
        setData((prevData) => ({
            ...prevData,
            social_links: [...(prevData.social_links || []), newLink],
        }));
    };

    const removeSocialLink = (index: number) => {
        const updatedLinks = (data.social_links || []).filter(
            (_, i) => i !== index
        );
        setData((prevData) => ({ ...prevData, social_links: updatedLinks }));
    };

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        onUpdate(
            data,
            (validationErrors) => {
                const flattenedErrors: Record<string, string> = {};
                for (const key in validationErrors) {
                    if (validationErrors[key]) {
                        flattenedErrors[key] = validationErrors[key][0];
                    }
                }
                setErrors(flattenedErrors);
            },
            () => {}
        );
    };

    return (
        <form onSubmit={submitHandler} className="space-y-10 mt-6">
            <div className="p-6 border rounded-lg shadow-sm bg-white">
                <h3 className="text-xl font-medium mb-6 text-zinc-800">
                    Brand & Description
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DescriptionField
                        id="footer_description"
                        name="footer_description"
                        label="Footer Description (EN)"
                        value={data.footer_description || ""}
                        onChange={handleChange}
                        error={errors.footer_description}
                        rows={4}
                    />
                    <DescriptionField
                        id="footer_description_id"
                        name="footer_description_id"
                        label="Footer Description (ID)"
                        value={data.footer_description_id || ""}
                        onChange={handleChange}
                        error={errors.footer_description_id}
                        rows={4}
                    />
                </div>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-white">
                <h3 className="text-xl font-medium mb-6 text-zinc-800">
                    Contact Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        id="contact_phone_number"
                        name="contact_phone_number"
                        label="Phone Number (Display)"
                        value={data.contact_phone_number || ""}
                        onChange={handleChange}
                        error={errors.contact_phone_number}
                    />
                    <InputField
                        id="contact_phone_href"
                        name="contact_phone_href"
                        label="Phone Link (href)"
                        value={data.contact_phone_href || ""}
                        onChange={handleChange}
                        placeholder="https://api.whatsapp.com/..."
                        error={errors.contact_phone_href}
                    />
                    <div className="md:col-span-2">
                        <InputField
                            id="contact_email"
                            name="contact_email"
                            type="email"
                            label="Email Address"
                            value={data.contact_email || ""}
                            onChange={handleChange}
                            error={errors.contact_email}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-white">
                <h3 className="text-xl font-medium mb-6 text-zinc-800">
                    Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DescriptionField
                        id="location_address"
                        name="location_address"
                        label="Address (EN)"
                        value={data.location_address || ""}
                        onChange={handleChange}
                        error={errors.location_address}
                        rows={3}
                    />
                    <DescriptionField
                        id="location_address_id"
                        name="location_address_id"
                        label="Address (ID)"
                        value={data.location_address_id || ""}
                        onChange={handleChange}
                        error={errors.location_address_id}
                        rows={3}
                    />
                    <div className="md:col-span-2">
                        <InputField
                            id="location_href"
                            name="location_href"
                            label="Google Maps Link (href)"
                            value={data.location_href || ""}
                            onChange={handleChange}
                            placeholder="https://maps.app.goo.gl/..."
                            error={errors.location_href}
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-zinc-800">
                        Social Media Links
                    </h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSocialLink}
                        iconLeft={<PlusCircle className="w-4 h-4" />}
                    >
                        Add Link
                    </Button>
                </div>
                <div className="space-y-6">
                    {(data.social_links || []).map((link, index) => (
                        <div
                            key={index}
                            className="p-4 border rounded-md bg-zinc-50 space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    id={`social_name_${index}`}
                                    name={`social_links[${index}][name]`}
                                    label="Name"
                                    value={link.name}
                                    onChange={(e) =>
                                        handleSocialChange(
                                            index,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., Facebook"
                                    error={errors[`social_links.${index}.name`]}
                                />
                                <InputField
                                    id={`social_href_${index}`}
                                    name={`social_links[${index}][href]`}
                                    label="Link (href)"
                                    value={link.href}
                                    onChange={(e) =>
                                        handleSocialChange(
                                            index,
                                            "href",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://facebook.com/..."
                                    error={errors[`social_links.${index}.href`]}
                                />
                            </div>
                            <div>
                                <IconSocmedPicker
                                    label="Icon"
                                    selectedIcon={link.icon_name}
                                    onChange={(iconName) =>
                                        handleSocialChange(
                                            index,
                                            "icon_name",
                                            iconName
                                        )
                                    }
                                    error={
                                        errors[
                                            `social_links.${index}.icon_name`
                                        ]
                                    }
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeSocialLink(index)}
                                    iconLeft={<Trash2 className="w-4 h-4" />}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}
                    {(!data.social_links || data.social_links.length === 0) && (
                        <p className="text-center text-zinc-500 py-4">
                            No social media links added.
                        </p>
                    )}
                </div>
            </div>

            <div className="p-6 border rounded-lg shadow-sm bg-white">
                <h3 className="text-xl font-medium mb-6 text-zinc-800">
                    Copyright
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField
                        id="company_name"
                        name="company_name"
                        label="Company Name"
                        value={data.company_name || ""}
                        onChange={handleChange}
                        error={errors.company_name}
                    />
                    <InputField
                        id="copyright_text"
                        name="copyright_text"
                        label="Copyright (EN)"
                        value={data.copyright_text || ""}
                        onChange={handleChange}
                        error={errors.copyright_text}
                    />
                    <InputField
                        id="copyright_text_id"
                        name="copyright_text_id"
                        label="Copyright (ID)"
                        value={data.copyright_text_id || ""}
                        onChange={handleChange}
                        error={errors.copyright_text_id}
                    />
                </div>
            </div>

            <div className="flex justify-end items-center gap-4 py-4">
                <Button
                    type="submit"
                    variant="primary"
                    size={"md"}
                    disabled={isMutating}
                    iconLeft={<Save className="w-4 h-4" />}
                >
                    {isMutating ? "Saving..." : "Save All Settings"}
                </Button>
            </div>
        </form>
    );
};

export default function SettingsPage() {
    const { settingsData, isLoading, isMutating, error, handleUpdate } =
        useSettings();

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Settings" },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <>
                <Head title="Error" />
                <PageContent
                    breadcrumbItems={breadcrumbItems}
                    pageTitle="Site Settings"
                >
                    <p className="text-red-600">
                        Failed to load settings data.
                    </p>
                </PageContent>
            </>
        );
    }

    return (
        <>
            <Head title="Site Settings" />
            <PageContent
                breadcrumbItems={breadcrumbItems}
                pageTitle="Site Settings"
                pageClassName="mt-5"
            >
                <HeaderContent
                    Icon={Settings}
                    title="Site Settings"
                    description="Manage global settings for your website footer and contacts."
                />

                {settingsData && (
                    <SettingsForm
                        initialData={settingsData}
                        isMutating={isMutating}
                        onUpdate={handleUpdate}
                    />
                )}
            </PageContent>
        </>
    );
}
