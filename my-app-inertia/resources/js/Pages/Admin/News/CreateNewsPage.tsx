import React, { FormEvent } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { Newspaper } from "lucide-react";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import useNews from "@/Hooks/use-news";
import FormLayout from "@/Components/ui/admin/FormLayout";
import CommonFormFields from "@/Components/ui/admin/FormFields";
import { useEntityForm } from "@/Hooks/use-entity-form";

const CreateNewsPage: React.FC = () => {
    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "News", href: "/admin/news" },
        { label: "Create" },
    ];

    const { handleCreate, isMutating } = useNews();

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        const formDataToSend = buildFormData("title");

        await handleCreate(
            formDataToSend,

            () => {
                reset();
                handleRemoveImage();
                router.visit("/admin/news");
            },

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
            }
        );
    };
    return (
        <>
            <Head title="Create News" />
            <PageContent
                pageTitle="Manage News"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Newspaper}
                    title="Create News"
                    description="Add a new news article."
                />

                <div className="mt-6">
                    <FormLayout
                        onSubmit={handleSubmit}
                        isMutating={isMutating}
                        submitText="Add News"
                        mutatingText="Adding..."
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
                </div>
            </PageContent>
        </>
    );
};

export default CreateNewsPage;
