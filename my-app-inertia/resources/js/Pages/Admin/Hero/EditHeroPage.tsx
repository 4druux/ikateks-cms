import React, { useState, FormEvent, useEffect, ChangeEvent } from "react";
import PageContent from "@/Components/ui/admin/PageContent";
import { Head, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import DotLoader from "@/Components/ui/DotLoader";
import FormLayout from "@/Components/ui/admin/FormLayout";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import { Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { PageHero } from "@/Utils/api";
import InputField from "@/Components/common/InputField";
import DescriptionField from "@/Components/common/DescriptionField";
import SelectField from "@/Components/common/SelectField";
import MediaUploadField from "@/Components/common/MediaUploadField";
import useHero from "@/Utils/api/use-hero";

interface HeroFormData {
    title: string;
    title_id: string;
    subtitle: string;
    subtitle_id: string;
    description: string;
    description_id: string;
    media: File | null;
    media_type: "image" | "video";
}

type HeroFormErrors = Record<keyof HeroFormData | string, string>;

const EditHeroPage: React.FC<{ page_key: string }> = ({ page_key }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);

    const { isMutating, handleUpdate } = useHero();

    const [data, setData] = useState<HeroFormData>({
        title: "",
        title_id: "",
        subtitle: "",
        subtitle_id: "",
        description: "",
        description_id: "",
        media: null,
        media_type: "video",
    });

    const [errors, setErrors] = useState<HeroFormErrors>({});

    useEffect(() => {
        if (!page_key) {
            toast.error("Page key not found.");
            router.visit("/admin/heroes");
            return;
        }

        axios
            .get(`/api/admin/hero/${page_key}`)
            .then((response) => {
                const hero: PageHero = response.data;
                setData({
                    title: hero.title,
                    title_id: hero.title_id,
                    subtitle: hero.subtitle || "",
                    subtitle_id: hero.subtitle_id || "",
                    description: hero.description,
                    description_id: hero.description_id,
                    media_type: hero.media_type,
                    media: null,
                });
                setMediaPreview(hero.media_url || null);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load hero content.");
                router.visit("/admin/heroes");
            });
    }, [page_key]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("title_id", data.title_id);
        formData.append("subtitle", data.subtitle || "");
        formData.append("subtitle_id", data.subtitle_id || "");
        formData.append("description", data.description);
        formData.append("description_id", data.description_id);
        formData.append("media_type", data.media_type);

        if (data.media) {
            formData.append("media", data.media);
        }

        await handleUpdate(
            page_key,
            formData,
            (backendErrors) => {
                const formattedErrors: HeroFormErrors = {};
                for (const key in backendErrors) {
                    if (backendErrors[key] && backendErrors[key].length > 0) {
                        formattedErrors[key] = backendErrors[key][0];
                    }
                }
                setErrors(formattedErrors);
            },
            () => {
                router.visit("/admin/hero");
            }
        );
    };

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "",
            }));
        }
    };

    const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData((prevData) => ({ ...prevData, media: file }));

        if (errors.media) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                media: "",
            }));
        }

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setMediaPreview(null);
        }
    };

    const handleRemoveMedia = () => {
        setData((prevData) => ({ ...prevData, media: null }));
        setMediaPreview(null);
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
        { label: "Heroes", href: "/admin/hero" },
        { label: `Edit ${page_key}` },
    ];

    return (
        <>
            <Head title={`Edit Hero: ${page_key}`} />
            <PageContent
                pageTitle="Manage Hero Content"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={ImageIcon}
                    title="Edit Hero"
                    description={`Update content for the '${page_key}' page hero.`}
                />

                <FormLayout
                    onSubmit={handleSubmit}
                    isMutating={isMutating}
                    submitText="Update Hero"
                    mutatingText="Updating..."
                    backHref={"/admin/hero"}
                >
                    <div className="grid grid-cols-1 gap-6">
                        <InputField
                            label="Title (English)"
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                            error={errors.title}
                        />
                        <InputField
                            label="Title (Indonesia)"
                            id="title_id"
                            name="title_id"
                            value={data.title_id}
                            onChange={handleChange}
                            error={errors.title_id}
                        />
                        {page_key === "home" && (
                            <>
                                <InputField
                                    label="Subtitle (English)"
                                    id="subtitle"
                                    name="subtitle"
                                    value={data.subtitle || ""}
                                    onChange={handleChange}
                                    error={errors.subtitle}
                                />

                                <InputField
                                    label="Subtitle (Indonesia)"
                                    id="subtitle_id"
                                    name="subtitle_id"
                                    value={data.subtitle_id || ""}
                                    onChange={handleChange}
                                    error={errors.subtitle_id}
                                />
                            </>
                        )}
                        <DescriptionField
                            label="Description (English)"
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={handleChange}
                            error={errors.description}
                        />
                        <DescriptionField
                            label="Description (Indonesia)"
                            id="description_id"
                            name="description_id"
                            value={data.description_id}
                            onChange={handleChange}
                            error={errors.description_id}
                        />

                        <hr />

                        <SelectField
                            label="Media Type"
                            id="media_type"
                            name="media_type"
                            value={data.media_type}
                            onChange={handleChange}
                            error={errors.media_type}
                        >
                            <option value="video">Video</option>
                            <option value="image">Image</option>
                        </SelectField>

                        <MediaUploadField
                            label="Media File (Image or Video)"
                            onMediaChange={handleMediaChange}
                            onRemoveMedia={handleRemoveMedia}
                            mediaPreview={mediaPreview}
                            error={errors.media}
                            accept="image/*,video/*"
                            previewType={data.media_type}
                        />
                    </div>
                </FormLayout>
            </PageContent>
        </>
    );
};

export default EditHeroPage;
