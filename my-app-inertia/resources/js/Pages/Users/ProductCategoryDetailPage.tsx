import { useTranslation } from "react-i18next";
import { Head, Link } from "@inertiajs/react";
import CallToAction from "@/Components/ui/users/CallToAction";
import { ArrowLeft } from "lucide-react";
import ProductCategoriesDetail from "@/Components/products/ProductCategoriesDetail";
import useSWR from "swr";
import { Category, Product, fetcher } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";
import HeroStatic from "@/Components/ui/users/HeroStatic";

interface CategoryDetailResponse {
    category: Category;
    products: Product[];
}

interface CategoryDetailProps {
    categorySlug: string;
}

const ProductCategoryDetailPage = ({ categorySlug }: CategoryDetailProps) => {
    const { t, i18n } = useTranslation(["product", "common"]);

    const { data, error, isLoading } = useSWR<CategoryDetailResponse>(
        categorySlug ? `/api/categories/${categorySlug}/products` : null,
        fetcher
    );

    const category = data?.category;
    const products = data?.products;

    const categoryTitle = category
        ? i18n.language === "id"
            ? category.title_id
            : category.title
        : t("product.notFound.categoryTitle");

    const categoryDescription = category
        ? i18n.language === "id"
            ? category.description_id
            : category.description
        : "";

    if (isLoading) {
        return (
            <>
                <Head title={t("common:nav.products")} />
                <HeroStatic
                    imageSrc="/images/office-2.jpg"
                    title={t("common:loading...")}
                    description={t("common:loading...")}
                />
                <div className="flex justify-center items-center h-64 my-20">
                    <DotLoader />
                </div>
                <CallToAction
                    title={t("productPage.cta.title")}
                    linkText={t("productPage.cta.linkText")}
                />
            </>
        );
    }

    if (error || !category) {
        return (
            <>
                <Head title={t("common:nav.products")} />

                <HeroStatic
                    imageSrc="/images/office-2.jpg"
                    title={t("productCategoriesPage.hero.title")}
                    description={t("productCategoriesPage.hero.description")}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 min-h-[50vh] flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-center">
                        {t("product.notFound.categoryTitle")}
                    </h1>
                    <p className="mt-4 text-lg text-center">
                        {t("product.notFound.categoryDescription", {
                            categorySlug,
                        })}
                    </p>
                    <div className="text-center mt-6">
                        <Link
                            href="/products"
                            className="text-red-700 font-medium border px-4 py-3 border-red-800 hover:bg-red-800 hover:text-white transition-colors duration-300 inline-flex items-center group"
                        >
                            <ArrowLeft className="mr-1 w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                            {t("product.navigation.backToCategories")}
                        </Link>
                    </div>
                </div>
                <CallToAction
                    title={t("productPage.cta.title")}
                    linkText={t("productPage.cta.linkText")}
                />
            </>
        );
    }

    return (
        <>
            <Head title={categoryTitle} />
            <div className="min-h-screen">
                <HeroStatic
                    imageSrc="/images/office-2.jpg"
                    title={categoryTitle}
                    description={categoryDescription}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 md:mt-16 lg:mt-20">
                    <ProductCategoriesDetail
                        products={products || []}
                        categorySlug={categorySlug}
                    />
                </div>

                <CallToAction
                    title={t("productPage.cta.title")}
                    linkText={t("productPage.cta.linkText")}
                />
            </div>
        </>
    );
};

export default ProductCategoryDetailPage;
