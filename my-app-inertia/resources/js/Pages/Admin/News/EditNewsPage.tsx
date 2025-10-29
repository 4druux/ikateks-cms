import React, { useState, FormEvent, useEffect } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { getNewsBySlug } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";
import useNews from "@/Hooks/use-news";
import FormLayout from "@/Components/ui/admin/FormLayout";
import CommonFormFields from "@/Components/ui/admin/FormFields";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import { Newspaper } from "lucide-react";
import { useEntityForm } from "@/Hooks/use-entity-form";

const EditNewsPage: React.FC<{ slug: string }> = ({ slug }) => {
    const { handleUpdate, isMutating } = useNews();

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
    const [loadedTitle, setLoadedTitle] = useState<string>("...");

    useEffect(() => {
        if (!slug) {
            toast.error("Failed to load news slug.");
            router.visit("/admin/news");
            return;
        }

        getNewsBySlug(slug)
            .then((newsItem) => {
                setData("mainField", newsItem.title);
                setData("description", newsItem.description);
                setData("mainField_id", newsItem.title_id);
                setData("description_id", newsItem.description_id);

                setLoadedTitle(newsItem.title);
                setImagePreview(newsItem.image_url ?? null);
                setExistingImageUrl(newsItem.image_url ?? null);
            })
            .catch((err) => {
                console.error(err);
                toast.error("News item not found or failed to load.");
                router.visit("/admin/news");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [slug, setData, setImagePreview, setExistingImageUrl]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        const formDataToSend = buildFormData("title");

        await handleUpdate(
            slug,
            formDataToSend,
            (backendErrors) => {
                if (backendErrors.title) {
                    setError("mainField", backendErrors.title[0]);
                }
                if (backendErrors.description) {
                    setError("description", backendErrors.description[0]);
                }
                if (backendErrors.title_id) {
                    setError("mainField_id", backendErrors.title_id[0]);
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
                router.visit("/admin/news");
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
        { label: "News", href: "/admin/news" },
        {
            label: isLoading ? "..." : `Edit ${loadedTitle}`,
        },
    ];

    return (
        <>
            <Head title="Edit News" />
            <PageContent
                pageTitle="Manage News"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Newspaper}
                    title="Edit News"
                    description="Update news article details."
                />

                <FormLayout
                    onSubmit={handleSubmit}
                    isMutating={isMutating}
                    submitText="Update News"
                    mutatingText="Updating..."
                    backHref="/admin/news"
                >
                    <CommonFormFields
                        data={data}
                        errors={errors}
                        imagePreview={imagePreview}
                        handleChange={handleChange}
                        handleImageChange={handleImageChange}
                        handleRemoveImage={handleRemoveImage}
                        imageLabel="News Image"
                        titleLabel="News Title (English)"
                        titlePlaceholder="e.g., Company Expansion Update"
                        descriptionLabel="Content (English)"
                        descriptionPlaceholder="Write the news content here..."
                        titleIdLabel="News Title (Indonesia)"
                        titleIdPlaceholder="cth., Pembaruan Ekspansi Perusahaan"
                        descriptionIdLabel="Content (Indonesia)"
                        descriptionIdPlaceholder="Tulis isi berita di sini..."
                    />
                </FormLayout>
            </PageContent>
        </>
    );
};

export default EditNewsPage;
