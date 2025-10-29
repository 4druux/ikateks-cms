import Button from "@/Components/common/Button";
import DotLoader from "@/Components/ui/DotLoader";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import PageContent from "@/Components/ui/admin/PageContent";
import { Newspaper, PlusCircle } from "lucide-react";
import { Head } from "@inertiajs/react";
import DataNotFound from "@/Components/ui/admin/DataNotFound";
import ProductContent from "@/Components/ui/ProductContent";
import useNews from "@/Hooks/use-news";

export default function NewsPage() {
    const { newsItems, isLoading, error, handleDelete } = useNews();
    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "News" },
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
                {error.message || "Failed to load news."}
            </div>
        );
    }

    return (
        <>
            <Head title="News" />
            <PageContent
                pageTitle="Manage News"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                    <HeaderContent
                        Icon={Newspaper}
                        title="News List"
                        description="List of all news articles."
                    />

                    <div className="flex justify-end flex-shrink-0">
                        <Button
                            as="link"
                            variant="outline"
                            href="/admin/news/create"
                            size="md"
                            iconLeft={<PlusCircle className="h-5 w-5" />}
                        >
                            Add New News
                        </Button>
                    </div>
                </div>

                {newsItems && newsItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {newsItems.map((newsItem) => (
                            <ProductContent
                                key={newsItem.id}
                                imageUrl={newsItem.image_url}
                                title={newsItem.title}
                                description={newsItem.description}
                                href={`/admin/news/${newsItem.slug}`}
                                editHref={`/admin/news/edit/${newsItem.slug}`}
                                onDelete={() => handleDelete(newsItem.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <DataNotFound
                        title="No News Found"
                        message="There are no news articles yet. Click 'Add New News' to create one."
                    />
                )}
            </PageContent>
        </>
    );
}
