import { useState } from "react";
import { Head } from "@inertiajs/react";
import usePrincipals from "@/Hooks/use-principals";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import { Building, PlusCircle, Trash2 } from "lucide-react";
import DataNotFound from "@/Components/ui/admin/DataNotFound";
import LogoUploadModal from "@/Components/ui/admin/LogoUploadModal";

export default function PrincipalsPage() {
    const {
        principals,
        isLoading,
        error,
        handleDelete,
        handleCreate,
        isMutating: isHookMutating,
    } = usePrincipals();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Principals" },
    ];

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleCreateSubmit = async (formData: FormData): Promise<boolean> => {
        return handleCreate(formData, (backendErrors) => {
            if (backendErrors.image && backendErrors.image[0]) {
                console.error(
                    "Backend validation error:",
                    backendErrors.image[0]
                );
            }
        });
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
                {error.message || "Failed to load principals."}
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

                {principals && principals.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {principals.map((principal) => (
                            <div
                                key={principal.id}
                                className="relative group border rounded-lg overflow-hidden aspect-square bg-zinc-50 flex items-center justify-center p-2"
                            >
                                <img
                                    src={
                                        principal.image_url ??
                                        "/images/placeholder.jpg"
                                    }
                                    alt={`Principal ${principal.id}`}
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
                                            handleDelete(principal.id)
                                        }
                                        disabled={isHookMutating}
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
                        title="No Principals Found"
                        message="There are no principal logos yet. Click 'Add New Logo' to add one."
                    />
                )}
            </PageContent>

            <LogoUploadModal
                modalTitle="Add New Principal Logo"
                inputLabel="Upload Principal Logo"
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateSubmit}
                isMutating={isHookMutating}
            />
        </>
    );
}
