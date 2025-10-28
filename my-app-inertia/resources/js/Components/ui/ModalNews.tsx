import React, { useRef } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { type TranslatedNewsItem } from "../../data/news";
import { useTranslation } from "react-i18next";

interface ModalProps {
  item: TranslatedNewsItem;
  allNews: TranslatedNewsItem[];
  onClose: () => void;
  onChangeItem: (item: TranslatedNewsItem) => void;
}
const ModalNews = ({ item, allNews, onClose, onChangeItem }: ModalProps) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleItemClick = (news: TranslatedNewsItem) => {
    onChangeItem(news);
    modalRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const sheetVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
    exit: { y: "100%" },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end bg-black/80 backdrop-blur-sm"
      onClick={handleOverlayClick}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.div
        ref={modalRef}
        className="relative flex flex-col md:flex-row w-full h-[95dvh] bg-white text-zinc-900 rounded-t-2xl overflow-y-auto md:overflow-hidden"
        variants={sheetVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="sticky md:absolute top-3 right-3 md:top-5 md:right-5 z-20 p-2 rounded-full text-zinc-600 transition-colors bg-white/50 hover:bg-zinc-100 hover:text-zinc-900 self-end mr-3"
          aria-label={t("modal.close")}
        >
          <X size={24} />
        </button>

        <div
          className="md:flex-[2] md:h-full md:overflow-y-auto -mt-10 md:-mt-0"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <img
            src={item.img}
            alt={item.title}
            className="h-[60dvh] md:h-[45dvh] w-full object-cover"
          />

          <div className="p-4 md:p-6">
            <h2 className="mb-2 text-3xl font-bold text-zinc-800">
              {item.title}
            </h2>

            <div className="mb-6 flex flex-wrap gap-2">
              {item.keywords.split(",").map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-900"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>

            <h3 className="text-xl font-semibold text-zinc-800">
              {t("modal.description")}
            </h3>
            <p className="mb-4 leading-relaxed text-zinc-700">
              {item.description}
            </p>

            <h3 className="text-xl font-semibold text-zinc-800">
              {t("modal.whyMeruBrings")}
            </h3>
            <p className="leading-relaxed text-zinc-700">
              {item.whyMeruBrings}
            </p>
          </div>
        </div>

        <div
          className="bg-zinc-50 md:flex-[1] md:h-full md:overflow-y-auto md:border-l md:border-zinc-200 flex flex-col p-4 md:p-6 gap-4"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <h4 className="text-xl font-semibold text-zinc-800 md:pt-4">
            {t("modal.ourNews")}
          </h4>

          {allNews.map((news) => (
            <button
              key={news.id}
              onClick={() => handleItemClick(news)}
              className={`relative w-full h-80 flex-shrink-0 rounded-lg overflow-hidden shadow-md transition-all duration-300 group focus:outline-none ${
                item.id === news.id
                  ? "ring-4 ring-red-900 ring-offset-2"
                  : "hover:shadow-xl"
              }`}
            >
              <img
                src={news.img}
                alt={news.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              <h5 className="absolute bottom-4 left-4 text-white text-xl font-bold text-left drop-shadow-md">
                {news.title}
              </h5>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModalNews;
