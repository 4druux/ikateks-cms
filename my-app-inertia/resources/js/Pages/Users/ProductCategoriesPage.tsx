import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Hero from "@/Components/ui/users/Hero";
import CallToAction from "@/Components/ui/users/CallToAction";
import ProductCategories from "@/Components/products/ProductCategories";
import useSWR from "swr";
import { fetcher, PageHero } from "@/Utils/api";

const ProductCategoriesPage = () => {
    const { t } = useTranslation(["product", "common"]);

    const {
        data: heroData,
        error: heroError,
        isLoading: isLoadingHero,
    } = useSWR<PageHero>("/api/hero?page=product", fetcher);

    const isLoading = isLoadingHero;
    const error = heroError;

    return (
        <>
            <Head title={t("common:nav.products")} />

            <div className="min-h-screen">
                <Hero
                    heroData={heroData}
                    isLoading={isLoading}
                    fallbackImage="https://placehold.co/800x600?text=Placeholder+4:3&font=roboto"
                />

                {error && (
                    <div className="text-center text-red-600">
                        Failed to load page content.
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28">
                    <ProductCategories />
                </div>

                <CallToAction
                    title={t("productCategoriesPage.cta.title")}
                    linkText={t("productCategoriesPage.cta.linkText")}
                />
            </div>
        </>
    );
};

export default ProductCategoriesPage;
