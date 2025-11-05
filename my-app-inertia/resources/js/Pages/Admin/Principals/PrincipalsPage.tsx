import { useEffect, useState } from "react";
import { Head } from "@inertiajs/react";
import usePrincipals from "@/Hooks/use-principals";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import { Building, Building2, PlusCircle, Trash2 } from "lucide-react";
import DataNotFound from "@/Components/ui/admin/DataNotFound";
import LogoUploadModal from "@/Components/ui/admin/LogoUploadModal";
import InfoCard from "@/Components/ui/InfoCard";
import { AnimatePresence } from "framer-motion";
import { PrincipalItem } from "@/Utils/api";
import ModalPrincipals from "@/Components/ui/ModalPrincipals";
import { useTranslation } from "react-i18next";

export default function PrincipalsPage() {
    const {
        principals,
        logos,
        isLoadingPrincipals,
        isLoadingLogos,
        errorPrincipals,
        errorLogos,
        handleDeletePrincipal,
        handleCreateLogo,
        handleDeleteLogo,
        isMutating,
    } = usePrincipals();

    useTranslation(["principals", "common"]);

    const [selectedPrincipal, setSelectedPrincipal] =
        useState<PrincipalItem | null>(null);
    const isPrincipalModalOpen = !!selectedPrincipal;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Principals" },
    ];

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleOpenPrincipalModal = (item: PrincipalItem) => {
        setSelectedPrincipal(item);
    };
    const handleClosePrincipalModal = () => {
        setSelectedPrincipal(null);
    };

    useEffect(() => {
        if (isPrincipalModalOpen || isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isPrincipalModalOpen, isModalOpen]);

    const isLoading = isLoadingPrincipals || isLoadingLogos;
    const error = errorPrincipals || errorLogos;

    const handleSubmitLogo = async (formData: FormData): Promise<boolean> => {
        return handleCreateLogo(
            formData,
            () => {
                handleCloseModal();
            },
            (backendErrors) => {
                if (backendErrors.image && backendErrors.image[0]) {
                    console.error(
                        "Backend validation error:",
                        backendErrors.image[0]
                    );
                }
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

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen font-medium text-red-600">
                {error.message || "Failed to load principals data."}
            </div>
        );
    }

    return (
        <>
            <Head title="Principals" />
            <PageContent
                pageTitle="Manage Principals"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <section>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                        <HeaderContent
                            Icon={Building2}
                            title="Principals / Methodologies"
                            description="List of all principal items and methodologies."
                        />

                        <div className="flex justify-end flex-shrink-0">
                            <Button
                                as="link"
                                variant="outline"
                                href="/admin/principals/create"
                                size="md"
                                iconLeft={<PlusCircle className="h-5 w-5" />}
                            >
                                Add New Principal
                            </Button>
                        </div>
                    </div>

                    {principals && principals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {principals.map((item) => (
                                <InfoCard
                                    key={item.id}
                                    iconName={item.icon_name}
                                    title={item.title}
                                    description={item.description}
                                    editHref={`/admin/principals/edit/${item.id}`}
                                    onDelete={() =>
                                        handleDeletePrincipal(item.id)
                                    }
                                    isMutating={isMutating}
                                    onClick={() =>
                                        handleOpenPrincipalModal(item)
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <DataNotFound
                            title="No Principals Found"
                            message="There are no principal items yet. Click 'Add New Principal' to create one."
                        />
                    )}
                </section>

                <section className="mt-10 pt-10 border-t">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                        <HeaderContent
                            Icon={Building}
                            title="Principal Logos"
                            description="List of all principal company logos."
                        />
                        <div className="flex justify-end flex-shrink-0 mt-4 lg:mt-0">
                            <Button
                                variant="outline"
                                onClick={handleOpenModal}
                                size="md"
                                iconLeft={<PlusCircle className="h-5 w-5" />}
                            >
                                Add New Logo
                            </Button>
                        </div>
                    </div>

                    {logos && logos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {logos.map((logo) => (
                                <div
                                    key={logo.id}
                                    className="relative group border rounded-lg overflow-hidden aspect-square bg-zinc-50 flex items-center justify-center p-2"
                                >
                                    <img
                                        src={
                                            logo.image_url ??
                                            "/images/placeholder.jpg"
                                        }
                                        alt={`Principal ${logo.id}`}
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/images/placeholder.jpg";
                                        }}
                                    />

                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
                                    <div className="absolute top-2 right-2 flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <button
                                            type="button"
                                            className="p-3 text-sm text-white bg-red-900/80 hover:bg-red-900 transition-colors duration-300"
                                            onClick={() =>
                                                handleDeleteLogo(logo.id)
                                            }
                                            disabled={isMutating}
                                            aria-label="Delete logo"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <DataNotFound
                            title="No Logos Found"
                            message="There are no principal logos yet. Click 'Add New Logo' to add one."
                        />
                    )}
                </section>
            </PageContent>

            <AnimatePresence>
                <LogoUploadModal
                    modalTitle="Add New Principal Logo"
                    inputLabel="Upload Principal Logo"
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitLogo}
                    isMutating={isMutating}
                />
            </AnimatePresence>

            <AnimatePresence>
                {selectedPrincipal && (
                    <ModalPrincipals
                        item={selectedPrincipal}
                        onClose={handleClosePrincipalModal}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
