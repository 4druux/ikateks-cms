import { ArrowLeft } from "lucide-react";
import { TFunction } from "i18next";
import { Link } from "@inertiajs/react";

export interface ProductItem {
  key: string;
  name: string;
  description: string;
  img: string;
}

interface ProductCategoriesDetailProps {
  products: ProductItem[];
  categorySlug: string;
  t: TFunction<"product", undefined>;
}

const ProductCategoriesDetail = ({
  products,
  categorySlug,
  t,
}: ProductCategoriesDetailProps) => {
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
          {products.map((product) => (
            <Link
              key={product.key}
              href={`/products/${categorySlug}/${product.key}`}
              className="relative group h-80 w-full overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl"
            >
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
            </Link>
          ))}
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
