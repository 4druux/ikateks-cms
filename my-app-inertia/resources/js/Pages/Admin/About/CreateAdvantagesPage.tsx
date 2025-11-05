import React, { FormEvent, useState } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { Building2 } from "lucide-react";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import useAdvantage from "@/Hooks/use-advantage";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFieldsIcon from "@/Components/ui/admin/FormFieldsIcon";

interface AdvantageFormData {
    mainField: string;
    description: string;
    mainField_id: string;
    description_id: string;
    icon_name: string;
    order: number;
}

const CreateAdvantagesPage: React.FC = () => {
    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "About", href: "/admin/about" },
        { label: "Create Company Advantage" },
    ];

    const { handleCreate, isMutating } = useAdvantage();

    const [data, setData] = useState<AdvantageFormData>({
        mainField: "",
        description: "",
        mainField_id: "",
        description_id: "",
        icon_name: "",
        order: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleIconChange = (name: string) => {
        setData((prev) => ({ ...prev, icon_name: name }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const formDataToSend = new FormData();
        formDataToSend.append("title", data.mainField);
        formDataToSend.append("description", data.description);
        formDataToSend.append("title_id", data.mainField_id);
        formDataToSend.append("description_id", data.description_id);
        formDataToSend.append("icon_name", data.icon_name);
        formDataToSend.append("order", data.order.toString());

        await handleCreate(
            formDataToSend,

            () => {
                router.visit("/admin/about");
            },

            (backendErrors) => {
                const newErrors: Record<string, string> = {};
                if (backendErrors.title)
                    newErrors.mainField = backendErrors.title[0];
                if (backendErrors.description)
                    newErrors.description = backendErrors.description[0];
                if (backendErrors.title_id)
                    newErrors.mainField_id = backendErrors.title_id[0];
                if (backendErrors.description_id)
                    newErrors.description_id = backendErrors.description_id[0];
                if (backendErrors.icon_name)
                    newErrors.icon_name = backendErrors.icon_name[0];
                if (backendErrors.order)
                    newErrors.order = backendErrors.order[0];
                setErrors(newErrors);
            }
        );
    };

    return (
        <>
            <Head title="Create Company Advantage" />
            <PageContent
                pageTitle="Manage Company Advantage"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Building2}
                    title="Create Company Advantage"
                    description="Add a new company advantage."
                />

                <div className="mt-6">
                    <FormLayout
                        onSubmit={handleSubmit}
                        isMutating={isMutating}
                        submitText="Add Advantage"
                        mutatingText="Adding..."
                        backHref="/admin/about"
                    >
                        <FormFieldsIcon
                            data={data}
                            errors={errors}
                            handleChange={handleChange}
                            onIconChange={handleIconChange}
                            iconLabel="Advantage Icon"
                            titleLabel="Company Advantage Title (English)"
                            titlePlaceholder="e.g., Quality Assurance"
                            descriptionLabel="Content (English)"
                            descriptionPlaceholder="Write the advantage content here..."
                            titleIdLabel="Company Advantage Title (Indonesia)"
                            titleIdPlaceholder="cth., Jaminan Kualitas"
                            descriptionIdLabel="Content (Indonesia)"
                            descriptionIdPlaceholder="Tulis isi content di sini..."
                            orderLabel="Display Order"
                        />
                    </FormLayout>
                </div>
            </PageContent>
        </>
    );
};

export default CreateAdvantagesPage;
