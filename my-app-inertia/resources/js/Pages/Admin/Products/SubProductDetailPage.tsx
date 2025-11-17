import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Product,
    SubProduct,
    getProductBySlug,
    getCategoryBySlug,
    getSubProductBySlug,
} from "@/Utils/api";
import useSubProducts from "@/Hooks/use-subproducts";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import { Package, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface SubProductDetailPageProps {
    categorySlug: string;
    productSlug: string;
    slug: string;
}

const SubProductDetailPage: React.FC<SubProductDetailPageProps> = ({
    categorySlug,
    productSlug,
    slug,
}) => {
    const [subProduct, setSubProduct] = useState<SubProduct | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [category, setCategory] = useState<{ title: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { handleDelete, isMutating } = useSubProducts(productSlug);

    useEffect(() => {
        if (!categorySlug || !productSlug || !slug) {
            toast.error("URL parameter error. Redirecting...");
            router.visit("/admin/categories");
            return;
        }

        Promise.all([
            getSubProductBySlug(slug),
            getProductBySlug(productSlug),
            getCategoryBySlug(categorySlug),
        ])
            .then(([subProductData, productData, categoryData]) => {
                setSubProduct(subProductData);
                setProduct(productData);
                setCategory(categoryData);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Data tidak ditemukan.");
                router.visit(
                    `/admin/categories/${categorySlug}/products/${productSlug}`
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [slug, productSlug, categorySlug]);

    const handleDeleteClick = async () => {
        if (!subProduct) return;

        const deleteWasSuccessful = await handleDelete(subProduct.id);

        if (deleteWasSuccessful) {
            router.visit(
                `/admin/categories/${categorySlug}/products/${productSlug}`
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    if (!subProduct || !product || !category) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Sub-Produk tidak ditemukan.
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Categories", href: "/admin/categories" },
        {
            label: category.title,
            href: `/admin/categories/${categorySlug}`,
        },
        {
            label: product.name,
            href: `/admin/categories/${categorySlug}/products/${productSlug}`,
        },
        { label: subProduct.name },
    ];

    return (
        <>
            <Head title={subProduct.name} />
            <PageContent
                pageTitle={subProduct.name}
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                    <HeaderContent
                        Icon={Package}
                        title={subProduct.name}
                        description="Detail lengkap untuk sub-produk ini."
                    />

                    <div className="flex justify-end flex-shrink-0 gap-2">
                        <Button
                            as="link"
                            variant="outline"
                            href={`/admin/categories/${categorySlug}/products/${productSlug}/subproducts/edit/${subProduct.slug}`}
                            size="md"
                            iconLeft={<Edit className="h-4 w-4" />}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="danger"
                            size="md"
                            iconLeft={<Trash2 className="h-4 w-4" />}
                            onClick={handleDeleteClick}
                            disabled={isMutating}
                        >
                            {isMutating ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        {subProduct.image_url ? (
                            <img
                                src={subProduct.image_url}
                                alt={subProduct.name}
                                className="w-full h-auto object-cover"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                            Description
                        </h3>
                        <div className="prose max-w-none text-gray-700">
                            {subProduct.description ? (
                                <p className="whitespace-pre-wrap">
                                    {subProduct.description}
                                </p>
                            ) : (
                                <p className="italic text-gray-500">
                                    No description provided.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-start">
                    <Button
                        as="link"
                        variant="outline"
                        href={`/admin/categories/${categorySlug}/products/${productSlug}`}
                        size="md"
                        iconLeft={<ArrowLeft className="h-5 w-5" />}
                    >
                        Back
                    </Button>
                </div>
            </PageContent>
        </>
    );
};

export default SubProductDetailPage;
