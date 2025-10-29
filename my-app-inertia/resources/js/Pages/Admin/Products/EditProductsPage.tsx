import React, { useState, FormEvent, useEffect } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { getProductBySlug } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFields from "@/Components/ui/admin/FormFields";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import { Package } from "lucide-react";
import { useEntityForm } from "@/Hooks/use-entity-form";
import useProducts from "@/Hooks/use-product";

const EditProductsPage: React.FC<{ categorySlug: string; slug: string }> = ({
    categorySlug,
    slug,
}) => {
    const { handleUpdate, isMutating } = useProducts(null);

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
    const [loadedName, setLoadedName] = useState<string>("...");
    const [productCategoryId, setProductCategoryId] = useState<string>("");

    useEffect(() => {
        if (!categorySlug) {
            toast.error("Category Slug not found. Redirecting...");
            router.visit("/admin/categories");
            return;
        }
        if (!slug) {
            toast.error("Gagal memuat slug produk.");
            router.visit(`/admin/categories/${categorySlug}`);
            return;
        }

        getProductBySlug(slug)
            .then((product) => {
                setData("mainField", product.name);
                setData("description", product.description);
                setData("mainField_id", product.name_id);
                setData("description_id", product.description_id);

                setProductCategoryId(String(product.product_category_id));
                setLoadedName(product.name);
                setImagePreview(product.image_url);
                setExistingImageUrl(product.image_url);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Produk tidak ditemukan atau gagal dimuat.");
                router.visit(`/admin/categories/${categorySlug}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [slug, categorySlug, setData, setImagePreview, setExistingImageUrl]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        if (!productCategoryId) {
            toast.error("Category ID is missing. Cannot update product.");
            return;
        }

        const formDataToSend = buildFormData("name", {
            product_category_id: productCategoryId,
        });

        await handleUpdate(
            slug,
            formDataToSend,
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
            },
            () => {
                reset();
                router.visit(`/admin/categories/${categorySlug}`);
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
        { label: categorySlug, href: `/admin/categories/${categorySlug}` },
        { label: isLoading ? "..." : `Edit ${loadedName}` },
    ];

    return (
        <>
            <Head title="Edit Product" />
            <PageContent
                pageTitle="Manage Product"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Package}
                    title="Edit Product"
                    description={`Update details for ${loadedName}.`}
                />

                <FormLayout
                    onSubmit={handleSubmit}
                    isMutating={isMutating}
                    submitText="Update Product"
                    mutatingText="Updating..."
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
            </PageContent>
        </>
    );
};

export default EditProductsPage;
