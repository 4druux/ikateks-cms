import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CallToAction from "@/Components/ui/users/CallToAction";
import SubProductDetail from "@/Components/products/SubProductDetail";
import { Head, Link } from "@inertiajs/react";
import useSWR from "swr";
import { Category, Product, SubProduct, fetcher } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";
import { ArrowLeft } from "lucide-react";
import HeroStatic from "@/Components/ui/users/HeroStatic";

interface ProductDetailResponse {
    product: Product;
    category: Category;
    relatedProducts: Product[];
}

interface SubProductDetailPageProps {
    categorySlug: string;
    productSlug: string;
    subProductSlug: string;
}

const SubProductDetailPage = ({
    productSlug,
    categorySlug,
    subProductSlug,
}: SubProductDetailPageProps) => {
    const { t, i18n } = useTranslation(["product", "common"]);

    const { data, error, isLoading } = useSWR<ProductDetailResponse>(
        productSlug ? `/api/products/${productSlug}` : null,
        fetcher
    );

    const { currentProduct, categoryData, currentSubProduct } = useMemo(() => {
        const currentProduct = data?.product;
        const categoryData = data?.category;
        const relatedProducts = data?.relatedProducts;

        const currentSubProduct = (currentProduct as any)?.sub_products?.find(
            (sp: SubProduct) => sp.slug === subProductSlug
        );

        return {
            currentProduct,
            categoryData,
            relatedProducts,
            currentSubProduct,
        };
    }, [data, subProductSlug]);

    const subProductName = currentSubProduct
        ? i18n.language === "id"
            ? currentSubProduct.name_id
            : currentSubProduct.name
        : t("common:loading...");

    const categoryTitle = categoryData
        ? i18n.language === "id"
            ? categoryData.title_id
            : categoryData.title
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

    if (error || !currentProduct || !categoryData || !currentSubProduct) {
        return (
            <>
                <Head title={t("common:nav.products")} />
                <HeroStatic
                    imageSrc="/images/office-2.jpg"
                    title={t("productPage.hero.title")}
                    description={t("productPage.hero.description")}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 min-h-[50vh] flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold text-center">
                        {t("product.notFound.productTitle", "Not Found")}
                    </h1>
                    <p className="mt-4 text-lg text-center">
                        {t(
                            "product.notFound.productDescription",
                            "This sub-product could not be found."
                        )}
                    </p>
                    <div className="text-center mt-6">
                        <Link
                            href={`/products/${categorySlug}/${productSlug}`}
                            className="text-red-700 font-medium border px-4 py-3 border-red-800 hover:bg-red-800 hover:text-white transition-colors duration-300 inline-flex items-center group"
                        >
                            <ArrowLeft className="mr-1 w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                            {t(
                                "product.navigation.backToProduct",
                                "Back To Product"
                            )}{" "}
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
            <Head title={subProductName} />
            <div className="min-h-screen">
                <HeroStatic
                    imageSrc="/images/office-2.jpg"
                    title={subProductName}
                    description={`${t(
                        "product.headings.category"
                    )}: ${categoryTitle}`}
                />

                <SubProductDetail
                    currentSubProduct={currentSubProduct}
                    currentProduct={currentProduct}
                    categoryData={categoryData}
                />

                <CallToAction
                    title={t("productPage.cta.title")}
                    linkText={t("productPage.cta.linkText")}
                />
            </div>
        </>
    );
};

export default SubProductDetailPage;
