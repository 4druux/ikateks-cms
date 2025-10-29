import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Hero from "@/Components/ui/users/Hero";
import CallToAction from "@/Components/ui/users/CallToAction";
import ProductCategories from "@/Components/products/ProductCategories";

const ProductCategoriesPage = () => {
    const { t } = useTranslation(["product", "common"]);

    return (
        <>
            <Head title={t("common:nav.products")} />

            <div className="min-h-screen">
                <Hero
                    imageSrc="/images/office-2.jpg"
                    title={t("productCategoriesPage.hero.title")}
                    description={t("productCategoriesPage.hero.description")}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28">
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
