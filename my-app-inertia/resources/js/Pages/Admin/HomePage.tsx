import React from "react";
import { Head, Link } from "@inertiajs/react";
import PageContent from "@/Components/ui/admin/PageContent";
import useSWR from "swr";
import { fetcher, NewsItem, Customer, Principal, Category } from "@/Utils/api";
import {
    LayoutGrid,
    Package,
    Newspaper,
    ArrowRight,
    LayoutDashboard,
    Handshake,
    Building2,
} from "lucide-react";
import DotLoader from "@/Components/ui/DotLoader";
import Button from "@/Components/common/Button";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DataNotFound from "@/Components/ui/admin/DataNotFound";
import ProductContent from "@/Components/ui/ProductContent";

interface DashboardStats {
    categoryCount: number;
    productCount: number;
    newsCount: number;
    customerCount: number;
    principalCount: number;
}

interface StatCardProps {
    title: string;
    value: number | undefined;
    icon: React.ElementType;
    href: string;
    colorClasses: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
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
            <div className="flex gap-2">
                <div
                    className={`mb-4 flex-shrink-0 rounded-lg p-3 w-fit ${colorClasses}`}
                >
                    <Icon className="h-8 w-8" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col">
                    <p className="text-zinc-900 text-start">{title}</p>

                    <h3 className="text-2xl font-bold text-zinc-800 text-start">
                        {value !== undefined ? value : "..."}
                    </h3>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
                <span className="text-sm font-semibold text-red-900">
                    View All
                </span>
                <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-red-900" />
            </div>
        </div>
    </Link>
);

export default function HomePage() {
    const breadcrumbItems = [{ label: "Home" }];

    const {
        data: stats,
        error: statsError,
        isLoading: isLoadingStats,
    } = useSWR<DashboardStats>("/api/admin/dashboard-stats", fetcher);

    const { data: recentNews, isLoading: isLoadingNews } = useSWR<NewsItem[]>(
        "/api/admin/news",
        fetcher,
        { revalidateOnFocus: false }
    );

    const { data: recentCategories, isLoading: isLoadingCategories } = useSWR<
        Category[]
    >("/api/admin/categories", fetcher, { revalidateOnFocus: false });

    const { data: recentCustomers, isLoading: isLoadingCustomers } = useSWR<
        Customer[]
    >("/api/admin/customers", fetcher, { revalidateOnFocus: false });

    const { data: recentPrincipals, isLoading: isLoadingPrincipals } = useSWR<
        Principal[]
    >("/api/admin/principals", fetcher, { revalidateOnFocus: false });

    const getRecentItems = <T,>(items: T[] | undefined, count: number): T[] => {
        if (!items) return [];
        return items.slice(0, count);
    };

    const isLoading =
        isLoadingStats ||
        isLoadingNews ||
        isLoadingCategories ||
        isLoadingCustomers ||
        isLoadingPrincipals;

    if (isLoading && !stats) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <DotLoader />
            </div>
        );
    }

    if (statsError) {
        return (
            <PageContent
                breadcrumbItems={breadcrumbItems}
                pageTitle="Dashboard"
            >
                <p className="text-red-600">Failed to load dashboard data.</p>
            </PageContent>
        );
    }

    return (
        <>
            <Head title="Dashboard" />

            <PageContent
                breadcrumbItems={breadcrumbItems}
                pageTitle="Dashboard"
                pageClassName="mt-5"
            >
                <HeaderContent
                    Icon={LayoutDashboard}
                    title="Welcome to your Dashboard"
                    description="Here's a summary of your website's content."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-6">
                    <StatCard
                        title="Total Categories"
                        value={stats?.categoryCount}
                        icon={LayoutGrid}
                        href="/admin/categories"
                        colorClasses="bg-blue-100 text-blue-600"
                    />
                    <StatCard
                        title="Total Products"
                        value={stats?.productCount}
                        icon={Package}
                        href="/admin/categories"
                        colorClasses="bg-green-100 text-green-600"
                    />
                    <StatCard
                        title="Total News"
                        value={stats?.newsCount}
                        icon={Newspaper}
                        href="/admin/news"
                        colorClasses="bg-red-100 text-red-600"
                    />
                    <StatCard
                        title="Total Customers"
                        value={stats?.customerCount}
                        icon={Handshake}
                        href="/admin/customers"
                        colorClasses="bg-indigo-100 text-indigo-600"
                    />
                    <StatCard
                        title="Total Principals"
                        value={stats?.principalCount}
                        icon={Building2}
                        href="/admin/principals"
                        colorClasses="bg-purple-100 text-purple-600"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-lg border border-zinc-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-zinc-900">
                                Recent News
                            </h3>
                            <Button
                                as="link"
                                href="/admin/news"
                                variant="outline"
                                size="sm"
                            >
                                View All
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {getRecentItems(recentNews, 8).map((news) => (
                                <ProductContent
                                    key={news.id}
                                    imageUrl={news.image_url}
                                    title={news.title}
                                    description={news.description}
                                    href={`/admin/news/${news.slug}`}
                                    editHref={`/admin/news/edit/${news.slug}`}
                                />
                            ))}
                        </div>
                        {(!recentNews || recentNews.length === 0) && (
                            <DataNotFound
                                title="No News Found"
                                message="There are no news articles yet."
                            />
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-zinc-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-zinc-900">
                                Recent Categories
                            </h3>
                            <Button
                                as="link"
                                href="/admin/categories"
                                variant="outline"
                                size="sm"
                            >
                                View All
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {getRecentItems(recentCategories, 8).map(
                                (category) => (
                                    <ProductContent
                                        key={category.id}
                                        imageUrl={category.image_url}
                                        title={category.title}
                                        description={category.description}
                                        href={`/admin/categories/${category.slug}`}
                                        editHref={`/admin/categories/edit/${category.slug}`}
                                    />
                                )
                            )}
                        </div>
                        {(!recentCategories ||
                            recentCategories.length === 0) && (
                            <DataNotFound
                                title="No Categories Found"
                                message="There are no categories yet."
                            />
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-zinc-900">
                                Recent Customers
                            </h3>
                            <Button
                                as="link"
                                href="/admin/customers"
                                variant="outline"
                                size="sm"
                            >
                                View All
                            </Button>
                        </div>
                        {recentCustomers && recentCustomers.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                                {getRecentItems(recentCustomers, 14)?.map(
                                    (customer) => (
                                        <Link
                                            key={customer.id}
                                            href="/admin/customers"
                                            title="View Customers"
                                            className="relative group border rounded-lg overflow-hidden aspect-square bg-zinc-50 flex items-center justify-center p-2 transition-colors"
                                        >
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />

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
                                        </Link>
                                    )
                                )}
                            </div>
                        ) : (
                            <DataNotFound
                                title="No Customers Found"
                                message="There are no customer logos yet."
                            />
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-zinc-900">
                                Recent Principals
                            </h3>
                            <Button
                                as="link"
                                href="/admin/principals"
                                variant="outline"
                                size="sm"
                            >
                                View All
                            </Button>
                        </div>
                        {recentPrincipals && recentPrincipals.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                                {getRecentItems(recentPrincipals, 14)?.map(
                                    (principal) => (
                                        <Link
                                            key={principal.id}
                                            href="/admin/principals"
                                            title="View Principals"
                                            className="relative group border rounded-lg overflow-hidden aspect-square bg-zinc-50 flex items-center justify-center p-2 transition-colors"
                                        >
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" />
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
                                        </Link>
                                    )
                                )}
                            </div>
                        ) : (
                            <DataNotFound
                                title="No Principals Found"
                                message="There are no principal logos yet."
                            />
                        )}
                    </div>
                </div>
            </PageContent>
        </>
    );
}
