import React, { FormEvent, useEffect, useState } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { Package } from "lucide-react";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFields from "@/Components/ui/admin/FormFields";
import { useEntityForm } from "@/Hooks/use-entity-form";
import useProducts from "@/Hooks/use-product";
import { toast } from "react-hot-toast";
import { getCategoryBySlug } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

const CreateProductsPage: React.FC<{ categorySlug: string }> = ({
    categorySlug,
}) => {
    const [category, setCategory] = useState<{
        id: number;
        title: string;
    } | null>(null);

    const { handleCreate, isMutating } = useProducts(null);

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

    const [productCategoryId, setProductCategoryId] = useState<string>("");
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);

    useEffect(() => {
        if (!categorySlug) {
            toast.error("Category Slug not found. Redirecting...");
            router.visit("/admin/categories");
            return;
        }

        getCategoryBySlug(categorySlug)
            .then((category) => {
                setProductCategoryId(String(category.id));
                setCategory(category);
                setIsLoadingCategory(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Category not found. Cannot create product.");
                router.visit("/admin/categories");
            });
    }, [categorySlug]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        if (!productCategoryId) {
            toast.error("Category ID is missing. Cannot create product.");
            return;
        }

        const formDataToSend = buildFormData("name", {
            product_category_id: productCategoryId,
        });

        await handleCreate(
            formDataToSend,

            () => {
                reset();
                handleRemoveImage();
                router.visit(`/admin/categories/${categorySlug}`);
            },

            (backendErrors) => {
                if (backendErrors.name) {
                    setError("mainField", backendErrors.name[0]);
                }
                if (backendErrors.description) {
                    setError("description", backendErrors.description[0]);
                }
                if (backendErrors.name_id) {
                    setError("mainField_id", backendErrors.name_id[0]);
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

    if (isLoadingCategory) {
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
            label: category ? category.title : categorySlug,
            href: `/admin/categories/${categorySlug}`,
        },
        { label: "Create Product" },
    ];

    return (
        <>
            <Head title="Create Product" />
            <PageContent
                pageTitle="Manage Product"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Package}
                    title="Create Product"
                    description={`Add a new product to ${categorySlug}.`}
                />

                <div className="mt-6">
                    <FormLayout
                        onSubmit={handleSubmit}
                        isMutating={isMutating}
                        submitText="Add Product"
                        mutatingText="Adding..."
                        backHref={`/admin/categories/${categorySlug}`}
                    >
                        <FormFields
                            data={data}
                            errors={errors}
                            imagePreview={imagePreview}
                            handleChange={handleChange}
                            handleImageChange={handleImageChange}
                            handleRemoveImage={handleRemoveImage}
                            imageLabel="Product Image"
                            titleLabel="Product Name (English)"
                            titlePlaceholder="e.g., Premium Widget"
                            descriptionLabel="Description (English)"
                            descriptionPlaceholder="Briefly describe the product..."
                            titleIdLabel="Product Name (Indonesia)"
                            titleIdPlaceholder="cth., Widget Premium"
                            descriptionIdLabel="Description (Indonesia)"
                            descriptionIdPlaceholder="Jelaskan produk secara singkat..."
                        />
                    </FormLayout>
                </div>
            </PageContent>
        </>
    );
};

export default CreateProductsPage;
