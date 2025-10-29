import Button from "@/Components/common/Button";
import DotLoader from "@/Components/ui/DotLoader";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import PageContent from "@/Components/ui/admin/PageContent";
import { Package, PlusCircle } from "lucide-react";
import { Head } from "@inertiajs/react";
import useCategories from "@/Hooks/use-categories";
import DataNotFound from "@/Components/ui/admin/DataNotFound";
import ProductContent from "@/Components/ui/ProductContent";

export default function CategoriesPage() {
    const { categories, isLoading, error, handleDelete } = useCategories();
    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Categories" },
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
                {error}
            </div>
        );
    }

    return (
        <>
            <Head title="Products" />
            <PageContent
                pageTitle="Manage Product"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                    <HeaderContent
                        Icon={Package}
                        title="Product Categories List"
                        description="List of all product categories."
                    />

                    <div className="flex justify-end flex-shrink-0">
                        <Button
                            as="link"
                            variant="outline"
                            href="/admin/categories/create"
                            size="md"
                            iconLeft={<PlusCircle className="h-5 w-5" />}
                        >
                            Add New Category
                        </Button>
                    </div>
                </div>

                {categories && categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {categories.map((category) => (
                            <ProductContent
                                key={category.id}
                                imageUrl={category.image_url}
                                title={category.title}
                                description={category.description}
                                href={`/admin/categories/${category.slug}`}
                                editHref={`/admin/categories/edit/${category.slug}`}
                                onDelete={() => handleDelete(category.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <DataNotFound
                        title="No Categories Found"
                        message="There are no product categories yet. Click 'Add New Category' to create one."
                    />
                )}
            </PageContent>
        </>
    );
}
