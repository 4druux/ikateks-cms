import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Lenis from "lenis";
import ModalNews from "../ui/ModalNews";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "@inertiajs/react";
import useSWR from "swr";
import { NewsItem, fetcher } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

interface DiscoverMoreCard {
    id: string;
    type: "discover";
    title: string;
    description: string;
    title_id?: string;
    description_id?: string;
    image_path?: string;
    slug?: string;
}

interface NewsProps {
    lenis: Lenis | null;
    newsSectionRef: React.RefObject<HTMLElement>;
}

type SliderItem = NewsItem | DiscoverMoreCard;

const News = ({ lenis, newsSectionRef }: NewsProps) => {
    const { t, i18n } = useTranslation("news");
    const getSlidesToShow = () => (window.innerWidth < 768 ? 1 : 3);

    const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    const [useTransition, setUseTransition] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(slidesToShow);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    const INSERT_POSITION = 5;

    const {
        data: fetchedNewsItems,
        error,
        isLoading,
    } = useSWR<NewsItem[]>("/api/news", fetcher);

    const discoverMoreCard: DiscoverMoreCard = React.useMemo(
        () => ({
            id: "discover-link",
            type: "discover",
            title: t("news.discoverMore.title"),
            description: t("news.discoverMore.description"),
        }),
        [t]
    );

    const modifiedNews: SliderItem[] = React.useMemo(() => {
        if (!fetchedNewsItems) return [discoverMoreCard];

        const news = fetchedNewsItems;

        if (news.length <= INSERT_POSITION) {
            return [...news, discoverMoreCard];
        }

        return [
            ...news.slice(0, INSERT_POSITION),
            discoverMoreCard,
            ...news.slice(INSERT_POSITION),
        ];
    }, [fetchedNewsItems, discoverMoreCard]);

    const clonesStart = modifiedNews.slice(-slidesToShow);
    const clonesEnd = modifiedNews.slice(0, slidesToShow);
    const slideItems = [...clonesStart, ...modifiedNews, ...clonesEnd];

    const handleOpenModal = useCallback((item: SliderItem) => {
        if ("slug" in item && item.slug) {
            setSelectedNews(item as NewsItem);
            const url = `/news/${item.slug}`;
            window.history.pushState({ modalOpen: true }, "", url);
        }
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedNews(null);
        window.history.replaceState(null, "", "/");
    }, []);

    const handleChangeItem = useCallback((item: NewsItem) => {
        setSelectedNews(item);
        const url = `/news/${item.slug}`;
        window.history.replaceState({ modalOpen: true }, "", url);
    }, []);

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (!event.state || !event.state.modalOpen) {
                if (selectedNews) {
                    setSelectedNews(null);
                }
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [selectedNews]);

    useEffect(() => {
        const handleResize = () => {
            const newSlidesToShow = getSlidesToShow();
            if (slidesToShow !== newSlidesToShow) {
                setSlidesToShow(newSlidesToShow);
                setUseTransition(false);
                setCurrentIndex(newSlidesToShow);
                setTimeout(() => setUseTransition(true), 50);
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

    const nextSlide = useCallback(() => {
        if (isMoving || modifiedNews.length <= 1) return;
        setIsMoving(true);
        setCurrentIndex((prev) => prev + 1);
    }, [isMoving, modifiedNews.length]);

    const prevSlide = useCallback(() => {
        if (isMoving || modifiedNews.length <= 1) return;
        setIsMoving(true);
        setCurrentIndex((prev) => prev - 1);
    }, [isMoving, modifiedNews.length]);

    useEffect(() => {
        if (isPaused || modifiedNews.length <= 1) return;
        const slideInterval = setInterval(nextSlide, 3000);
        return () => clearInterval(slideInterval);
    }, [isPaused, nextSlide, modifiedNews.length]);

    const handleTransitionEnd = () => {
        if (currentIndex >= modifiedNews.length + slidesToShow) {
            setUseTransition(false);
            setCurrentIndex(slidesToShow);
        }

        if (currentIndex < slidesToShow) {
            setUseTransition(false);
            setCurrentIndex(modifiedNews.length + slidesToShow - 1);
        }

        setIsMoving(false);
    };

    useEffect(() => {
        if (!useTransition) {
            const timer = setTimeout(() => {
                setUseTransition(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [useTransition]);

    if (isLoading) {
        return (
            <section ref={newsSectionRef}>
                <div className="flex gap-2 bg-red-950 px-4 sm:px-6 lg:px-8 xl:px-16 py-2">
                    <img
                        src="/images/Logo-ICP-Putih.png"
                        alt="Logo ICP"
                        className="w-10"
                    />
                    <h1 className="geometos text-zinc-100 font-bold tracking-wide">
                        {t("news.title")}
                    </h1>
                </div>
                <div className="relative w-full h-80 md:h-96 flex justify-center items-center bg-zinc-100">
                    <DotLoader />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section ref={newsSectionRef}>
                <div className="flex gap-2 bg-red-950 px-4 sm:px-6 lg:px-8 xl:px-16 py-2">
                    <img
                        src="/images/Logo-ICP-Putih.png"
                        alt="Logo ICP"
                        className="w-10"
                    />
                    <h1 className="geometos text-zinc-100 font-bold tracking-wide">
                        {t("news.title")}
                    </h1>
                </div>
                <div className="relative w-full h-80 md:h-96 flex justify-center items-center bg-zinc-100 text-red-600">
                    Gagal memuat berita.
                </div>
            </section>
        );
    }

    if (!fetchedNewsItems || fetchedNewsItems.length === 0) {
        return (
            <section ref={newsSectionRef}>
                <div className="flex gap-2 bg-red-950 px-4 sm:px-6 lg:px-8 xl:px-16 py-2">
                    <img
                        src="/images/Logo-ICP-Putih.png"
                        alt="Logo ICP"
                        className="w-10"
                    />
                    <h1 className="geometos text-zinc-100 font-bold tracking-wide">
                        {t("news.title")}
                    </h1>
                </div>
                <div className="relative w-full overflow-hidden">
                    <div className="flex">
                        <div
                            className="relative h-80 flex-shrink-0 md:h-96"
                            style={{ width: "100%" }}
                        >
                            <Link
                                href="/news"
                                className="group flex h-full w-full flex-col items-center justify-center bg-red-950 p-6 text-white transition-colors duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-4 text-white md:p-6">
                                    <h3 className="text-3xl font-bold md:text-5xl group-hover:underline">
                                        {discoverMoreCard.title}
                                    </h3>
                                    <p className="flex items-center mt-2 text-sm md:text-base line-clamp-2">
                                        {discoverMoreCard.description}
                                        <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-2 transition-all" />
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section ref={newsSectionRef}>
                <div className="flex gap-2 bg-red-950 px-4 sm:px-6 lg:px-8 xl:px-16 py-2">
                    <img
                        src="/images/Logo-ICP-Putih.png"
                        alt="Logo ICP"
                        className="w-10"
                    />
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
                        className="absolute top-1/2 left-4 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-100 lg:opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/40 group-hover/slider:opacity-100 disabled:opacity-30"
                        disabled={modifiedNews.length <= slidesToShow}
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <div
                        ref={sliderRef}
                        className="flex"
                        style={{
                            width: `${
                                (slideItems.length / slidesToShow) * 100
                            }%`,
                            transform: `translateX(-${
                                (currentIndex / slideItems.length) * 100
                            }%)`,
                            transition: useTransition
                                ? "transform 700ms ease-in-out"
                                : "none",
                        }}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {slideItems.map((item: SliderItem, index) => {
                            const title =
                                "title_id" in item
                                    ? i18n.language === "id"
                                        ? item.title_id
                                        : item.title
                                    : item.title;
                            const description =
                                "description_id" in item
                                    ? i18n.language === "id"
                                        ? item.description_id
                                        : item.description
                                    : item.description;

                            return (
                                <div
                                    key={`${item.id}-${index}`}
                                    className="relative h-80 flex-shrink-0 md:h-96"
                                    style={{
                                        width: `${100 / slideItems.length}%`,
                                    }}
                                >
                                    {!(
                                        "type" in item &&
                                        item.type === "discover"
                                    ) ? (
                                        <button
                                            className="relative h-full w-full overflow-hidden group/card cursor-pointer focus:outline-none"
                                            onClick={() =>
                                                handleOpenModal(item)
                                            }
                                        >
                                            <img
                                                src={
                                                    (item as NewsItem)
                                                        .image_url ||
                                                    "/images/placeholder.jpg"
                                                }
                                                alt={title}
                                                className="h-full w-full object-cover transition-all duration-500 ease-in-out group-hover/card:scale-105 group-hover/card:brightness-75"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"></div>

                                            <div className="absolute bottom-0 left-0 p-4 text-white md:p-6 pointer-events-none">
                                                <h3 className="text-xl font-bold md:text-2xl text-start line-clamp-2">
                                                    {title}
                                                </h3>
                                                <p className="mt-1 text-sm md:text-base line-clamp-2 text-start text-zinc-200">
                                                    {description}
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
                                                    {title}
                                                </h3>
                                                <p className="flex items-center mt-2 text-sm md:text-base line-clamp-2">
                                                    {description}
                                                    <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-2 transition-all" />
                                                </p>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={nextSlide}
                        aria-label={t("news.aria.next")}
                        className="absolute top-1/2 right-4 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white opacity-100 lg:opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white/40 group-hover/slider:opacity-100 disabled:opacity-30"
                        disabled={modifiedNews.length <= slidesToShow}
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>
            </section>

            <AnimatePresence>
                {selectedNews && (
                    <ModalNews
                        item={selectedNews}
                        allNews={fetchedNewsItems || []}
                        onClose={handleCloseModal}
                        onChangeItem={handleChangeItem}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default News;
