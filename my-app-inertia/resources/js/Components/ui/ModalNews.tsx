import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { NewsItem } from "@/Utils/api";
import { useTranslation } from "react-i18next";

interface ModalProps {
    item: NewsItem;
    allNews: NewsItem[];
    onClose: () => void;
    onChangeItem: (item: NewsItem) => void;
}
const ModalNews = ({ item, allNews, onClose, onChangeItem }: ModalProps) => {
    const { t, i18n } = useTranslation(["news", "common"]);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        modalRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [item]);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleItemClick = (news: NewsItem) => {
        onChangeItem(news);
    };

    const title = i18n.language === "id" ? item.title_id : item.title;
    const description =
        i18n.language === "id" ? item.description_id : item.description;

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
                    aria-label={t("common:modal.close")}
                >
                    <X size={24} />
                </button>

                <div
                    className="md:flex-[2] md:h-full md:overflow-y-auto -mt-10 md:-mt-0"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <img
                        src={item.image_url || "/images/placeholder.jpg"}
                        alt={title}
                        className="h-[60dvh] md:h-[45dvh] w-full object-cover"
                    />

                    <div className="p-4 md:p-6">
                        <h2 className="mb-2 text-3xl font-bold text-zinc-800">
                            {title}
                        </h2>

                        <h3 className="text-xl font-semibold text-zinc-800">
                            {t("common:modal.description")}{" "}
                        </h3>
                        <p className="mb-4 leading-relaxed text-zinc-700 whitespace-pre-wrap">
                            {description}
                        </p>
                    </div>
                </div>

                <div
                    className="bg-zinc-50 md:flex-[1] md:h-full md:overflow-y-auto md:border-l md:border-zinc-200 flex flex-col p-4 md:p-6 gap-4"
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <h4 className="text-xl font-semibold text-zinc-800 md:pt-4">
                        {t("common:modal.ourNews")}
                    </h4>

                    {allNews.map((news) => {
                        const otherTitle =
                            i18n.language === "id" ? news.title_id : news.title;

                        return (
                            <button
                                key={news.id}
                                onClick={() => handleItemClick(news)}
                                className={`relative w-full aspect-[4/3] flex-shrink-0 rounded-lg overflow-hidden shadow-md transition-all duration-300 group focus:outline-none ${
                                    item.id === news.id
                                        ? "ring-4 ring-red-900 ring-offset-2"
                                        : "hover:shadow-xl"
                                }`}
                            >
                                <img
                                    src={
                                        news.image_url ||
                                        "/images/placeholder.jpg"
                                    }
                                    alt={otherTitle}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                                <h5 className="absolute bottom-4 left-4 text-white text-lg font-bold text-left drop-shadow-md line-clamp-2">
                                    {" "}
                                    {otherTitle}
                                </h5>
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ModalNews;
