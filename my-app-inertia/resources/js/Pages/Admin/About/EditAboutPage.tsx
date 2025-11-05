import React, { useState, FormEvent, useEffect } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { getAboutById } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";
import useAbout from "@/Hooks/use-about";
import FormLayout from "@/Components/ui/admin/FormLayout";
import FormFields from "@/Components/ui/admin/FormFields";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import { useEntityForm } from "@/Hooks/use-entity-form";
import { Building } from "lucide-react";

const EditAboutPage: React.FC<{ id: number }> = ({ id }) => {
    const { handleUpdate, isMutating } = useAbout();

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

    const [isLoading, setIsLoading] = useState(!!id);
    const [loadedTitle, setLoadedTitle] = useState<string>("...");

    useEffect(() => {
        if (!id) {
            toast.error("Failed to load about id.");
            router.visit("/admin/about");
            return;
        }

        getAboutById(id)
            .then((aboutItem) => {
                setData("mainField", aboutItem.title);
                setData("description", aboutItem.description);
                setData("mainField_id", aboutItem.title_id);
                setData("description_id", aboutItem.description_id);

                setLoadedTitle(aboutItem.title);
                setImagePreview(aboutItem.image_url ?? null);
                setExistingImageUrl(aboutItem.image_url ?? null);
            })
            .catch((err) => {
                console.error(err);
                toast.error("About item not found or failed to load.");
                router.visit("/admin/about");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id, setData, setImagePreview, setExistingImageUrl]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        clearErrors();

        const formDataToSend = buildFormData("title");

        await handleUpdate(
            id,
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
                router.visit("/admin/about");
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
        { label: "About", href: "/admin/about" },
        {
            label: isLoading ? "..." : `Edit ${loadedTitle}`,
        },
    ];

    return (
        <>
            <Head title="Edit About" />
            <PageContent
                pageTitle="Manage About"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={Building}
                    title="Edit About"
                    description="Update about article details."
                />

                <FormLayout
                    onSubmit={handleSubmit}
                    isMutating={isMutating}
                    submitText="Update About"
                    mutatingText="Updating..."
                    backHref="/admin/about"
                >
                    <FormFields
                        data={data}
                        errors={errors}
                        imagePreview={imagePreview}
                        handleChange={handleChange}
                        handleImageChange={handleImageChange}
                        handleRemoveImage={handleRemoveImage}
                        imageLabel="About Image"
                        titleLabel="About Title (English)"
                        titlePlaceholder="e.g., Company Expansion Update"
                        descriptionLabel="Content (English)"
                        descriptionPlaceholder="Write the about content here..."
                        titleIdLabel="About Title (Indonesia)"
                        titleIdPlaceholder="cth., Pembaruan Ekspansi Perusahaan"
                        descriptionIdLabel="Content (Indonesia)"
                        descriptionIdPlaceholder="Tulis isi berita di sini..."
                    />
                </FormLayout>
            </PageContent>
        </>
    );
};

export default EditAboutPage;
