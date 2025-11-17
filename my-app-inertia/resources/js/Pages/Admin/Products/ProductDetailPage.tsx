import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { getCategoryBySlug } from "@/Utils/api";
import useSubProducts from "@/Hooks/use-subproducts";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import { Package, ArrowLeft, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import ProductContent from "@/Components/ui/ProductContent";
import DataNotFound from "@/Components/ui/admin/DataNotFound";

const ProductDetailPage: React.FC<{ categorySlug: string; slug: string }> = ({
    categorySlug,
    slug,
}) => {
    const [category, setCategory] = useState<{ title: string } | null>(null);
    const { product, subProducts, isLoading, error, handleDelete } =
        useSubProducts(slug);

    useEffect(() => {
        if (!categorySlug) {
            toast.error("Category Slug not found. Redirecting...");
            router.visit("/admin/categories");
            return;
        }

        getCategoryBySlug(categorySlug)
            .then((categoryData) => {
                setCategory(categoryData);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Kategori tidak ditemukan.");
                router.visit(`/admin/categories/`);
            });
    }, [categorySlug]);

    useEffect(() => {
        if (error) {
            console.error(error);
            toast.error("Gagal memuat produk.");
            router.visit(`/admin/categories/${categorySlug}`);
        }
    }, [error, categorySlug]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Produk tidak ditemukan.
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Categories", href: "/admin/categories" },
        {
            label: category ? category.title : isLoading ? "..." : categorySlug,
            href: `/admin/categories/${categorySlug}`,
        },
        { label: product.name },
    ];

    return (
        <>
            <Head title={product.name} />
            <PageContent
                pageTitle={product.name}
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                    <HeaderContent
                        Icon={Package}
                        title={product.name}
                        description="Detail lengkap untuk produk ini."
                    />

                    <div className="flex justify-end flex-shrink-0">
                        <Button
                            as="link"
                            variant="outline"
                            href={`/admin/categories/${categorySlug}/products/${product.slug}/subproducts/create`}
                            size="md"
                            iconLeft={<PlusCircle className="h-5 w-5" />}
                        >
                            Add New Sub Product
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.name}
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
                            {product.description ? (
                                <p className="whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            ) : (
                                <p className="italic text-gray-500">
                                    No description provided.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Sub Products
                    </h2>
                    {subProducts && subProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {subProducts.map((subProduct) => (
                                <ProductContent
                                    key={subProduct.id}
                                    imageUrl={subProduct.image_url}
                                    title={subProduct.name}
                                    description={subProduct.description}
                                    href={`/admin/categories/${categorySlug}/products/${slug}/subproducts/${subProduct.slug}`}
                                    editHref={`/admin/categories/${categorySlug}/products/${slug}/subproducts/edit/${subProduct.slug}`}
                                    onDelete={() => handleDelete(subProduct.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <DataNotFound
                            title="No Sub-Products Found"
                            message="There are no sub-products in this product yet. Click 'Add New Sub Product' to create one."
                        />
                    )}
                </div>

                <div className="mt-6 flex justify-start">
                    <Button
                        as="link"
                        variant="outline"
                        href={`/admin/categories/${categorySlug}`}
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

export default ProductDetailPage;
