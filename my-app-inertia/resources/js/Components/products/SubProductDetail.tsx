import { ArrowLeft, Phone } from "lucide-react";
import { Product, SubProduct, Category } from "@/Utils/api";
import { useTranslation } from "react-i18next";
import { Link } from "@inertiajs/react";
import ProductContent from "../ui/ProductContent";

interface SubProductDetailProps {
    currentSubProduct: SubProduct;
    currentProduct: Product;
    categoryData: Category;
}

const SubProductDetail = ({
    currentSubProduct,
    currentProduct,
    categoryData,
}: SubProductDetailProps) => {
    const { t, i18n } = useTranslation("product");

    const allSubProducts: SubProduct[] =
        (currentProduct as any).sub_products || [];

    const relatedSubProducts = allSubProducts.filter(
        (sp) => sp.id !== currentSubProduct.id
    );

    const subProductName =
        i18n.language === "id"
            ? currentSubProduct.name_id
            : currentSubProduct.name;

    const subProductDescription =
        i18n.language === "id"
            ? currentSubProduct.description_id
            : currentSubProduct.description;

    const phoneNumber = "6282211232801";
    const message = t("product.cta.waMessage", {
        productName: subProductName,
    });
    const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
    )}`;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 md:mt-16 lg:mt-20">
            <Link
                href={`/products/${categoryData.slug}/${currentProduct.slug}`}
                className="text-red-800 font-medium hover:underline inline-flex items-center group mb-2"
            >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                {t("product.navigation.backToProduct", "Back to ")}{" "}
                {i18n.language === "id"
                    ? currentProduct.name_id
                    : currentProduct.name}
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 lg:gap-20">
                <div className="w-full aspect-[4/3] relative overflow-hidden group">
                    <img
                        src={currentSubProduct.image_url}
                        alt={subProductName}
                        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-800 uppercase">
                        {subProductName}
                    </h1>
                    <p className="mt-1 text-lg text-zinc-600 whitespace-pre-wrap">
                        {subProductDescription}
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

            {relatedSubProducts.length > 0 && (
                <div className="mt-20 md:mt-28">
                    <h2 className="text-3xl font-bold text-zinc-800 mb-8 border-b pb-4">
                        {t(
                            "product.headings.relatedSubProducts",
                            "Related Sub-Products"
                        )}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedSubProducts.map((subProduct) => {
                            const title =
                                i18n.language === "id"
                                    ? subProduct.name_id
                                    : subProduct.name;
                            const description =
                                i18n.language === "id"
                                    ? subProduct.description_id
                                    : subProduct.description;

                            return (
                                <ProductContent
                                    key={subProduct.id}
                                    imageUrl={subProduct.image_url}
                                    title={title}
                                    description={description}
                                    href={`/products/${categoryData.slug}/${currentProduct.slug}/${subProduct.slug}`}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubProductDetail;
