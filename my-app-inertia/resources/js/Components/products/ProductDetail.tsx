import { ArrowLeft, Phone } from "lucide-react";
import { Product } from "@/Utils/api";
import { useTranslation } from "react-i18next";
import { Link } from "@inertiajs/react";
import ProductContent from "../ui/ProductContent";

interface ProductDetailProps {
    currentProduct: Product;
    relatedProducts: Product[];
    categorySlug: string;
    categoryTitle: string;
}

const ProductDetail = ({
    currentProduct,
    relatedProducts,
    categorySlug,
    categoryTitle,
}: ProductDetailProps) => {
    const { t, i18n } = useTranslation("product");

    const productName =
        i18n.language === "id" ? currentProduct.name_id : currentProduct.name;

    const productDescription =
        i18n.language === "id"
            ? currentProduct.description_id
            : currentProduct.description;

    const phoneNumber = "6285810249867";
    const message = t("product.cta.waMessage", {
        productName: productName,
    });
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
    )}`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 md:mt-16 lg:mt-20">
            <Link
                href={`/products/${categorySlug}`}
                className="text-red-800 font-medium hover:underline inline-flex items-center group mb-2"
            >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                {t("product.navigation.backToCategory", { categoryTitle })}
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 lg:gap-20">
                <div className="w-full aspect-[4/3] relative overflow-hidden group">
                    <img
                        src={currentProduct.image_url}
                        alt={productName}
                        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-800 uppercase">
                        {productName}
                    </h1>
                    <p className="mt-1 text-lg text-zinc-600 whitespace-pre-wrap">
                        {productDescription}
                    </p>

                    <div className="text-start mt-6">
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-700 font-medium border px-4 py-3 border-red-800 hover:bg-red-800 hover:text-white transition-colors duration-300 inline-flex items-center group"
                        >
                            <Phone className="w-5 h-5 mr-2" />
                            {t("product.cta.askOnWhatsApp")}
                        </a>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-20 md:mt-28">
                    <h2 className="text-3xl font-bold text-zinc-800 mb-8 border-b pb-4">
                        {t("product.headings.relatedProducts")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedProducts.map((product) => {
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
            )}
        </div>
    );
};

export default ProductDetail;
