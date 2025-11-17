import Lenis from "lenis";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Hero from "@/Components/ui/users/Hero";
import CallToAction from "@/Components/ui/users/CallToAction";
import News from "@/Components/news/News";
import useSWR from "swr";
import { fetcher, PageHero } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

const NewsPage = ({
    lenis,
    initialSlug,
}: {
    lenis: Lenis | null;
    initialSlug?: string;
}) => {
    const { t } = useTranslation(["news", "common"]);

    const {
        data: heroData,
        error: heroError,
        isLoading: isLoadingHero,
    } = useSWR<PageHero>("/api/hero?page=news", fetcher);

    return (
        <>
            <Head title={t("common:nav.news")} />

            <div className="min-h-screen">
                <Hero
                    heroData={heroData}
                    isLoading={isLoadingHero}
                    fallbackImage="https://placehold.co/800x600?text=Placeholder+4:3&font=roboto"
                />

                {isLoadingHero && (
                    <div className="flex justify-center items-center h-40">
                        <DotLoader />
                    </div>
                )}

                {heroError && (
                    <p className="text-center text-red-600">
                        Failed to load News page content.
                    </p>
                )}

                <News lenis={lenis} initialSlug={initialSlug} />

                <CallToAction
                    title={t("newsPage.cta.title")}
                    linkText={t("newsPage.cta.linkText")}
                />
            </div>
        </>
    );
};

export default NewsPage;
