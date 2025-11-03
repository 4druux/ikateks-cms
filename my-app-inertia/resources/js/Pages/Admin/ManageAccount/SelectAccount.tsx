import React from "react";
import { Head, Link } from "@inertiajs/react";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import { UserCog, UserLock, ArrowRight, type LucideIcon } from "lucide-react";

interface AccountStatCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    colorClasses: string;
}

interface AccountType {
    role: string;
    title: string;
    IconComponent: LucideIcon;
    description: string;
    colorClasses: string;
}

const AccountStatCard: React.FC<AccountStatCardProps> = ({
    title,
    description,
    icon: Icon,
    href,
    colorClasses,
}) => (
    <Link href={href} className="group relative cursor-pointer">
        <div
            className="absolute inset-0 z-0 rounded-xl bg-red-900 opacity-0 transition-all duration-300 ease-in-out group-hover:rotate-3 group-hover:opacity-100"
            style={{
                filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
            }}
        />
        <div className="relative z-10 flex h-full flex-col rounded-xl bg-white p-6 border border-zinc-200 transition-shadow duration-300">
            <div className="flex gap-4">
                <div
                    className={`mb-4 flex-shrink-0 rounded-lg p-3 w-fit ${colorClasses}`}
                >
                    <Icon className="h-8 w-8" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold text-zinc-900 text-start">
                        {title}
                    </p>
                    <p className="text-sm text-zinc-600 text-start">
                        {description}
                    </p>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                <span className="text-sm font-semibold text-red-900">
                    Manage Account
                </span>
                <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-900" />
            </div>
        </div>
    </Link>
);

const accountTypes: AccountType[] = [
    {
        role: "admin",
        title: "Admin Account",
        IconComponent: UserCog,
        description: "Manage accounts with administrator privileges.",
        colorClasses: "bg-purple-100 text-purple-600",
    },
];

const SelectAccount: React.FC = () => {
    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Manage Account" },
    ];

    return (
        <>
            <Head title="Account Management" />
            <PageContent
                pageTitle="Manage User Account Data"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={UserLock}
                    title="User Account List"
                    description="Select an account type to view and manage registered users."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
                    {accountTypes.map((account) => (
                        <AccountStatCard
                            key={account.role}
                            href={`/admin/manage-account/show?role=${account.role}`}
                            icon={account.IconComponent}
                            title={account.title}
                            description={account.description}
                            colorClasses={account.colorClasses}
                        />
                    ))}
                </div>
            </PageContent>
        </>
    );
};

export default SelectAccount;
