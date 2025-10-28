import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Lenis from "lenis";
import {
    news as staticNewsData,
    type TranslatedNewsItem,
} from "../../data/news";
import ModalNews from "../ui/ModalNews";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "@inertiajs/react";

interface DiscoverMoreCard {
    id: string;
    type: "discover";
    title: string;
    description: string;
    keywords: string;
    whyMeruBrings: string;
}

interface NewsProps {
    lenis: Lenis | null;
    newsSectionRef: React.RefObject<HTMLElement>;
}

type SliderItem = TranslatedNewsItem | DiscoverMoreCard;

const News = ({ lenis, newsSectionRef }: NewsProps) => {
    const { t } = useTranslation("news");
    const getSlidesToShow = () => (window.innerWidth < 768 ? 1 : 3);

    const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [useTransition, setUseTransition] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(slidesToShow);
    const [selectedNews, setSelectedNews] = useState<TranslatedNewsItem | null>(
        null
    );

    const INSERT_POSITION = 5;

    const news: TranslatedNewsItem[] = staticNewsData.map((item) => {
        const translations = t(`news.${item.i18nKey}`, {
            returnObjects: true,
        }) as {
            title: string;
            keywords: string;
            description: string;
            whyMeruBrings: string;
        };

        return {
            ...item,
            ...translations,
        };
    });

    const discoverMoreCard: DiscoverMoreCard = {
        id: "discover-link",
        type: "discover",
        title: t("news.discoverMore.title"),
        description: t("news.discoverMore.description"),
        keywords: "",
        whyMeruBrings: "",
    };

    const modifiedNews = [
        ...news.slice(0, INSERT_POSITION),
        discoverMoreCard,
        ...news.slice(INSERT_POSITION),
    ];

    const clonesStart = modifiedNews.slice(-slidesToShow);
    const clonesEnd = modifiedNews.slice(0, slidesToShow);
    const slideItems = [...clonesStart, ...modifiedNews, ...clonesEnd];

    const handleOpenModal = useCallback((item: SliderItem) => {
        if ("img" in item) {
            setSelectedNews(item as TranslatedNewsItem);
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedNews(null);
    }, []);

    const handleChangeItem = useCallback((item: TranslatedNewsItem) => {
        setSelectedNews(item);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const newSlidesToShow = getSlidesToShow();
            if (slidesToShow !== newSlidesToShow) {
                setSlidesToShow(newSlidesToShow);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [slidesToShow]);

    useEffect(() => {
        if (selectedNews) {
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
    }, [selectedNews, lenis]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setUseTransition(false);
            setCurrentIndex(slidesToShow);
        }, 0);

        return () => clearTimeout(timer);
    }, [slidesToShow]);

    const nextSlide = useCallback(() => {
        if (isMoving) return;
        setIsMoving(true);
        setCurrentIndex((prev) => prev + 1);
    }, [isMoving]);

    const prevSlide = useCallback(() => {
        if (isMoving) return;
        setIsMoving(true);
        setCurrentIndex((prev) => prev - 1);
    }, [isMoving]);

    useEffect(() => {
        if (isPaused) return;
        const slideInterval = setInterval(nextSlide, 3000);
        return () => clearInterval(slideInterval);
    }, [isPaused, nextSlide]);

    const handleTransitionEnd = () => {
        if (currentIndex >= modifiedNews.length + slidesToShow) {
            setUseTransition(false);
            setCurrentIndex(slidesToShow);
        }

        if (currentIndex < slidesToShow) {
            setUseTransition(false);
            setCurrentIndex(modifiedNews.length + slidesToShow - slidesToShow);
        }

        setIsMoving(false);
    };

    useEffect(() => {
        if (useTransition) return;
        const timer = setTimeout(() => {
            setUseTransition(true);
        }, 50);
        return () => clearTimeout(timer);
    }, [useTransition]);

    return (
        <>
            <section ref={newsSectionRef}>
                <div className="flex gap-2 bg-red-950 px-4 sm:px-6 lg:px-8 xl:px-16 py-2">
                    <img src="/images/icp-white.png" alt="" className="w-10" />
                    <h1 className="geometos text-zinc-100 font-bold tracking-wide">
                        {t("news.title")}
                    </h1>
                </div>
                <div
                    className="relative w-full overflow-hidden group/slider"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <button
                        onClick={prevSlide}
                        aria-label={t("news.aria.prev")}
                        className="absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-100 lg:opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/40 group-hover/slider:opacity-100"
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <div
                        ref={sliderRef}
                        className="flex"
                        style={{
                            transform: `translateX(-${
                                currentIndex * (100 / slidesToShow)
                            }%)`,
                            transition: useTransition
                                ? "transform 700ms ease-in-out"
                                : "none",
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {slideItems.map((item: SliderItem, index) => (
                            <div
                                key={`${item.id}-${index}`}
                                className="relative h-80 flex-shrink-0 md:h-96"
                                style={{ width: `${100 / slidesToShow}%` }}
                            >
                                {"img" in item ? (
                                    <button
                                        className="relative h-full w-full overflow-hidden group/card cursor-pointer"
                                        onClick={() => handleOpenModal(item)}
                                    >
                                        <img
                                            src={
                                                (item as TranslatedNewsItem).img
                                            }
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-all duration-500 ease-in-out group-hover/card:scale-105 group-hover/card:brightness-75"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>

                                        <div className="absolute bottom-0 left-0 p-4 text-white md:p-6 pointer-events-none">
                                            <h3 className="text-xl font-bold md:text-2xl">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 text-sm md:text-base line-clamp-2">
                                                {item.description}
                                            </p>
                                        </div>
                                    </button>
                                ) : (
                                    <Link
                                        href="/news"
                                        className="group flex h-full w-full flex-col items-center justify-center bg-red-950 p-6 text-white transition-colors duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 p-4 text-white md:p-6">
                                            <h3 className="text-3xl font-bold md:text-5xl group-hover:underline">
                                                {item.title}
                                            </h3>
                                            <p className="flex items-center mt-2 text-sm md:text-base line-clamp-2">
                                                {item.description}
                                                <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-2 transition-all" />
                                            </p>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={nextSlide}
                        aria-label={t("news.aria.next")}
                        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-100 lg:opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/40 group-hover/slider:opacity-100"
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>
            </section>

            <AnimatePresence>
                {selectedNews && (
                    <ModalNews
                        item={selectedNews}
                        allNews={news}
                        onClose={handleCloseModal}
                        onChangeItem={handleChangeItem}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default News;
