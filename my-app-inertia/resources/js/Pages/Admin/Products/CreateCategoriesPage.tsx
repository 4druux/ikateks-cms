import React, { FormEvent } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { Package } from "lucide-react";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import useCategories from "@/Hooks/use-categories";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFields from "@/Components/ui/admin/FormFields";
import { useEntityForm } from "@/Hooks/use-entity-form";

const CreateCategoriesPage: React.FC = () => {
    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Categories", href: "/admin/categories" },
        { label: "Create" },
    ];

    const { handleCreate, isMutating } = useCategories();

    const {
        data,
        errors,
        setError,
        clearErrors,
        reset,
        imagePreview,
        handleChange,
        handleImageChange,
        handleRemoveImage,
        buildFormData,
    } = useEntityForm();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        const formDataToSend = buildFormData("title");

        await handleCreate(
            formDataToSend,

            () => {
                reset();
                handleRemoveImage();
                router.visit("/admin/categories");
            },

            (backendErrors) => {
                if (backendErrors.title) {
                    setError("mainField", backendErrors.title[0]);
                }
                if (backendErrors.description) {
                    setError("description", backendErrors.description[0]);
                }
                if (backendErrors.title_id) {
                    setError("mainField_id", backendErrors.title_id[0]);
                }
                if (backendErrors.description_id) {
                    setError("description_id", backendErrors.description_id[0]);
                }
                if (backendErrors.image) {
                    setError("image", backendErrors.image[0]);
                }
            }
        );
    };
    return (
        <>
            <Head title="Create Category" />
            <PageContent
                pageTitle="Manage Product"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Package}
                    title="Create Category"
                    description="Add a new category."
                />

                <div className="mt-6">
                    <FormLayout
                        onSubmit={handleSubmit}
                        isMutating={isMutating}
                        submitText="Add Category"
                        mutatingText="Adding..."
                        backHref="/admin/categories"
                    >
                        <FormFields
                            data={data}
                            errors={errors}
                            imagePreview={imagePreview}
                            handleChange={handleChange}
                            handleImageChange={handleImageChange}
                            handleRemoveImage={handleRemoveImage}
                            imageLabel="Image Category"
                            titleLabel="Category Title (English)"
                            titlePlaceholder="e.g., Industrial Chemicals"
                            descriptionLabel="Description (English)"
                            descriptionPlaceholder="Briefly describe the category..."
                            titleIdLabel="Category Title (Indonesia)"
                            titleIdPlaceholder="cth., Bahan Kimia Industri"
                            descriptionIdLabel="Description (Indonesia)"
                            descriptionIdPlaceholder="Jelaskan kategori secara singkat..."
                        />
                    </FormLayout>
                </div>
            </PageContent>
        </>
    );
};

export default CreateCategoriesPage;
