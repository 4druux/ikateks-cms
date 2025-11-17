import React, { FormEvent, useEffect, useState } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { Package } from "lucide-react";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFields from "@/Components/ui/admin/FormFields";
import { useEntityForm } from "@/Hooks/use-entity-form";
import useSubProducts from "@/Hooks/use-subproducts";
import { toast } from "react-hot-toast";
import { getCategoryBySlug, getProductBySlug } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

interface CreateSubProductsPageProps {
    categorySlug: string;
    productSlug: string;
}

const CreateSubProductsPage: React.FC<CreateSubProductsPageProps> = ({
    categorySlug,
    productSlug,
}) => {
    const [category, setCategory] = useState<{ title: string } | null>(null);
    const [product, setProduct] = useState<{ id: number; name: string } | null>(
        null
    );

    const { handleCreate, isMutating } = useSubProducts(null);

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

    const [productId, setProductId] = useState<string>("");
    productId;
    const [isLoadingParents, setIsLoadingParents] = useState(true);

    useEffect(() => {
        if (!categorySlug || !productSlug) {
            toast.error("Parent info not found. Redirecting...");
            router.visit("/admin/categories");
            return;
        }

        Promise.all([
            getCategoryBySlug(categorySlug),
            getProductBySlug(productSlug),
        ])
            .then(([categoryData, productData]) => {
                setProductId(String(productData.id));
                setCategory(categoryData);
                setProduct(productData);
                setIsLoadingParents(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Parent product/category not found.");
                router.visit("/admin/categories");
            });
    }, [categorySlug, productSlug]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        if (!productId) {
            toast.error("Product ID is missing. Cannot create sub-product.");
            return;
        }

        const formDataToSend = buildFormData("name", {
            product_id: productId,
        });

        await handleCreate(
            formDataToSend,
            () => {
                reset();
                handleRemoveImage();
                router.visit(
                    `/admin/categories/${categorySlug}/products/${productSlug}`
                );
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

    if (isLoadingParents) {
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
        {
            label: product ? product.name : productSlug,
            href: `/admin/categories/${categorySlug}/products/${productSlug}`,
        },
        { label: "Create Sub Product" },
    ];

    return (
        <>
            <Head title="Create Sub Product" /> {}
            <PageContent
                pageTitle="Manage Sub Product"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Package}
                    title="Create Sub Product"
                    description={`Add a new sub-product to ${
                        product?.name || "..."
                    }.`}
                />

                <div className="mt-6">
                    <FormLayout
                        onSubmit={handleSubmit}
                        isMutating={isMutating}
                        submitText="Add Sub Product"
                        mutatingText="Adding..."
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
                </div>
            </PageContent>
        </>
    );
};

export default CreateSubProductsPage;
