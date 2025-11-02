import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { Product, getProductBySlug } from "@/Utils/api";
import useProducts from "@/Hooks/use-product";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import { Package, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const ProductDetailPage: React.FC<{ categorySlug: string; slug: string }> = ({
    categorySlug,
    slug,
}) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { handleDelete, isMutating } = useProducts(categorySlug);

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
            .then((data) => {
                setProduct(data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Produk tidak ditemukan atau gagal dimuat.");
                router.visit(`/admin/categories/${categorySlug}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [slug, categorySlug]);

    const handleDeleteClick = async () => {
        if (!product) return;
        await handleDelete(product.id);

        if (!isMutating) {
            router.visit(`/admin/categories/${categorySlug}`);
        }
    };

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
        { label: categorySlug, href: `/admin/categories/${categorySlug}` },
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

                    <div className="flex justify-end flex-shrink-0 gap-2">
                        <Button
                            as="link"
                            variant="outline"
                            href={`/admin/categories/${categorySlug}/edit/${product.slug}`}
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
