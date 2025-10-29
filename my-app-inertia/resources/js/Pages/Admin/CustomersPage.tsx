import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import useCustomers from "@/Hooks/use-customers";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import { Users, PlusCircle, Trash2 } from "lucide-react";
import DataNotFound from "@/Components/ui/admin/DataNotFound";
import LogoUploadModal from "@/Components/ui/admin/LogoUploadModal";

export default function CustomersPage() {
    const {
        customers,
        isLoading,
        error,
        handleDelete,
        handleCreate,
        isMutating: isHookMutating,
    } = useCustomers();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Customers" },
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
                {error.message || "Failed to load customers."}
            </div>
        );
    }

    return (
        <>
            <Head title="Customers" />
            <PageContent
                pageTitle="Manage Customers"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 lg:gap-4">
                    <HeaderContent
                        Icon={Users}
                        title="Customer Logos"
                        description="List of all customer logos."
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

                {customers && customers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {customers.map((customer) => (
                            <div
                                key={customer.id}
                                className="relative group border rounded-lg overflow-hidden aspect-square bg-zinc-100 flex items-center justify-center p-2"
                            >
                                <img
                                    src={
                                        customer.image_url ??
                                        "/images/placeholder.jpg"
                                    }
                                    alt={`Customer ${customer.id}`}
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/images/placeholder.jpg";
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
                                <div className="absolute top-2 right-2 flex gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                    <button
                                        type="button"
                                        className="p-3 text-sm text-white bg-red-900/80 hover:bg-red-900 transition-colors duration-300"
                                        onClick={() =>
                                            handleDelete(customer.id)
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
                        title="No Customers Found"
                        message="There are no customer logos yet. Click 'Add New Logo' to add one."
                    />
                )}
            </PageContent>

            <LogoUploadModal
                modalTitle="Add New Customer Logo"
                inputLabel="Upload Customer Logo"
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateSubmit}
                isMutating={isHookMutating}
            />
        </>
    );
}
