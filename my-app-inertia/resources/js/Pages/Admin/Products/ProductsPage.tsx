import { Head } from "@inertiajs/react";
import Button from "@/Components/common/Button";
import DotLoader from "@/Components/ui/DotLoader";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import PageContent from "@/Components/ui/admin/PageContent";
import { Package, PlusCircle, ArrowLeft } from "lucide-react";
import useProducts from "@/Hooks/use-product";
import DataNotFound from "@/Components/ui/admin/DataNotFound";
import ProductContent from "@/Components/ui/ProductContent";

export default function ProductsPage({
    categorySlug,
}: {
    categorySlug: string;
}) {
    const { products, category, isLoading, error, handleDelete } =
        useProducts(categorySlug);

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Categories", href: "/admin/categories" },
        { label: category ? category.title : "Products" },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen font-medium text-red-600">
                {error.message || "Gagal memuat produk."}
            </div>
        );
    }

    return (
        <>
            <Head
                title={category ? `Products ${category.title}` : "Products"}
            />
            <PageContent
                pageTitle={category ? category.title : "Products"}
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                    <HeaderContent
                        Icon={Package}
                        title={`Products in ${category?.title || "..."}`}
                        description={`Daftar semua produk dalam kategori ${
                            category?.title || "ini"
                        }.`}
                    />
                    <div className="flex justify-end flex-shrink-0">
                        <Button
                            as="link"
                            variant="outline"
                            href={`/admin/categories/${categorySlug}/create`}
                            size="md"
                            iconLeft={<PlusCircle className="h-5 w-5" />}
                        >
                            Add New Product
                        </Button>
                    </div>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <ProductContent
                                key={product.id}
                                imageUrl={product.image_url}
                                title={product.name}
                                description={product.description}
                                href={`/admin/categories/${categorySlug}/products/${product.slug}`}
                                editHref={`/admin/categories/${categorySlug}/edit/${product.slug}`}
                                onDelete={() => handleDelete(product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <DataNotFound
                        title="No Products Found"
                        message="There are no products in this category yet. Click 'Add New Product' to create one."
                    />
                )}

                <div className="mt-6 flex justify-start">
                    <Button
                        as="link"
                        variant="outline"
                        href="/admin/categories"
                        size="md"
                        iconLeft={<ArrowLeft className="h-5 w-5" />}
                    >
                        Back
                    </Button>
                </div>
            </PageContent>
        </>
    );
}
