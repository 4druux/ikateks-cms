import React, { useState, FormEvent, useEffect } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import {
    getProductBySlug,
    getCategoryBySlug,
    getSubProductBySlug,
} from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFields from "@/Components/ui/admin/FormFields";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import { Package } from "lucide-react";
import { useEntityForm } from "@/Hooks/use-entity-form";
import useSubProducts from "@/Hooks/use-subproducts";

interface EditSubProductsPageProps {
    categorySlug: string;
    productSlug: string;
    slug: string;
}

const EditSubProductsPage: React.FC<EditSubProductsPageProps> = ({
    categorySlug,
    productSlug,
    slug,
}) => {
    const { handleUpdate, isMutating } = useSubProducts(null);

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
    const [productId, setProductId] = useState<string>("");
    const [category, setCategory] = useState<{ title: string } | null>(null);
    const [product, setProduct] = useState<{ name: string } | null>(null);

    useEffect(() => {
        if (!categorySlug || !productSlug || !slug) {
            toast.error("URL parameter is missing. Redirecting...");
            router.visit("/admin/categories");
            return;
        }

        Promise.all([
            getCategoryBySlug(categorySlug),
            getProductBySlug(productSlug),
            getSubProductBySlug(slug),
        ])
            .then(([categoryData, productData, subProductData]) => {
                setData("mainField", subProductData.name);
                setData("description", subProductData.description);
                setData("mainField_id", subProductData.name_id);
                setData("description_id", subProductData.description_id);
                setProductId(String(subProductData.product_id));
                setLoadedName(subProductData.name);
                setImagePreview(subProductData.image_url);
                setExistingImageUrl(subProductData.image_url);

                setCategory(categoryData);
                setProduct(productData);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Data not found.");
                router.visit(
                    `/admin/categories/${categorySlug}/products/${productSlug}`
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [
        slug,
        productSlug,
        categorySlug,
        setData,
        setImagePreview,
        setExistingImageUrl,
    ]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        if (!productId) {
            toast.error("Product ID is missing. Cannot update sub-product.");
            return;
        }

        const formDataToSend = buildFormData("name", {
            product_id: productId,
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
                router.visit(
                    `/admin/categories/${categorySlug}/products/${productSlug}`
                );
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
            label: category ? category.title : "...",
            href: `/admin/categories/${categorySlug}`,
        },
        {
            label: product ? product.name : "...",
            href: `/admin/categories/${categorySlug}/products/${productSlug}`,
        },
        { label: isLoading ? "..." : `Edit ${loadedName}` },
    ];

    return (
        <>
            <Head title="Edit Sub Product" />
            <PageContent
                pageTitle="Manage Sub Product"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Package}
                    title="Edit Sub Product"
                    description={`Update details for ${loadedName}.`}
                />

                <FormLayout
                    onSubmit={handleSubmit}
                    isMutating={isMutating}
                    submitText="Update Sub Product"
                    mutatingText="Updating..."
                    backHref={`/admin/categories/${categorySlug}/products/${productSlug}`}
                >
                    <FormFields
                        data={data}
                        errors={errors}
                        imagePreview={imagePreview}
                        handleChange={handleChange}
                        handleImageChange={handleImageChange}
                        handleRemoveImage={handleRemoveImage}
                        imageLabel="Sub Product Image"
                        titleLabel="Sub Product Name (English)"
                        titlePlaceholder="e.g., Small Part A"
                        descriptionLabel="Description (English)"
                        descriptionPlaceholder="Briefly describe the sub-product..."
                        titleIdLabel="Sub Product Name (Indonesia)"
                        titleIdPlaceholder="cth., Bagian Kecil A"
                        descriptionIdLabel="Description (Indonesia)"
                        descriptionIdPlaceholder="Jelaskan sub-produk secara singkat..."
                    />
                </FormLayout>
            </PageContent>
        </>
    );
};

export default EditSubProductsPage;
