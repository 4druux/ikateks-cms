import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { AboutItem, getAboutById } from "@/Utils/api";
import useAbout from "@/Hooks/use-about";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import { Building, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const AboutDetailPage: React.FC<{ id: number }> = ({ id }) => {
    const [aboutItem, setAboutItem] = useState<AboutItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { handleDelete, isMutating } = useAbout();

    useEffect(() => {
        if (!id) {
            toast.error("Failed to load about id.");
            router.visit("/admin/about");
            return;
        }

        getAboutById(id)
            .then((data) => {
                setAboutItem(data);
            })
            .catch((err) => {
                console.error(err);
                toast.error("About item not found or failed to load.");
                router.visit("/admin/about");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    const handleDeleteClick = async () => {
        if (!aboutItem) return;

        const isSuccess = await handleDelete(aboutItem.id);

        if (isSuccess) {
            router.visit("/admin/about");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    if (!aboutItem) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                About item not found.
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "About", href: "/admin/about" },
        { label: aboutItem.title },
    ];

    return (
        <>
            <Head title={aboutItem.title} />
            <PageContent
                pageTitle="Manage About"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                    <HeaderContent
                        Icon={Building}
                        title={aboutItem.title}
                        description="Complete details for this about article."
                    />

                    <div className="flex justify-end flex-shrink-0 gap-2 mt-4 lg:mt-0">
                        <Button
                            as="link"
                            variant="outline"
                            href={`/admin/about/edit/${aboutItem.id}`}
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
                        {aboutItem.image_url ? (
                            <img
                                src={aboutItem.image_url}
                                alt={aboutItem.title}
                                className="w-full h-auto object-cover aspect-[4/3]"
                            />
                        ) : (
                            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            {aboutItem.title}
                        </h2>

                        <div className="prose max-w-none text-gray-700">
                            {aboutItem.description ? (
                                <p className="whitespace-pre-wrap">
                                    {aboutItem.description}
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
                        href="/admin/about"
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

export default AboutDetailPage;
