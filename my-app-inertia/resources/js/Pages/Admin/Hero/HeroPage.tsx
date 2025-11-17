import { Head } from "@inertiajs/react";
import useSWR from "swr";
import { fetcher, PageHero } from "@/Utils/api";
import PageContent from "@/Components/ui/admin/PageContent";
import HeaderContent from "@/Components/ui/admin/HeaderContent";
import DotLoader from "@/Components/ui/DotLoader";
import { Image as ImageIcon, Edit } from "lucide-react";
import Button from "@/Components/common/Button";

export default function HeroIndexPage() {
    const {
        data: heroes,
        isLoading,
        error,
    } = useSWR<PageHero[]>("/api/admin/hero", fetcher);

    const breadcrumbItems = [
        { label: "Home", href: "/admin" },
        { label: "Manage Heroes" },
    ];

    return (
        <>
            <Head title="Manage Heroes" />
            <PageContent
                pageTitle="Manage Hero Sections"
                breadcrumbItems={breadcrumbItems}
                pageClassName="mt-4"
            >
                <HeaderContent
                    Icon={ImageIcon}
                    title="Hero Sections"
                    description="Edit the hero content for each main page."
                />

                {isLoading && (
                    <div className="flex justify-center py-10">
                        <DotLoader />
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-600">
                        Failed to load hero content.
                    </div>
                )}

                {!isLoading && !error && heroes && (
                    <div className="mt-6">
                        <div className="hidden md:block border rounded-lg overflow-hidden shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Page
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Media Type
                                        </th>
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">
                                                Edit
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {heroes.map((hero) => (
                                        <tr key={hero.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                                                {hero.page_key}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {hero.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                                                {hero.media_type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button
                                                    as="link"
                                                    variant="outline"
                                                    size="sm"
                                                    href={`/admin/hero/${hero.page_key}`}
                                                    iconLeft={
                                                        <Edit className="w-4 h-4" />
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="block md:hidden space-y-4">
                            {heroes.map((hero) => (
                                <div
                                    key={hero.id}
                                    className="bg-white border rounded-lg shadow-sm p-4"
                                >
                                    <div className="flex justify-between items-center pb-3 border-b mb-3">
                                        <span className="text-lg font-bold capitalize text-gray-900">
                                            {hero.page_key}
                                        </span>
                                        <Button
                                            as="link"
                                            variant="outline"
                                            size="sm"
                                            href={`/admin/hero/${hero.page_key}`}
                                            iconLeft={
                                                <Edit className="w-4 h-4" />
                                            }
                                        >
                                            Edit
                                        </Button>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-500">
                                                Title:{" "}
                                            </span>
                                            <span className="text-gray-700">
                                                {hero.title}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-500">
                                                Media Type:{" "}
                                            </span>
                                            <span className="text-gray-700 capitalize">
                                                {hero.media_type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </PageContent>
        </>
    );
}
