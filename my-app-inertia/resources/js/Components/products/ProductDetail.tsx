import { ArrowLeft, Phone } from "lucide-react";
import { type ProductItem } from "./ProductCategoriesDetail";
import { TFunction } from "i18next";
import { Link } from "@inertiajs/react";

interface ProductDetailProps {
    currentProduct: ProductItem;
    relatedProducts: ProductItem[];
    categorySlug: string;
    categoryTitle: string;
    t: TFunction<"product", undefined>;
}

const ProductDetail = ({
    currentProduct,
    relatedProducts,
    categorySlug,
    categoryTitle,
    t,
}: ProductDetailProps) => {
    const phoneNumber = "6285810249867";
    const message = t("product.cta.waMessage", {
        productName: currentProduct.name,
    });
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
    )}`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 mt-10 md:mt-16 lg:mt-20">
            <Link
                href={`/products/${categorySlug}`}
                className="text-red-800 font-medium hover:underline inline-flex items-center group mb-2"
            >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                {t("product.navigation.backToCategory", { categoryTitle })}
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 lg:gap-20">
                <div className="w-full relative overflow-hidden group shadow-lg">
                    <img
                        src={currentProduct.img}
                        alt={currentProduct.name}
                        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-800 uppercase">
                        {currentProduct.name}
                    </h1>
                    <p className="mt-1 text-lg text-zinc-600">
                        {currentProduct.description}
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
                        {relatedProducts.map((product) => (
                            <Link
                                key={product.name}
                                href={`/products/${categorySlug}/${product.key}`}
                                className="block group"
                            >
                                <div className="relative h-64 w-full overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                                    <img
                                        src={product.img}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                                    <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                                        <h3 className="text-2xl font-bold transition-transform duration-300">
                                            {product.name}
                                        </h3>
                                        <p className="md:max-h-0 text-zinc-200 opacity-100 md:opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100 line-clamp-2">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
