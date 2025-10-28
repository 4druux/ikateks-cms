export interface StaticProductCategoryItem {
  id: number;
  img: string;
  i18nKey: string;
}

export interface TranslatedProductCategoryItem
  extends StaticProductCategoryItem {
  title: string;
  description: string;
  subCategories: string[];
}

export const productCategories: StaticProductCategoryItem[] = [
  {
    id: 1,
    img: "/images/product/categories/dyes-chemical.jpg",
    i18nKey: "dyesChemical",
  },
  {
    id: 2,
    img: "/images/product/categories/fashion-material.jpg",
    i18nKey: "fashionMaterials",
  },
  {
    id: 3,
    img: "/images/product/categories/halal-product.jpg",
    i18nKey: "halalProduct",
  },
  {
    id: 4,
    img: "/images/product/categories/natural-fibers.jpg",
    i18nKey: "naturalFibers",
  },
  {
    id: 5,
    img: "/images/product/categories/special-fiber.jpg",
    i18nKey: "specialFiber",
  },
  {
    id: 6,
    img: "/images/product/categories/technical-textile.jpg",
    i18nKey: "technicalTextile",
  },
  {
    id: 7,
    img: "/images/product/categories/textile-accessories.jpg",
    i18nKey: "textileAccessories",
  },
  {
    id: 8,
    img: "/images/product/categories/textile-machineries.jpg",
    i18nKey: "textileMachineries",
  },
  {
    id: 9,
    img: "/images/product/categories/woven-fabric.jpg",
    i18nKey: "wovenFabric",
  },
  {
    id: 10,
    img: "/images/product/categories/yarn.jpg",
    i18nKey: "yarn",
  },
];
