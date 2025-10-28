import { useState, useEffect } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import {
  news as staticNewsData,
  type TranslatedNewsItem,
} from "../../data/news";
import ModalNews from "../ui/ModalNews";
import { useTranslation } from "react-i18next";

interface NewsContentProps {
  item: TranslatedNewsItem;
  onClick: (item: TranslatedNewsItem) => void;
}
const NewsContent = ({ item, onClick }: NewsContentProps) => {
  const handleOpenModal = () => onClick(item);

  return (
    <div
      className="relative group h-80 w-full overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl cursor-pointer"
      onClick={handleOpenModal}
    >
      <img
        src={item.img}
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        <h3 className="text-2xl font-bold transition-transform duration-300">
          {item.title}
        </h3>
        <p className="md:max-h-0 text-zinc-200 opacity-100 md:opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100 line-clamp-2 md:line-clamp-4">
          {item.description}
        </p>
      </div>
    </div>
  );
};

const News = ({ lenis }: { lenis: Lenis | null }) => {
  const { t } = useTranslation("news");
  const [selectedItem, setSelectedItem] = useState<TranslatedNewsItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const translatedNews: TranslatedNewsItem[] = staticNewsData.map((item) => {
    const translations = t(`news.${item.i18nKey}`, {
      returnObjects: true,
    }) as Omit<TranslatedNewsItem, "id" | "img" | "i18nKey">;

    return {
      ...item,
      ...translations,
    };
  });

  const handleOpenModal = (item: TranslatedNewsItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleChangeItem = (item: TranslatedNewsItem) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    if (isModalOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "unset";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, lenis]);

  return (
    <>
      <section className="mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
          <div className="text-left lg:text-center">
            <h1 className="roboto-medium text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800">
              {t("news.headline")}{" "}
              <span className="roboto-medium text-red-900 font-extrabold">
                {t("news.headline-span")}
              </span>
            </h1>
            <p className="text-2xl text-zinc-600 lg:max-w-2xl lg:mx-auto">
              {t("news.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-12 gap-4">
            {translatedNews.map((item) => (
              <NewsContent
                key={item.id}
                item={item}
                onClick={handleOpenModal}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <ModalNews
            item={selectedItem}
            allNews={translatedNews}
            onClose={handleCloseModal}
            onChangeItem={handleChangeItem}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default News;
