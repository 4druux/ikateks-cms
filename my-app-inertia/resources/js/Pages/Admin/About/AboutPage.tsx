import Button from "@/Components/common/Button";
import DotLoader from "@/Components/ui/DotLoader";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import PageContent from "@/Components/ui/admin/PageContent";
import { Building, Building2, PlusCircle } from "lucide-react";
import { Head } from "@inertiajs/react";
import DataNotFound from "@/Components/ui/admin/DataNotFound";
import ProductContent from "@/Components/ui/ProductContent";
import useAbout from "@/Hooks/use-about";
import useAdvantage from "@/Hooks/use-advantage";
import InfoCard from "@/Components/ui/InfoCard";

export default function AboutPage() {
    const {
        aboutItems,
        isLoading: isLoadingAbout,
        error: errorAbout,
        handleDelete: handleDeleteAbout,
    } = useAbout();

    const {
        advantageItems,
        isLoading: isLoadingAdvantage,
        error: errorAdvantage,
        handleDelete: handleDeleteAdvantage,
        isMutating: isMutatingAdvantage,
    } = useAdvantage();

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "About" },
    ];

    const isLoading = isLoadingAbout || isLoadingAdvantage;
    const error = errorAbout || errorAdvantage;

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
                {error.message || "Failed to load data."}
            </div>
        );
    }

    return (
        <>
            <Head title="About" />
            <PageContent
                pageTitle="Manage About"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <section>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                        <HeaderContent
                            Icon={Building}
                            title="About Sections"
                            description="List of all About Us sections."
                        />

                        <div className="flex justify-end flex-shrink-0">
                            <Button
                                as="link"
                                variant="outline"
                                href="/admin/about/create"
                                size="md"
                                iconLeft={<PlusCircle className="h-5 w-5" />}
                            >
                                Add New About
                            </Button>
                        </div>
                    </div>

                    {aboutItems && aboutItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {aboutItems.map((aboutItem) => (
                                <ProductContent
                                    key={aboutItem.id}
                                    imageUrl={aboutItem.image_url}
                                    title={aboutItem.title}
                                    description={aboutItem.description}
                                    href={`/admin/about/${aboutItem.id}`}
                                    editHref={`/admin/about/edit/${aboutItem.id}`}
                                    onDelete={() =>
                                        handleDeleteAbout(aboutItem.id)
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <DataNotFound
                            title="No About Sections Found"
                            message="There are no about articles yet. Click 'Add New About' to create one."
                        />
                    )}
                </section>

                <section className="mt-10 pt-10 border-t">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                        <HeaderContent
                            Icon={Building2}
                            title="Company Advantage"
                            description="List of all Company Advantage items."
                        />

                        <div className="flex justify-end flex-shrink-0">
                            <Button
                                as="link"
                                variant="outline"
                                href="/admin/company-advantages/create"
                                size="md"
                                iconLeft={<PlusCircle className="h-5 w-5" />}
                            >
                                Add New Advantage
                            </Button>
                        </div>
                    </div>

                    {advantageItems && advantageItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {advantageItems.map((item) => (
                                <InfoCard
                                    key={item.id}
                                    iconName={item.icon_name}
                                    title={item.title}
                                    description={item.description}
                                    editHref={`/admin/company-advantages/edit/${item.id}`}
                                    onDelete={() =>
                                        handleDeleteAdvantage(item.id)
                                    }
                                    isMutating={isMutatingAdvantage}
                                />
                            ))}
                        </div>
                    ) : (
                        <DataNotFound
                            title="No Advantages Found"
                            message="There are no advantage items yet. Click 'Add New Advantage' to create one."
                        />
                    )}
                </section>
            </PageContent>
        </>
    );
}
