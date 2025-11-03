import React from "react";
import { UserCog, ArrowLeft, type LucideIcon } from "lucide-react";
import { useShowAccount } from "@/Hooks/use-show-account";
import DotLoader from "@/Components/ui/DotLoader";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import SearchBar from "@/Components/common/SearchBar";
import ShowAccountTable from "@/Components/ui/admin/ShowAccountTable";
import ShowAccountCard from "@/Components/ui/admin/ShowAccountCard";
import DataNotFound from "@/Components/ui/admin/DataNotFound";
import Button from "@/Components/common/Button";
import ResetPasswordModal from "@/Components/ui/admin/ResetPasswordModal";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    approved_at: string | null;
}

interface AccountTypeInfo {
    title: string;
    IconComponent: LucideIcon;
}

interface AccountTypes {
    [key: string]: AccountTypeInfo;
}

const accountTypes: AccountTypes = {
    admin: { title: "Admin", IconComponent: UserCog },
};

const ShowAccount: React.FC = () => {
    const role = new URLSearchParams(window.location.search).get("role");

    const {
        isLoading,
        error,
        pendingUsers,
        approvedUsers,
        isProcessing,
        isModalOpen,
        selectedUser,
        searchTerm,
        handleApprove,
        handleReject,
        handleResetPassword,
        handleOpenModal,
        handleCloseModal,
        handleSearchChange,
        handleClearSearch,
    } = useShowAccount(role);

    const account = (role && accountTypes[role]) || {
        title: "Account",
        IconComponent: UserCog,
    };
    const needsApproval = role === "admin";

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Manage Account", href: "/admin/manage-account" },
        { label: "Select Account" },
    ];

    const resetPasswordAndCloseModal = async (
        newPassword: string,
        passwordConfirmation: string
    ) => {
        if (selectedUser) {
            await handleResetPassword(
                selectedUser as User,
                newPassword,
                passwordConfirmation
            );
            handleCloseModal();
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center font-medium text-red-600">
                Failed to load user data.
            </div>
        );
    }

    const handleRejectVoid = (userId: number) => {
        handleReject(userId);
    };

    return (
        <PageContent
            pageTitle={`Manage ${account.title} Account`}
            breadcrumbItems={breadcrumbItems}
            pageClassName="mt-4"
        >
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between mb-6 xl:gap-4">
                <HeaderContent
                    Icon={account.IconComponent}
                    title={`List of ${account.title} Accounts`}
                    description={`Manage all ${
                        role || "user"
                    } accounts registered in the system.`}
                />

                <SearchBar
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClear={handleClearSearch}
                    placeholder="Search Name, Email"
                    className="max-w-sm"
                />
            </div>

            {needsApproval && pendingUsers.length > 0 && (
                <div className="mb-8">
                    <h3 className="mb-4 text-lg font-medium text-gray-700">
                        New User Approval
                    </h3>
                    <div className="hidden xl:block">
                        <ShowAccountTable
                            users={pendingUsers as User[]}
                            type="pending"
                            onApprove={
                                role === "admin" ? handleApprove : undefined
                            }
                            onReject={
                                role === "admin" ? handleRejectVoid : () => {}
                            }
                            isProcessing={isProcessing}
                        />
                    </div>
                    <div className="xl:hidden">
                        <ShowAccountCard
                            users={pendingUsers as User[]}
                            type="pending"
                            onApprove={
                                role === "admin" ? handleApprove : undefined
                            }
                            onReject={
                                role === "admin" ? handleRejectVoid : () => {}
                            }
                            isProcessing={isProcessing}
                        />
                    </div>
                </div>
            )}
            <div className="mb-6">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                    Active User List
                </h3>
                {approvedUsers.length > 0 ? (
                    <>
                        <div className="hidden xl:block">
                            <ShowAccountTable
                                users={approvedUsers as User[]}
                                type="approved"
                                onReject={handleRejectVoid}
                                isProcessing={isProcessing}
                                onOpenResetPasswordModal={
                                    handleOpenModal as (user: User) => void
                                }
                            />
                        </div>
                        <div className="xl:hidden">
                            <ShowAccountCard
                                users={approvedUsers as User[]}
                                type="approved"
                                onReject={handleRejectVoid}
                                isProcessing={isProcessing}
                                onOpenResetPasswordModal={
                                    handleOpenModal as (user: User) => void
                                }
                            />
                        </div>
                    </>
                ) : (
                    <DataNotFound
                        title="No Users Found"
                        message={`No ${role || "user"} users found.`}
                    />
                )}
            </div>
            <div className="mt-6 flex justify-start">
                <Button
                    as="link"
                    size={"md"}
                    variant="outline"
                    href={"/admin/manage-account"}
                    iconLeft={<ArrowLeft className="h-5 w-5" />}
                >
                    Back
                </Button>
            </div>
            <ResetPasswordModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                user={selectedUser as User | null}
                onResetPassword={resetPasswordAndCloseModal}
            />
        </PageContent>
    );
};

export default ShowAccount;
