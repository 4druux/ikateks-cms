import React, { useState, useEffect, useCallback } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import ModalNews from "../ui/ModalNews";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { NewsItem, fetcher } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";
import ProductContent from "@/Components/ui/ProductContent";

const News = ({
    lenis,
    initialSlug,
}: {
    lenis: Lenis | null;
    initialSlug?: string;
}) => {
    const { t, i18n } = useTranslation("news");
    const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: newsItems,
        error,
        isLoading,
    } = useSWR<NewsItem[]>("/api/news", fetcher, {
        onSuccess: (data) => {
            if (initialSlug && !selectedItem && data) {
                const itemToOpen = data.find(
                    (item) => item.slug === initialSlug
                );
                if (itemToOpen) {
                    handleOpenModal(itemToOpen, true);
                }
            }
        },
    });

    const updateUrl = useCallback((slug: string | null) => {
        const url = slug ? `/news/${slug}` : "/news";

        const currentState = window.history.state;
        if (currentState && currentState.modalOpen) {
            window.history.replaceState({ modalOpen: !!slug }, "", url);
        } else if (slug) {
            window.history.pushState({ modalOpen: true }, "", url);
        } else {
            window.history.replaceState(null, "", url);
        }
    }, []);

    const handleOpenModal = useCallback(
        (item: NewsItem, isInitial = false) => {
            setSelectedItem(item);
            setIsModalOpen(true);
            if (!isInitial) {
                updateUrl(item.slug);
            }
        },
        [updateUrl]
    );

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        updateUrl(null);
    }, [updateUrl]);

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (!event.state || !event.state.modalOpen) {
                if (isModalOpen) {
                    setIsModalOpen(false);
                }
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [isModalOpen]);

    useEffect(() => {
        if (isModalOpen) {
            lenis?.stop();
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setSelectedItem(null), 300);
            lenis?.start();
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
        return () => {
            lenis?.start();
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen, lenis]);

    const handleChangeItem = useCallback(
        (item: NewsItem) => {
            setSelectedItem(item);
            updateUrl(item.slug);
        },
        [updateUrl]
    );

    if (isLoading && !initialSlug) {
        return (
            <section className="mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
                    <div className="text-left lg:text-center mb-6 md:mb-12">
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
                    <div className="flex justify-center items-center h-64">
                        <DotLoader />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 text-center text-red-600">
                    {t("news.error")}
                </div>
            </section>
        );
    }

    const showBasicUI = isLoading && initialSlug;

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

                    {!showBasicUI && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 md:mt-12 gap-4">
                            {newsItems &&
                                newsItems.map((item) => {
                                    const title =
                                        i18n.language === "id"
                                            ? item.title_id
                                            : item.title;
                                    const description =
                                        i18n.language === "id"
                                            ? item.description_id
                                            : item.description;

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleOpenModal(item);
                                            }}
                                        >
                                            <ProductContent
                                                imageUrl={item.image_url}
                                                title={title}
                                                description={description}
                                            />
                                        </button>
                                    );
                                })}
                        </div>
                    )}

                    {(!newsItems || newsItems.length === 0) && !isLoading && (
                        <p className="text-center text-zinc-600 mt-12">
                            {t("news.empty")}
                        </p>
                    )}
                </div>
            </section>

            <AnimatePresence>
                {isModalOpen && selectedItem && (
                    <ModalNews
                        item={selectedItem}
                        allNews={newsItems || []}
                        onClose={handleCloseModal}
                        onChangeItem={handleChangeItem}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default News;
