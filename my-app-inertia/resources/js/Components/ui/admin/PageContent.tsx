import React, { ReactNode } from "react";
import BreadcrumbNav from "@/Components/ui/admin/BreadcrumbNav";
import type { BreadcrumbItem } from "@/Components/ui/admin/BreadcrumbNav";

interface PageContentProps {
    children: ReactNode;
    breadcrumbItems: BreadcrumbItem[];
    pageTitle: string;
    pageClassName?: string;
}

const PageContent: React.FC<PageContentProps> = ({
    children,
    breadcrumbItems,
    pageTitle,
    pageClassName,
}) => {
    return (
        <div>
            <BreadcrumbNav items={breadcrumbItems} pageTitle={pageTitle} />
            <div className={`pb-10 ${pageClassName || ""}`}>
                <div className="lg:bg-white lg:shadow-sm lg:border border-zinc-200 rounded-lg md:p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PageContent;
