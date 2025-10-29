import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import Button from "@/Components/common/Button";
import ProductContent from "@/Components/ui/ProductContent";
import useSWR from "swr";
import { Category, fetcher } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

interface ProductCategoriesProps {
    headlineKey?: string;
    headlineSpanKey?: string;
    descriptionKey?: string;
    limit?: number;
    showViewAllButton?: boolean;
}

const ProductCategories = ({
    headlineKey = "productCategoriesPage.headline",
    headlineSpanKey = "productCategoriesPage.headline-span",
    descriptionKey = "productCategoriesPage.description",
    limit,
    showViewAllButton,
}: ProductCategoriesProps) => {
    const { t, i18n } = useTranslation("product");

    const {
        data: categories,
        error,
        isLoading,
    } = useSWR<Category[]>("/api/categories", fetcher);

    const categoriesToShow = limit ? categories?.slice(0, limit) : categories;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <DotLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600">
                Gagal memuat kategori.
            </div>
        );
    }

    return (
        <div>
            <div className="text-left lg:text-center">
                <h1 className="roboto-medium text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800">
                    {t(headlineKey)}{" "}
                    <span className="roboto-medium text-red-900 font-extrabold">
                        {t(headlineSpanKey)}
                    </span>
                </h1>
                <p className="text-2xl text-zinc-600 lg:max-w-2xl lg:mx-auto">
                    {t(descriptionKey)}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-12 gap-4">
                {categoriesToShow &&
                    categoriesToShow.map((item) => {
                        const title =
                            i18n.language === "id"
                                ? item.title_id
                                : item.title;
                        const description =
                            i18n.language === "id"
                                ? item.description_id
                                : item.description;

                        return (
                            <ProductContent
                                key={item.id}
                                imageUrl={item.image_url}
                                title={title}
                                description={description}
                                href={`/products/${item.slug}`}
                            />
                        );
                    })}
            </div>

            {showViewAllButton && (
                <div className="text-center mt-12">
                    <Button
                        as="link"
                        href="/products"
                        variant="outline"
                        iconRight={<ArrowRight className="h-5 w-5" />}
                    >
                        {t("product.viewAll")}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProductCategories;