import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";
import Hero from "@/Components/ui/users/Hero";
import PrivacyPolicyContent from "@/Components/privacy/PrivacyPolicyContent";
import Tagline from "@/Components/about/Tagline";
import useSWR from "swr";
import { fetcher, PageHero } from "@/Utils/api";
import DotLoader from "@/Components/ui/DotLoader";

const PrivacyPolicyPage = () => {
    const { t } = useTranslation(["privacy", "common"]);

    const {
        data: heroData,
        error: heroError,
        isLoading: isLoadingHero,
    } = useSWR<PageHero>("/api/hero?page=privacy", fetcher);

    return (
        <>
            <Head title={t("common:nav.privacy")} />

            <div className="min-h-screen bg-zinc-50">
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
                        Failed to load Privacy Policy  page content.
                    </p>
                )}

                <PrivacyPolicyContent />

                <Tagline />
            </div>
        </>
    );
};

export default PrivacyPolicyPage;
