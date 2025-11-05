import { useRef } from "react";
import { Head } from "@inertiajs/react";
import Hero from "@/Components/home/Hero";
import News from "@/Components/home/News";
import ProductCategories from "@/Components/products/ProductCategories";
import Grow from "@/Components/home/Grow";
import CallToAction from "@/Components/ui/users/CallToAction";
import { useTranslation } from "react-i18next";
import Principals from "@/Components/principals/Principals";
import Customer from "@/Components/home/Customer";
import { useLenis } from "@/Context/LenisContext";
import AboutSection, { AboutItem } from "@/Components/about/AboutSection";
import DotLoader from "@/Components/ui/DotLoader";
import { fetcher } from "@/Utils/api";
import useSWR from "swr";

export default function HomePage() {
    const { t } = useTranslation(["home", "about", "principals", "product"]);
    const newsSectionRef = useRef<HTMLElement>(null!);
    const lenis = useLenis();

    const { data: aboutItems, isLoading: isLoadingAbout } = useSWR<AboutItem[]>(
        "/api/about",
        fetcher
    );

    const firstAboutItem = aboutItems?.[0];

    const handleScrollDown = () => {
        if (newsSectionRef.current) {
            lenis?.scrollTo(newsSectionRef.current, {
                duration: 1.5,
                easing: (t: number) =>
                    Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
        }
    };

    return (
        <>
            <Head title="PT Ikateks" />
            <div className="min-h-screen bg-zinc-50">
                <Hero onScrollDown={handleScrollDown} />
                <News lenis={lenis} newsSectionRef={newsSectionRef} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 space-y-16 md:space-y-20 lg:space-y-24 xl:space-y-32 2xl:space-y-40">
                    {isLoadingAbout ? (
                        <div className="flex justify-center py-10">
                            <DotLoader />
                        </div>
                    ) : (
                        <>
                            {firstAboutItem && (
                                <AboutSection
                                    item={firstAboutItem}
                                    isReversed={firstAboutItem.id % 2 !== 0}
                                    showViewAllButton={true}
                                />
                            )}

                            <ProductCategories
                                headlineKey="product.headline"
                                headlineSpanKey="product.headline-span"
                                descriptionKey="product.description"
                                limit={6}
                                showViewAllButton={true}
                            />
                            <Grow />
                            <Principals
                                lenis={lenis}
                                limit={6}
                                showViewAllButton={true}
                            />
                            <Customer />
                        </>
                    )}
                </div>

                <CallToAction
                    title={t("homePage.cta.title")}
                    linkText={t("homePage.cta.linkText")}
                />
            </div>
        </>
    );
}
