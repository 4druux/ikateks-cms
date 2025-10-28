import {
    productCategories as staticProductCategoryData,
    type TranslatedProductCategoryItem,
    type StaticProductCategoryItem,
} from "../../data/product-categories";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Link } from "@inertiajs/react";

const slugify = (str: string) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
};

interface ProductCategoriesContentProps {
    item: TranslatedProductCategoryItem;
}

const ProductCategoriesContent = ({ item }: ProductCategoriesContentProps) => {
    const slug = slugify(item.i18nKey);

    return (
        <Link href={`/products/${slug}`} className="block group">
            <div className="relative h-80 w-full overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <h3 className="text-xl font-bold transition-transform duration-300">
                        {item.title}
                    </h3>
                    <p className="md:max-h-0 text-zinc-200 opacity-100 md:opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100 line-clamp-2">
                        {item.description}
                    </p>
                </div>
            </div>
        </Link>
    );
};

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
    const { t } = useTranslation("product");

    const translatedProductCategories: TranslatedProductCategoryItem[] =
        staticProductCategoryData.map((item: StaticProductCategoryItem) => {
            const translations = t(`product.${item.i18nKey}`, {
                returnObjects: true,
            }) as Omit<TranslatedProductCategoryItem, "id" | "img" | "i18nKey">;

            return {
                ...item,
                ...translations,
            };
        });

    const categoriesToShow = limit
        ? translatedProductCategories.slice(0, limit)
        : translatedProductCategories;

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
                {categoriesToShow.map((item) => (
                    <ProductCategoriesContent key={item.id} item={item} />
                ))}
            </div>

            {showViewAllButton && (
                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="text-red-700 font-medium border px-4 py-3 border-red-800 hover:bg-red-800 hover:text-white transition-colors duration-300 inline-flex items-center group"
                    >
                        {t("product.viewAll")}
                        <ArrowRight className="ml-1 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ProductCategories;
