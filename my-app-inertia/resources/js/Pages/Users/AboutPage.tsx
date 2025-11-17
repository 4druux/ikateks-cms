import Hero from "@/Components/ui/users/Hero";
import CompanyAdvantage from "@/Components/about/CompanyAdvantage";
import Tagline from "@/Components/about/Tagline";
import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";
import { AdvantageItem, fetcher, PageHero } from "@/Utils/api";
import useSWR from "swr";
import DotLoader from "@/Components/ui/DotLoader";
import AboutSection, { AboutItem } from "@/Components/about/AboutSection";

const AboutPage = () => {
    const { t } = useTranslation(["about", "common"]);

    const {
        data: aboutItems,
        error: aboutError,
        isLoading: isLoadingAbout,
    } = useSWR<AboutItem[]>("/api/about", fetcher);

    const {
        data: heroData,
        error: heroError,
        isLoading: isLoadingHero,
    } = useSWR<PageHero>("/api/hero?page=about", fetcher);

    const {
        data: advantageItems,
        error: advantageError,
        isLoading: isLoadingAdvantage,
    } = useSWR<AdvantageItem[]>("/api/company-advantages", fetcher);

    const isLoading = isLoadingAbout || isLoadingAdvantage || isLoadingHero;
    const error = aboutError || advantageError || heroError;

    return (
        <>
            <Head title={t("common:nav.about")} />

            <div className="min-h-screen bg-zinc-50">
                <Hero
                    heroData={heroData}
                    isLoading={isLoadingHero}
                    fallbackImage="https://placehold.co/800x600?text=Placeholder+4:3&font=roboto"
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 md:mt-20 lg:mt-24 xl:mt-32 2xl:mt-40 space-y-16 md:space-y-20 lg:space-y-24 xl:space-y-32 2xl:space-y-40">
                    {isLoading && (
                        <div className="flex justify-center py-10">
                            <DotLoader />
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-600">
                            Failed to load page content.
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            {aboutItems &&
                                aboutItems.map((item) => (
                                    <AboutSection
                                        key={item.id}
                                        item={item}
                                        isReversed={item.id % 2 !== 0}
                                    />
                                ))}

                            {advantageItems && (
                                <CompanyAdvantage items={advantageItems} />
                            )}
                        </>
                    )}
                </div>

                <Tagline />
            </div>
        </>
    );
};

export default AboutPage;
