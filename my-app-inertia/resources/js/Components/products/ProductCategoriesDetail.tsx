import { ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Product } from "@/Utils/api"; 
import { useTranslation } from "react-i18next"; 
import ProductContent from "../ui/ProductContent";

interface ProductCategoriesDetailProps {
    products: Product[]; 
    categorySlug: string;
}

const ProductCategoriesDetail = ({
    products,
    categorySlug,
}: ProductCategoriesDetailProps) => {
    const { t, i18n } = useTranslation("product");

    if (products && products.length > 0) {
        return (
            <div className="mt-12 md:mt-20">
                <div className="flex items-center gap-1 mb-4">
                    <div className="flex flex-col justify-center items-start">
                        <Link
                            href="/products"
                            className="text-red-800 font-medium hover:underline inline-flex items-center group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                            {t("product.navigation.backToCategories")}{" "}
                        </Link>

                        <h2 className="text-xl md:text-2xl font-medium text-zinc-800">
                            {t("product.headings.productsInCategory")}{" "}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const title =
                            i18n.language === "id"
                                ? product.name_id
                                : product.name;
                        const description =
                            i18n.language === "id"
                                ? product.description_id
                                : product.description;

                        return (
                            <ProductContent
                                key={product.id}
                                imageUrl={product.image_url}
                                title={title}
                                description={description}
                                href={`/products/${categorySlug}/${product.slug}`}
                            />
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <p className="mt-12 md:mt-20 text-lg text-zinc-600 text-center">
            {t("product.common.noProducts")}
        </p>
    );
};

export default ProductCategoriesDetail;
