import React, { ReactNode } from "react";
import BreadcrumbNav from "@/Components/ui/BreadcrumbNav";
import type { BreadcrumbItem } from "@/Components/ui/BreadcrumbNav";

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
                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 md:p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PageContent;
