import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { NewsItem, getNewsBySlug } from "@/Utils/api";
import useNews from "@/Hooks/use-news";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import { Newspaper, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const NewsDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { handleDelete, isMutating } = useNews();

    useEffect(() => {
        if (!slug) {
            toast.error("Failed to load news slug.");
            router.visit("/admin/news");
            return;
        }

        getNewsBySlug(slug)
            .then((data) => {
                setNewsItem(data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("News item not found or failed to load.");
                router.visit("/admin/news");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [slug]);

    const handleDeleteClick = async () => {
        if (!newsItem) return;
        await handleDelete(newsItem.id);

        if (!isMutating) {
            router.visit("/admin/news");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    if (!newsItem) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                News item not found.
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "News", href: "/admin/news" },
        { label: newsItem.title },
    ];

    return (
        <>
            <Head title={newsItem.title} />
            <PageContent
                pageTitle="Manage News"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                    <HeaderContent
                        Icon={Newspaper}
                        title={newsItem.title}
                        description="Complete details for this news article."
                    />

                    <div className="flex justify-end flex-shrink-0 gap-2 mt-4 lg:mt-0">
                        <Button
                            as="link"
                            variant="outline"
                            href={`/admin/news/edit/${newsItem.slug}`}
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
                        {newsItem.image_url ? (
                            <img
                                src={newsItem.image_url}
                                alt={newsItem.title}
                                className="w-full h-auto object-cover aspect-[4/3]"
                            />
                        ) : (
                            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">
                            Description
                        </h3>
                        <div className="prose max-w-none text-gray-700">
                            {newsItem.description ? (
                                <p className="whitespace-pre-wrap">
                                    {newsItem.description}
                                </p>
                            ) : (
                                <p className="italic text-gray-500">
                                    No content provided.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-start">
                    <Button
                        as="link"
                        variant="outline"
                        href="/admin/news"
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

export default NewsDetailPage;
