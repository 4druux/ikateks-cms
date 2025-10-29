import { useTranslation } from "react-i18next";
import Hero from "@/Components/ui/users/Hero";
import CallToAction from "@/Components/ui/users/CallToAction";
import { ArrowLeft } from "lucide-react";
import ProductDetail from "@/Components/products/ProductDetail";
import { Head, Link } from "@inertiajs/react";
import useSWR from "swr";
import { Category, Product, fetcher } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

interface ProductDetailResponse {
    product: Product;
    category: Category;
    relatedProducts: Product[];
}

interface ProductDetailProps {
    categorySlug: string;
    productSlug: string;
}

const ProductDetailPage = ({ productSlug }: ProductDetailProps) => {
    const { t, i18n } = useTranslation(["product", "common"]);

    const { data, error, isLoading } = useSWR<ProductDetailResponse>(
        productSlug ? `/api/products/${productSlug}` : null,
        fetcher
    );

    const currentProduct = data?.product;
    const categoryData = data?.category;
    const relatedProducts = data?.relatedProducts;

    const productName = currentProduct
        ? i18n.language === "id"
            ? currentProduct.name_id
            : currentProduct.name
        : t("product.notFound.productTitle");

    const categoryTitle = categoryData
        ? i18n.language === "id"
            ? categoryData.title_id
            : categoryData.title
        : "";

    if (isLoading) {
        return (
            <>
                <Head title={t("common:nav.products")} />
                <Hero
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

    if (error || !currentProduct || !categoryData) {
        return (
            <>
                <Head title={t("common:nav.products")} />

                <Hero
                    imageSrc="/images/office-2.jpg"
                    title={t("productPage.hero.title")}
                    description={t("productPage.hero.description")}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 py-20 min-h-[50vh] flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-center">
                        {t("product.notFound.productTitle")}
                    </h1>
                    <p className="mt-4 text-lg text-center">
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
            <Head title={productName} />
            <div className="min-h-screen">
                <Hero
                    imageSrc="/images/office-2.jpg"
                    title={productName}
                    description={`${t(
                        "product.headings.category"
                    )}: ${categoryTitle}`}
                />

                <ProductDetail
                    currentProduct={currentProduct}
                    relatedProducts={relatedProducts || []}
                    categorySlug={categoryData.slug} 
                    categoryTitle={categoryTitle}
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
