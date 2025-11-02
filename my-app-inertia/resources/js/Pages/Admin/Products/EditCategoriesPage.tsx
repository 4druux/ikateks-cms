import React, { useState, FormEvent, useEffect } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { getCategoryBySlug } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";
import useCategories from "@/Hooks/use-categories";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFields from "@/Components/ui/admin/FormFields";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import { Package } from "lucide-react";
import { useEntityForm } from "@/Hooks/use-entity-form";

const EditCategoriesPage: React.FC<{ slug: string }> = ({ slug }) => {
    const { handleUpdate, isMutating } = useCategories();

    const {
        data,
        errors,
        setData,
        setError,
        clearErrors,
        reset,
        imagePreview,
        setImagePreview,
        setExistingImageUrl,
        handleChange,
        handleImageChange,
        handleRemoveImage,
        buildFormData,
    } = useEntityForm();

    const [isLoading, setIsLoading] = useState(!!slug);
    const [loadedTitle, setLoadedTitle] = useState<string>("...");

    useEffect(() => {
        if (!slug) {
            toast.error("Category slug not found.");
            router.visit("/admin/categories");
            return;
        }

        let isMounted = true;

        getCategoryBySlug(slug)
            .then((category) => {
                if (isMounted) {
                    setData("mainField", category.title);
                    setData("description", category.description);
                    setData("mainField_id", category.title_id);
                    setData("description_id", category.description_id);

                    setLoadedTitle(category.title);
                    setImagePreview(category.image_url);
                    setExistingImageUrl(category.image_url);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error(err);
                    toast.error("Category not found.");
                    router.visit("/admin/categories");
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [setData, setExistingImageUrl, setImagePreview, slug]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        const formDataToSend = buildFormData("title");

        await handleUpdate(
            slug,
            formDataToSend,
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
            },
            () => {
                reset();
                router.visit("/admin/categories");
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

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Categories", href: "/admin/categories" },
        {
            label: isLoading ? "..." : `Edit ${loadedTitle}`,
        },
    ];

    return (
        <>
            <Head title="Edit Category" />
            <PageContent
                pageTitle="Manage Product"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Package}
                    title="Edit Category"
                    description="Update category details."
                />

                <FormLayout
                    onSubmit={handleSubmit}
                    isMutating={isMutating}
                    submitText="Update Category"
                    mutatingText="Updating..."
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
            </PageContent>
        </>
    );
};

export default EditCategoriesPage;
