import Lenis from "lenis";
import { Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import Hero from "@/Components/ui/users/Hero";
import Principals from "@/Components/principals/Principals";
import CallToAction from "@/Components/ui/users/CallToAction";
import DotLoader from "@/Components/ui/DotLoader";
import { PageHero, PrincipalLogo, fetcher } from "@/Utils/api";
import useSWR from "swr";

interface PrincipalsProps {
    lenis: Lenis | null;
}

const PrincipalsPage = ({ lenis }: PrincipalsProps) => {
    const { t } = useTranslation(["principals", "common", "home"]);

    const {
        data: heroData,
        error: heroError,
        isLoading: isLoadingHero,
    } = useSWR<PageHero>("/api/hero?page=principals", fetcher);

    const {
        data: principalsData,
        error,
        isLoading,
    } = useSWR<PrincipalLogo[]>("/api/principals-logo", fetcher);

    const TotalError = heroError || error;
    const TotalLoading = isLoadingHero || isLoading;

    return (
        <>
            <Head title={t("common:nav.principals")} />

            <div className="min-h-screen bg-zinc-50">
                <Hero
                    heroData={heroData}
                    isLoading={TotalLoading}
                    fallbackImage="https://placehold.co/800x600?text=Placeholder+4:3&font=roboto"
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 md:mt-16 lg:mt-20 xl:mt-24 2xl:mt-28 space-y-16 md:space-y-20 lg:space-y-24 xl:space-y-32 2xl:space-y-40">
                    <Principals lenis={lenis} />

                    <section>
                        <div className="text-left lg:text-center mb-12 md:mb-16">
                            <h2 className="roboto-medium text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-4xl mx-auto uppercase text-zinc-800">
                                {t("home:homePage.customer.headline")}{" "}
                                <span className="roboto-medium text-red-900 font-extrabold">
                                    {t("home:homePage.customer.headlineSpan")}{" "}
                                </span>
                            </h2>
                            <p className="text-2xl text-zinc-600 lg:max-w-2xl lg:mx-auto">
                                {t("home:homePage.customer.description")}{" "}
                            </p>
                        </div>

                        {TotalLoading && (
                            <div className="flex justify-center items-center h-40">
                                <DotLoader />
                            </div>
                        )}

                        {TotalError && (
                            <p className="text-center text-red-600">
                                Failed to load principal logos.
                            </p>
                        )}

                        {!TotalLoading &&
                            !TotalError &&
                            principalsData &&
                            principalsData.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                    {principalsData.map((principal) => (
                                        <div
                                            key={principal.id}
                                            className="flex items-center justify-center transition-all duration-300 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 p-4"
                                        >
                                            <img
                                                src={
                                                    principal.image_url ??
                                                    "/images/placeholder.jpg"
                                                }
                                                alt={`Principal ${principal.id}`}
                                                className="h-28 md:h-40 w-auto object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        "/images/placeholder.jpg";
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                        {!TotalLoading &&
                            !TotalError &&
                            (!principalsData ||
                                principalsData.length === 0) && (
                                <p className="text-center text-zinc-600">
                                    No principal logos available at the moment.
                                </p>
                            )}
                    </section>
                </div>

                <CallToAction
                    title={t("principalsPage.cta.title")}
                    linkText={t("principalsPage.cta.linkText")}
                />
            </div>
        </>
    );
};

export default PrincipalsPage;
