export interface StaticNewsItem {
  id: number;
  img: string;
  i18nKey: string;
}

export interface TranslatedNewsItem extends StaticNewsItem {
  title: string;
  keywords: string;
  description: string;
  whyMeruBrings: string;
}

export const news: StaticNewsItem[] = [
  { id: 1, img: "/images/news/supply-chain.jpg", i18nKey: "supplyChain" },
  { id: 2, img: "/images/news/technology.jpg", i18nKey: "technology" },
  {
    id: 3,
    img: "/images/news/manufacturing.jpg",
    i18nKey: "manufacturing",
  },
  { id: 4, img: "/images/news/healthcare.jpg", i18nKey: "healthcare" },
  { id: 5, img: "/images/news/energy.jpg", i18nKey: "energy" },
  { id: 6, img: "/images/news/banking.jpg", i18nKey: "banking" },
  { id: 7, img: "/images/news/real-estate.jpg", i18nKey: "realEstate" },
  { id: 8, img: "/images/news/travel.jpg", i18nKey: "travel" },
  {
    id: 9,
    img: "/images/news/telecommunication.jpg",
    i18nKey: "telecommunication",
  },
];
