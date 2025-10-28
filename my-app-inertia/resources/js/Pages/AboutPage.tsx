import Hero from "../Components/ui/Hero";
import AboutOne from "../Components/about/AboutOne";
import AboutTwo from "../Components/about/AboutTwo";
import Tagline from "../Components/about/Tagline";
import CompanyAdvantage from "../Components/about/CompanyAdvantage";
import AboutThree from "@/Components/about/AboutThree";
import { useTranslation } from "react-i18next";
import { Head } from "@inertiajs/react";

const AboutPage = () => {
    const { t } = useTranslation(["about", "common"]);

    return (
        <>
            <Head title={t("common:nav.about")} />

            <div className="min-h-screen bg-zinc-50">
                <Hero
                    imageSrc="/images/office-3.jpg"
                    title={t("aboutPage.hero.title")}
                    description={t("aboutPage.hero.description")}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 mt-16 md:mt-20 lg:mt-24 xl:mt-32 2xl:mt-40 space-y-16 md:space-y-20 lg:space-y-24 xl:space-y-32 2xl:space-y-40">
                    <AboutOne />
                    <AboutTwo />
                    <AboutThree />
                    <CompanyAdvantage />
                </div>

                <Tagline />
            </div>
        </>
    );
};

export default AboutPage;
