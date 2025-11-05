import React, { FormEvent, useState } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { Building2 } from "lucide-react";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFieldsIcon from "@/Components/ui/admin/FormFieldsIcon";
import usePrincipals from "@/Hooks/use-principals";

interface PrincipalsFormData {
    mainField: string;
    description: string;
    mainField_id: string;
    description_id: string;
    icon_name: string;
    methodology: string;
    methodology_id: string;
    order: number;
}

const CreatePrincipalsPage: React.FC = () => {
    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Principals", href: "/admin/principals" },
        { label: "Create" },
    ];

    const { handleCreatePrincipal, isMutating } = usePrincipals();

    const [data, setData] = useState<PrincipalsFormData>({
        mainField: "",
        description: "",
        mainField_id: "",
        description_id: "",
        icon_name: "",
        methodology: "",
        methodology_id: "",
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

        const methodologyArray = data.methodology
            .split("\n")
            .filter((item) => item.trim() !== "");
        const methodologyIdArray = data.methodology_id
            .split("\n")
            .filter((item) => item.trim() !== "");

        const methodologyJson = JSON.stringify(methodologyArray);
        const methodologyIdJson = JSON.stringify(methodologyIdArray);

        const formDataToSend = new FormData();
        formDataToSend.append("title", data.mainField);
        formDataToSend.append("description", data.description);
        formDataToSend.append("title_id", data.mainField_id);
        formDataToSend.append("description_id", data.description_id);
        formDataToSend.append("icon_name", data.icon_name);
        formDataToSend.append("order", data.order.toString());
        formDataToSend.append("methodology", methodologyJson);
        formDataToSend.append("methodology_id", methodologyIdJson);

        await handleCreatePrincipal(
            formDataToSend,
            () => {
                router.visit("/admin/principals");
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
                if (backendErrors.methodology)
                    newErrors.methodology = backendErrors.methodology[0];
                if (backendErrors.methodology_id)
                    newErrors.methodology_id = backendErrors.methodology_id[0];
                if (backendErrors.order)
                    newErrors.order = backendErrors.order[0];
                setErrors(newErrors);
            }
        );
    };

    return (
        <>
            <Head title="Create Principals" />
            <PageContent
                pageTitle="Manage Principals"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Building2}
                    title="Create Principals"
                    description="Add a new principals."
                />

                <div className="mt-6">
                    <FormLayout
                        onSubmit={handleSubmit}
                        isMutating={isMutating}
                        submitText="Add Principals"
                        mutatingText="Adding..."
                        backHref="/admin/principals"
                    >
                        <FormFieldsIcon
                            data={data}
                            errors={errors}
                            handleChange={handleChange}
                            onIconChange={handleIconChange}
                            iconLabel="Principals Icon"
                            titleLabel="Principals Title (English)"
                            titlePlaceholder="e.g., Quality Assurance"
                            descriptionLabel="Content (English)"
                            descriptionPlaceholder="Write the principals content here..."
                            titleIdLabel="Principals Title Title (Indonesia)"
                            titleIdPlaceholder="cth., Jaminan Kualitas"
                            descriptionIdLabel="Content (Indonesia)"
                            descriptionIdPlaceholder="Tulis isi content di sini..."
                            methodologyLabel="Methodology (English)"
                            methodologyPlaceholder="One item per line..."
                            methodologyIdLabel="Methodology (Indonesia)"
                            methodologyIdPlaceholder="Satu item per baris..."
                            orderLabel="Display Order"
                        />
                    </FormLayout>
                </div>
            </PageContent>
        </>
    );
};

export default CreatePrincipalsPage;
