import React, { FormEvent, useState, useEffect } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { Building2 } from "lucide-react";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import useAdvantage from "@/Hooks/use-advantage";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFieldsIcon from "@/Components/ui/admin/FormFieldsIcon";
import { toast } from "react-hot-toast";
import { getAdvantageById } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

interface AdvantageFormData {
    mainField: string;
    description: string;
    mainField_id: string;
    description_id: string;
    icon_name: string;
    order: number;
}

const EditAdvantagesPage: React.FC<{ id: number }> = ({ id }) => {
    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "About", href: "/admin/about" },
        { label: "Edit Company Advantage" },
    ];

    const { handleUpdate, isMutating } = useAdvantage();
    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState<AdvantageFormData>({
        mainField: "",
        description: "",
        mainField_id: "",
        description_id: "",
        icon_name: "Handshake",
        order: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getAdvantageById(id)
            .then((advantage) => {
                setData({
                    mainField: advantage.title,
                    description: advantage.description,
                    mainField_id: advantage.title_id,
                    description_id: advantage.description_id,
                    icon_name: advantage.icon_name,
                    order: advantage.order,
                });
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load advantage data.");
                router.visit("/admin/about");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

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
        formDataToSend.append("_method", "PUT");

        await handleUpdate(
            id,
            formDataToSend,
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
            },
            () => {
                router.visit("/admin/about");
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    return (
        <>
            <Head title="Edit Company Advantage" />
            <PageContent
                pageTitle="Manage Company Advantage"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Building2}
                    title="Edit Company Advantage"
                    description="Update the company advantage details."
                />

                <div className="mt-6">
                    <FormLayout
                        onSubmit={handleSubmit}
                        isMutating={isMutating}
                        submitText="Update Advantage"
                        mutatingText="Updating..."
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

export default EditAdvantagesPage;
