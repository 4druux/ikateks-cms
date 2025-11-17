import Hero from "@/Components/ui/users/Hero";
import Tagline from "@/Components/about/Tagline";
import ContactContent from "@/Components/contact/ContactContent";
import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";
import { fetcher, PageHero } from "@/Utils/api";
import useSWR from "swr";
import DotLoader from "@/Components/ui/DotLoader";

const ContactPage = () => {
    const { t } = useTranslation(["contact", "common"]);

    const {
        data: heroData,
        error: heroError,
        isLoading: isLoadingHero,
    } = useSWR<PageHero>("/api/hero?page=contact", fetcher);

    return (
        <>
            <Head title={t("common:nav.contact")} />

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
                        Failed to load Contact page content.
                    </p>
                )}

                <ContactContent />
                <Tagline />
            </div>
        </>
    );
};

export default ContactPage;
