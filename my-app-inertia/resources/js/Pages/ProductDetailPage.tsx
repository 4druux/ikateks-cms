import { useTranslation } from "react-i18next";
import {
    productCategories,
    type StaticProductCategoryItem,
} from "../data/product-categories";
import Hero from "../Components/ui/Hero";
import CallToAction from "../Components/ui/CallToAction";
import { ArrowLeft } from "lucide-react";
import { type ProductItem } from "../Components/products/ProductCategoriesDetail";
import ProductDetail from "../Components/products/ProductDetail";
import { productImages } from "../data/product";
import { TFunction } from "i18next";
import { Head, Link } from "@inertiajs/react";

interface PageCategoryData extends StaticProductCategoryItem {
    title: string;
    description: string;
    products: ProductItem[];
}

interface ProductDetailProps {
    categorySlug: string;
    productSlug: string;
}

const slugToI18nKey = (slug: string): string => {
    return slug.replace(/-(\w)/g, (_, c) => c.toUpperCase());
};

const ProductDetailPage = ({
    categorySlug,
    productSlug,
}: ProductDetailProps) => {
    const { t } = useTranslation(["product", "common"]);

    const i18nKey = categorySlug ? slugToI18nKey(categorySlug) : "";
    const staticData = productCategories.find(
        (item) => item.i18nKey === i18nKey
    );

    const translations = staticData
        ? (t(`product.${staticData.i18nKey}`, {
              returnObjects: true,
          }) as Omit<PageCategoryData, "id" | "img" | "i18nKey">)
        : null;

    const categoryData =
        staticData && translations ? { ...staticData, ...translations } : null;

    if (categoryData) {
        const imagesForThisCategory = productImages[i18nKey] || {};
        categoryData.products = categoryData.products.map(
            (product: ProductItem) => ({
                ...product,
                img:
                    imagesForThisCategory[product.key] ||
                    "/images/placeholder.jpg",
            })
        );
    }

    const currentProduct =
        categoryData?.products.find(
            (p: ProductItem) => p.key === productSlug
        ) || null;

    const relatedProducts =
        categoryData?.products.filter(
            (p: ProductItem) => p.key !== productSlug
        ) || [];

    if (!categoryData || !currentProduct) {
        return (
            <>
                <Head title={t("common:nav.products")} />

                <Hero
                    imageSrc="/images/office-2.jpg"
                    title={t("productPage.hero.title")}
                    description={t("productPage.hero.description")}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-20 h-screen flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold">
                        {t("product.notFound.productTitle")}
                    </h1>
                    <p className="mt-4 text-lg">
                        {t("product.notFound.productDescription")}
                    </p>
                    <div className="text-center mt-6">
                        <Link
                            href="/products"
                            className="text-red-700 font-medium border px-4 py-3 border-red-800 hover:bg-red-800 hover:text-white transition-colors duration-300 inline-flex items-center group"
                        >
                            <ArrowLeft className="mr-1 w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                            {t("product.navigation.backToCategories")}{" "}
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
            <Head title={t("common:nav.products")} />
            <div className="min-h-screen">
                <Hero
                    imageSrc={currentProduct.img}
                    title={currentProduct.name}
                    description={`Category: ${categoryData.title}`}
                />

                <ProductDetail
                    currentProduct={currentProduct}
                    relatedProducts={relatedProducts}
                    categorySlug={categorySlug!}
                    categoryTitle={categoryData.title}
                    t={t as TFunction<"product", undefined>}
                />

                <CallToAction
                    title={t("productPage.cta.title")}
                    linkText={t("productPage.cta.linkText")}
                />
            </div>
        </>
    );
};

export default ProductDetailPage;
